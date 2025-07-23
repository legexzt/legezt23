# YouTube Downloader Python Backend

This is a FastAPI backend for downloading YouTube videos with support for multiple formats and quality options.

## Features

- Extract video information and available formats
- Download videos in various qualities (MP4)
- Download audio-only versions (MP3)
- Support for both yt-dlp and pytube libraries
- Cookie support for bypassing restrictions
- Caching for video information
- CORS enabled for frontend integration

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. (Optional) Create a `cookies.txt` file in Netscape format for YouTube authentication

## Running the Server

```bash
python main.py
```

The server will automatically find an available port starting from 8001.

## API Endpoints

### Health Check
- `GET /health` - Returns server status and version information

### Video Information
- `GET /api/python/video-info?url={youtube_url}` - Get video metadata and available formats

### YouTube Formats
- `GET /api/youtube/formats?url={youtube_url}` - Get detailed format information (similar to y2mate)

### Direct Download
- `GET /api/python/direct-download?url={youtube_url}&format={video|audio}&quality={highest|720p|480p|etc}` - Stream download content

### Cookie Testing
- `GET /api/python/test-cookies` - Test cookie loading functionality

## Usage with Frontend

The backend is designed to work with the existing Next.js frontend. Make sure to update your frontend API calls to point to the Python backend endpoints.

## Dependencies

- FastAPI: Web framework
- yt-dlp: Primary YouTube downloading library
- pytube: Fallback YouTube library
- uvicorn: ASGI server
- httpx: HTTP client for streaming
- pydantic: Data validation

## Note

This backend provides enhanced YouTube downloading capabilities compared to the existing ytdl-core implementation, with better format detection and download reliability.