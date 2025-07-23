from fastapi import FastAPI, HTTPException, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import yt_dlp
import uvicorn
import httpx
import re
import os
import sys
import io
import logging
from typing import Optional, Dict, Any, List, Union
import time
import asyncio
from pydantic import BaseModel
import random
import json

# Check if pytube is available, but don't fail if it's not
try:
    import pytube
    PYTUBE_AVAILABLE = True
except ImportError:
    pytube = None  # type: ignore
    PYTUBE_AVAILABLE = False
    print("pytube not available, will use yt-dlp only")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("python-downloader")

app = FastAPI(title="YouTube Downloader Python Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache for video info to reduce API calls
video_info_cache = {}
CACHE_EXPIRY = 3600  # 1 hour in seconds

# User agents to rotate
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
]

def get_enhanced_yt_dlp_opts(format_selector="best", cookies=None):
    """Get enhanced yt-dlp options with cookies and anti-detection measures"""
    user_agent = get_random_user_agent()
    opts = {
        'quiet': True,
        'no_warnings': True,
        'format': format_selector,
        'cookiefile': 'cookies.txt',
        'http_headers': {
            'User-Agent': user_agent,
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.youtube.com/',
            'Origin': 'https://www.youtube.com',
        },
        'retries': 5,
        'fragment_retries': 5,
        'youtube_include_dash_manifest': False,
        'socket_timeout': 30,
        'geo_bypass': True,
        'geo_bypass_country': 'IN',
        'geo_bypass_ip_block': 'IN',
        'concurrent_fragment_downloads': 4,
        'external_downloader': 'aria2c',
        'external_downloader_args': ['-x', '16', '-k', '1M'],
        'max_filesize': 1024*1024*1024, # 1GB
        'extract_flat': False,
        'prefer_free_formats': True,
        'allow_unplayable_formats': True,
        'writesubtitles': False,
        'writeautomaticsub': False,
        'noplaylist': True,
        'source_address': '0.0.0.0',
    }
    return opts

def load_cookies():
    """Load cookies from cookies.txt file in Netscape format"""
    cookies_file = "cookies.txt"
    cookies = {}
    
    if os.path.exists(cookies_file):
        try:
            with open(cookies_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    # Skip comments and empty lines
                    if line.startswith('#') or not line:
                        continue
                    
                    # Parse Netscape cookie format: domain flag path secure expiration name value
                    parts = line.split('\t')
                    if len(parts) >= 7:
                        domain, flag, path, secure, expiration, name, value = parts[:7]
                        # Only add cookies that haven't expired and are for YouTube
                        if 'youtube.com' in domain and int(expiration) > time.time():
                            cookies[name] = value
            
            logger.info(f"Loaded {len(cookies)} valid YouTube cookies from {cookies_file}")
            return cookies
        except Exception as e:
            logger.warning(f"Failed to load cookies: {e}")
    else:
        logger.info("No cookies.txt file found, will try without cookies")
    
    return {}

def get_random_user_agent():
    """Get a random user agent"""
    return random.choice(USER_AGENTS)

# Model for video information
class VideoInfo(BaseModel):
    title: str
    author: str
    length_seconds: int
    formats: Dict[str, List[Dict[str, Any]]]

# Create router for YouTube functionality
router = APIRouter()

@router.get("/youtube/formats")
async def get_youtube_formats(url: str = Query(...)):
    """
    Returns available video and audio formats for a YouTube URL.
    Similar to y2mate.get in Node.js.
    """
    try:
        ydl_opts = get_enhanced_yt_dlp_opts()
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if not info:
                raise Exception("Could not extract video information")
            
            formats = {"video": {}, "audio": {}}
            
            for fmt in info.get('formats', []):
                if fmt is None or not isinstance(fmt, dict):
                    continue
                
                quality = fmt.get('format_id', 'unknown')
                file_size = fmt.get('filesize', fmt.get('filesize_approx', None))
                file_size_h = f"{round(file_size/1024/1024,2)} MB" if file_size else 'unknown'
                
                format_info = {
                    "quality": fmt.get('height', 'unknown'),
                    "container": fmt.get('ext', 'unknown'),
                    "fps": fmt.get('fps', 'unknown'),
                    "size": file_size,
                    "fileSizeH": file_size_h,
                    "format_note": fmt.get('format_note', ''),
                    "url": fmt.get('url', '')
                }
                
                vcodec = fmt.get('vcodec', 'none')
                acodec = fmt.get('acodec', 'none')
                
                if vcodec != 'none' and acodec != 'none':
                    formats["video"][quality] = format_info
                elif acodec != 'none' and vcodec == 'none':
                    formats["audio"][quality] = format_info
            
            return {
                "title": info.get('title', 'Unknown Title'),
                "duration": info.get('duration', 0),
                "thumbnail": info.get('thumbnail', ''),
                "formats": formats
            }
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health_check():
    status = {
        "status": "healthy", 
        "time": time.strftime("%Y-%m-%d %H:%M:%S"),
        "python_version": sys.version,
        "yt_dlp_version": getattr(yt_dlp, "__version__", "unknown"),
        "pytube_available": PYTUBE_AVAILABLE,
    }
    
    if PYTUBE_AVAILABLE and pytube is not None:
        try:
            status["pytube_version"] = getattr(pytube, "__version__", "unknown")
        except AttributeError:
            status["pytube_version"] = "version_unavailable"
        
    return status

@app.get("/api/python/test-cookies")
async def test_cookies():
    """Test endpoint to check cookie loading and configuration"""
    try:
        cookies = load_cookies()
        user_agent = get_random_user_agent()
        
        return {
            "status": "success",
            "cookies_loaded": len(cookies),
            "cookie_names": list(cookies.keys()),
            "user_agent": user_agent,
            "has_login_info": "LOGIN_INFO" in cookies,
            "has_sapisid": "SAPISID" in cookies,
            "has_visitor_info": "VISITOR_INFO1_LIVE" in cookies
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/api/python/video-info")
async def get_video_info(url: str = Query(...)):
    """Get information about a YouTube video including available formats"""
    try:
        # Check cache first
        if url in video_info_cache and (time.time() - video_info_cache[url]["timestamp"]) < CACHE_EXPIRY:
            logger.info(f"Using cached info for: {url}")
            return video_info_cache[url]["info"]
        
        logger.info(f"Fetching video info for: {url}")
        
        # Try with yt-dlp first (more reliable for modern YouTube)
        try:
            # Load cookies and get enhanced options
            cookies = load_cookies()
            ydl_opts = get_enhanced_yt_dlp_opts(cookies=cookies)
            
            logger.info(f"Attempting to extract video info for: {url}")
            logger.info(f"Using {len(cookies)} cookies and enhanced headers")
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                if not info:
                    raise Exception("Could not extract video information")
                
                # Format the response
                formats = {
                    "video": [],
                    "audio": []
                }
                
                # Process formats
                for fmt in info.get('formats', []):
                    if fmt is None or not isinstance(fmt, dict):
                        continue
                        
                    format_info = {
                        "quality": fmt.get('height', 'unknown'),
                        "container": fmt.get('ext', 'unknown'),
                        "fps": fmt.get('fps', 'unknown'),
                        "size": fmt.get('filesize', 'unknown')
                    }
                    
                    # Safely check attributes
                    vcodec = fmt.get('vcodec', 'none')
                    acodec = fmt.get('acodec', 'none')
                    
                    if vcodec != 'none' and acodec != 'none':
                        formats["video"].append(format_info)
                    elif acodec != 'none' and vcodec == 'none':
                        formats["audio"].append(format_info)
                
                result = {
                    "title": info.get('title', 'Unknown Title'),
                    "duration": info.get('duration', 0),
                    "view_count": info.get('view_count', 0),
                    "uploader": info.get('uploader', 'Unknown'),
                    "formats": formats,
                    "thumbnail": info.get('thumbnail', ''),
                    "description": info.get('description', '')[:500] + "..." if info.get('description', '') else ''
                }
                
                video_info_cache[url] = {
                    "info": result,
                    "timestamp": time.time()
                }
                
                logger.info(f"Successfully extracted video info: {result['title']}")
                return result
                
        except Exception as e:
            logger.error(f"yt-dlp failed: {str(e)}")
            # Fall back to pytube if available
            if PYTUBE_AVAILABLE and pytube is not None:
                try:
                    video = pytube.YouTube(url)
                    formats = {"video": [], "audio": []}
                    
                    for stream in video.streams:
                        if hasattr(stream, 'includes_video_track') and hasattr(stream, 'includes_audio_track'):
                            if stream.includes_video_track and stream.includes_audio_track:
                                formats["video"].append({
                                    "quality": getattr(stream, 'resolution', 'unknown'),
                                    "container": getattr(stream, 'subtype', 'unknown'),
                                    "fps": getattr(stream, 'fps', 'unknown'),
                                    "size": getattr(stream, 'filesize', 'unknown')
                                })
                            elif stream.includes_audio_track and not stream.includes_video_track:
                                formats["audio"].append({
                                    "quality": f"{getattr(stream, 'abr', 'unknown')}kbps",
                                    "container": getattr(stream, 'subtype', 'unknown'),
                                    "size": getattr(stream, 'filesize', 'unknown')
                                })
                    
                    result = {
                        "title": getattr(video, 'title', 'Unknown Title'),
                        "duration": getattr(video, 'length', 0),
                        "view_count": getattr(video, 'views', 0),
                        "uploader": getattr(video, 'author', 'Unknown'),
                        "formats": formats,
                        "thumbnail": getattr(video, 'thumbnail_url', ''),
                        "description": getattr(video, 'description', '')[:500] + "..." if getattr(video, 'description', '') else ''
                    }
                    
                    video_info_cache[url] = {
                        "info": result,
                        "timestamp": time.time()
                    }
                    
                    logger.info(f"Successfully extracted video info with pytube: {result['title']}")
                    return result
                    
                except Exception as e2:
                    logger.error(f"pytube also failed: {str(e2)}")
                    raise HTTPException(status_code=500, detail=f"yt-dlp failed: {str(e)} | pytube failed: {str(e2)}")
            else:
                raise HTTPException(status_code=500, detail=f"Failed to get video information: {str(e)}")
            
    except Exception as e:
        logger.error(f"Error getting video info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get video information: {str(e)}")

@app.get("/api/python/direct-download")
async def direct_download(
    url: str = Query(...), 
    title: Optional[str] = Query(None), 
    quality: str = Query("highest"), 
    format: str = Query("video")
):
    """Stream YouTube video directly to browser for download"""
    try:
        logger.info(f"Direct download request: {url}, {format}, {quality}")
        
        # Sanitize title to handle special characters
        title_to_use = "video"
        if title:
            title_to_use = title
        else:
            # Get title from URL if not provided
            try:
                info = await get_video_info(url)
                if info and isinstance(info, dict) and "title" in info:
                    title_to_use = info["title"]
            except Exception as e:
                logger.error(f"Error getting title: {str(e)}")
                # Keep the default "video" title
                
        # Make sure title is a string and sanitize it
        if not isinstance(title_to_use, str):
            title_to_use = str(title_to_use)
            
        sanitized_title = re.sub(r'[^a-zA-Z0-9\-_\.]', '_', title_to_use)
        
        # Determine file extension based on format
        file_extension = "mp4" if format == "video" else "mp3"
        content_type = "video/mp4" if format == "video" else "audio/mp3"
        
        headers = {
            "Content-Disposition": f'attachment; filename="{sanitized_title}.{file_extension}"'
        }

        # Try with yt-dlp first for more reliable streaming
        try:
            # Load cookies and get enhanced options
            cookies = load_cookies()
            format_selector = 'best' if quality == "highest" else f'best[height<={quality.replace("p", "")}]' if format == "video" else 'bestaudio'
            ydl_opts = get_enhanced_yt_dlp_opts(format_selector=format_selector, cookies=cookies)
            
            # Use yt-dlp to get the direct URL
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                if not info or 'url' not in info:
                    raise Exception("Could not extract download URL from video")
                    
                download_url = info['url']
                
                # Use httpx to stream the content
                async def stream_content():
                    async with httpx.AsyncClient() as client:
                        async with client.stream('GET', download_url) as response:
                            async for chunk in response.aiter_bytes():
                                yield chunk
                
                return StreamingResponse(
                    stream_content(),
                    media_type=content_type,
                    headers=headers
                )
                
        except Exception as e:
            logger.error(f"yt-dlp download failed: {str(e)}")
            # Fall back to pytube if available
            if not PYTUBE_AVAILABLE or pytube is None:
                raise HTTPException(status_code=500, detail="pytube is not installed and yt-dlp failed")
                
            video = pytube.YouTube(url)
            
            # Select stream based on format and quality
            if format == "video":
                if quality == "highest":
                    stream = video.streams.get_highest_resolution()
                else:
                    # Try to get requested quality or fallback to closest
                    try:
                        target_res = int(quality.replace("p", ""))
                        streams = video.streams.filter(progressive=True).order_by('resolution')
                        
                        # Find the closest matching resolution
                        closest_stream = None
                        for s in streams:
                            if s and s.resolution:
                                try:
                                    stream_res = int(s.resolution.replace("p", ""))
                                    if stream_res <= target_res:
                                        closest_stream = s
                                except (ValueError, TypeError):
                                    continue
                        
                        stream = closest_stream if closest_stream else video.streams.get_highest_resolution()
                    except (ValueError, TypeError):
                        # If parsing the quality fails, fallback to highest resolution
                        stream = video.streams.get_highest_resolution()
            else:
                # Audio only
                audio_streams = video.streams.filter(only_audio=True)
                if audio_streams:
                    stream = audio_streams.order_by('abr').last()
                else:
                    stream = None
                
            if not stream:
                raise HTTPException(status_code=404, detail=f"No suitable {format} stream found")
                
            # Stream the content directly using pytube
            async def generate():
                try:
                    # Get the stream URL and download directly
                    stream_url = stream.url
                    if stream_url:
                        async with httpx.AsyncClient() as client:
                            async with client.stream('GET', stream_url) as response:
                                async for chunk in response.aiter_bytes(1024 * 1024):
                                    yield chunk
                    else:
                        yield b"Stream URL not available"
                        
                except Exception as e:
                    logger.error(f"Stream error: {str(e)}")
                    yield b"Download failed. Please try again."
                    
            return StreamingResponse(
                generate(),
                media_type=content_type,
                headers=headers
            )
            
    except Exception as e:
        logger.error(f"Direct download error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

# Include the router
app.include_router(router, prefix="/api")

# Run the FastAPI server when executed directly
if __name__ == "__main__":
    import socket
    
    # Function to find available port
    def find_available_port(start_port=8001, max_attempts=10):
        for i in range(max_attempts):
            port = start_port + i
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.bind(('localhost', port))
                    return port
            except OSError:
                continue
        return None
    
    # Find an available port
    port = find_available_port()
    if port:
        print(f"Starting Python backend on port {port}")
        uvicorn.run(app, host="0.0.0.0", port=port)
    else:
        print("No available port found for Python backend")
        exit(1)