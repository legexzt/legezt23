"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, Download, MessageCircle, ThumbsUp, ThumbsDown, 
  Share2, SkipBack, SkipForward, RotateCcw, RotateCw,
  Subtitles, Search, Clock, Eye, Menu, User, Bell, MoreVertical
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getVideoInfo } from './actions';


const suggestedVideos = [
  {
    id: 7,
    title: "Related Gaming Content | Top Plays",
    channel: "Gaming Hub",
    views: "1.2M views",
    duration: "8:45",
    thumbnail: "https://placehold.co/200x120",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
  },
  {
    id: 8,
    title: "Best Music Mix 2025",
    channel: "Music Central",
    views: "3.4M views", 
    duration: "12:30",
    thumbnail: "https://placehold.co/200x120",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: 9,
    title: "Amazing Travel Vlog",
    channel: "Adventure Time",
    views: "890K views",
    duration: "15:20",
    thumbnail: "https://placehold.co/200x120",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
  }
];

interface VideoPlayerProps {
  video: any;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger on input fields
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          skipTime(-10);
          break;
        case 'ArrowRight':
          skipTime(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => {
            const newVol = Math.min(1, prev + 0.1);
            if (videoRef.current) videoRef.current.volume = newVol;
            return newVol;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => {
            const newVol = Math.max(0, prev - 0.1);
             if (videoRef.current) videoRef.current.volume = newVol;
            return newVol;
          });
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

   useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = parseFloat(playbackSpeed);
    }
  }, [playbackSpeed]);


  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = playerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const isRightSide = clickX > rect.width / 2;

    if (isRightSide) {
      skipTime(10);
    } else {
      skipTime(-10);
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if(isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = (format: 'mp3' | 'mp4', quality?: string) => {
    // Mock download functionality
    console.log(`Downloading ${format} ${quality ? `in ${quality}` : ''}`);
    setShowDownload(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-full flex flex-col lg:flex-row">
        {/* Video Player Section */}
        <div className="flex-1 relative bg-black">
          <div 
            ref={playerRef}
            className="relative w-full h-full group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {if(isPlaying) setShowControls(false)}}
            onClick={togglePlayPause}
            onDoubleClick={handleDoubleClick}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              autoPlay
            />

            {/* Loading Overlay */}
            {!duration && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                />
              </div>
            )}

            {/* Controls Overlay */}
            <AnimatePresence>
              {(showControls || !isPlaying) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 flex flex-col justify-between p-4"
                   onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Controls */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl text-white mb-1">{video.title}</h2>
                      <p className="text-gray-300 text-sm">{video.channel}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); onClose();}}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Center Play Button */}
                  <div className="flex-1 flex items-center justify-center pointer-events-none">
                    <motion.div
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all pointer-events-auto"
                      initial={{opacity: 0, scale: 1.2}}
                      animate={{opacity: 1, scale: 1}}
                      exit={{opacity: 0}}
                      onClick={(e) => {e.stopPropagation(); togglePlayPause()}}
                    >
                      {isPlaying ? 
                        <Pause className="w-8 h-8 text-white" /> : 
                        <Play className="w-8 h-8 text-white ml-1" />
                      }
                    </motion.div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="flex items-center space-x-3 text-white text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <div className="flex-1">
                        <Slider
                          value={[currentTime]}
                          max={duration || 1}
                          step={1}
                          onValueChange={([value]) => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = value;
                              setCurrentTime(value);
                            }
                          }}
                          className="w-full"
                        />
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); skipTime(-10); }}
                          className="text-white hover:bg-white/20"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); skipTime(10); }}
                          className="text-white hover:bg-white/20"
                        >
                          <RotateCw className="w-5 h-5" />
                        </Button>

                        <div className="flex items-center space-x-2 group/volume">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                            className="text-white hover:bg-white/20"
                          >
                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </Button>
                          <div className="w-20 opacity-0 group-hover/volume:opacity-100 transition-opacity">
                            <Slider
                              value={[isMuted ? 0 : volume]}
                              max={1}
                              step={0.01}
                              onValueChange={([value]) => {
                                setVolume(value);
                                setIsMuted(value === 0);
                                if (videoRef.current) {
                                  videoRef.current.volume = value;
                                  videoRef.current.muted = value === 0;
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <div className="relative">
                           <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                            className="text-white hover:bg-white/20"
                          >
                            <Settings className="w-5 h-5" />
                          </Button>
                           {/* Settings Panel */}
                            <AnimatePresence>
                              {showSettings && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                  className="absolute bottom-12 right-0 bg-gray-900/95 backdrop-blur-md rounded-lg p-4 min-w-[250px] text-left"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-white text-sm mb-2">Quality</label>
                                      <Select value={quality} onValueChange={setQuality}>
                                        <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700">
                                          <SelectItem value="2160p">4K (2160p)</SelectItem>
                                          <SelectItem value="1440p">2K (1440p)</SelectItem>
                                          <SelectItem value="1080p">HD (1080p)</SelectItem>
                                          <SelectItem value="720p">HD (720p)</SelectItem>
                                          <SelectItem value="480p">SD (480p)</SelectItem>
                                          <SelectItem value="360p">360p</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <label className="block text-white text-sm mb-2">Playback Speed</label>
                                      <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
                                        <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700">
                                          <SelectItem value="0.25">0.25x</SelectItem>
                                          <SelectItem value="0.5">0.5x</SelectItem>
                                          <SelectItem value="0.75">0.75x</SelectItem>
                                          <SelectItem value="1">Normal</SelectItem>
                                          <SelectItem value="1.25">1.25x</SelectItem>
                                          <SelectItem value="1.5">1.5x</SelectItem>
                                          <SelectItem value="2">2x</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                          className="text-white hover:bg-white/20"
                        >
                          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-96 bg-gray-900/95 backdrop-blur-md border-l border-gray-800 flex flex-col">
          {/* Action Buttons */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1 rounded-full bg-gray-800 p-1">
                <Button
                  variant={isLiked ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => { setIsLiked(!isLiked); setIsDisliked(false); }}
                  className={`text-white rounded-full`}
                >
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  Like
                </Button>
                <Separator orientation="vertical" className="h-6 bg-gray-700" />
                <Button
                  variant={isDisliked ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => { setIsDisliked(!isDisliked); setIsLiked(false); }}
                  className={`text-white rounded-full`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                 <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDownload(!showDownload)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <Download className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Download Panel */}
            <AnimatePresence>
              {showDownload && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800 rounded-lg p-4 mb-4"
                >
                  <h4 className="text-white mb-3">Download Options</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload('mp4', '1080p')}
                        className="border-gray-700 text-white hover:bg-gray-700"
                      >
                        MP4 1080p
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload('mp4', '720p')}
                        className="border-gray-700 text-white hover:bg-gray-700"
                      >
                        MP4 720p
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload('mp4', '480p')}
                        className="border-gray-700 text-white hover:bg-gray-700"
                      >
                        MP4 480p
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload('mp3')}
                        className="border-gray-700 text-white hover:bg-gray-700"
                      >
                        MP3 Audio
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-white text-sm">2.1M views  •  3 days ago</p>
                <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                    This is an epic gaming montage featuring the best moments from 2025. Sit back, relax, and enjoy the show! #gaming #esports #montage
                </p>
            </div>
          </div>

          {/* Comments and Suggested Videos Toggle */}
           <div className="flex-grow overflow-y-auto">
                <div className="p-4">
                    <h3 className="text-white mb-4">Up Next</h3>
                    <div className="space-y-4">
                    {suggestedVideos.map((suggestedVideo) => (
                        <motion.div
                        key={suggestedVideo.id}
                        className="flex space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-800"
                        whileHover={{ x: 5 }}
                        >
                        <div className="relative flex-shrink-0">
                            <img
                            src={suggestedVideo.thumbnail}
                            alt={suggestedVideo.title}
                            data-ai-hint="gameplay screenshot"
                            className="w-32 h-20 object-cover rounded-lg group-hover:opacity-80"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                            {suggestedVideo.duration}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm line-clamp-2 group-hover:text-purple-300">
                            {suggestedVideo.title}
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">{suggestedVideo.channel}</p>
                            <p className="text-gray-500 text-xs">{suggestedVideo.views}</p>
                        </div>
                        </motion.div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

const FloatingParticles = () => {
    const [particles, setParticles] = useState<any[]>([]);
  
    useEffect(() => {
      const newParticles = Array.from({ length: 20 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 5,
        x: Math.random() * 100 - 50,
      }));
      setParticles(newParticles);
    }, []);
  
    return (
      <>
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, particle.x, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </>
    );
  };


export default function LegeztTube() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedVideoInfo, setSearchedVideoInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock fetching videos
    const mockVideos = [
        {
          id: 1,
          title: "Epic Gaming Montage 2025 | Best Moments",
          channel: "GameMaster Pro",
          views: "2.1M views",
          time: "3 days ago",
          duration: "15:42",
          thumbnail: "https://placehold.co/500x300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        },
        {
          id: 2,
          title: "Relaxing Lofi Hip Hop Beats | Study Music",
          channel: "Chill Vibes",
          views: "8.5M views",
          time: "1 week ago", 
          duration: "1:24:33",
          thumbnail: "https://placehold.co/500x300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        },
        {
          id: 3,
          title: "Amazing Nature Documentary | 4K Ultra HD",
          channel: "Wild Explorer",
          views: "5.2M views",
          time: "5 days ago",
          duration: "28:15",
          thumbnail: "https://placehold.co/500x300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        },
        {
          id: 4,
          title: "Tech Review: Latest Smartphone 2025",
          channel: "Tech Central",
          views: "1.8M views",
          time: "2 days ago",
          duration: "12:38",
          thumbnail: "https://placehold.co/500x300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        },
        {
          id: 5,
          title: "Cooking Masterclass | Italian Pasta",
          channel: "Chef's Kitchen",
          views: "3.7M views",
          time: "1 day ago",
          duration: "18:22",
          thumbnail: "https://placehold.co/500x300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
        },
        {
          id: 6,
          title: "Workout Routine | Full Body Training",
          channel: "Fitness Pro",
          views: "4.1M views",
          time: "4 days ago",
          duration: "22:45",
          thumbnail: "https://placehold.co/500x300",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
        }
      ];
    setFilteredVideos(mockVideos);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    setSearchedVideoInfo(null);
    
    try {
      const videoInfo = await getVideoInfo(searchQuery);
      setSearchedVideoInfo(videoInfo);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching video info.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,119,198,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.1),transparent_50%)]"></div>
        <FloatingParticles />
      </div>

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <Menu className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LegeztTube
                </h1>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              className="flex-1 max-w-2xl mx-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search or paste a YouTube link..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-gray-800/50 border-gray-700 rounded-full pl-6 pr-14 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                <motion.button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  animate={isSearching ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isSearching ? Infinity : 0 }}
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </motion.button>
              </form>
            </motion.div>

            {/* User Menu */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <User className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoPlayer video={selectedVideo} onClose={closeVideo} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        
        {/* Searched Video Result */}
        <AnimatePresence>
          {isSearching && (
             <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 text-center"
            >
              <p className="text-gray-400">Searching...</p>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-900/50 text-red-300 border border-red-500/50 rounded-lg"
            >
              <p>Error: {error}</p>
            </motion.div>
          )}
          {searchedVideoInfo && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Your Video:</h2>
               <div
                className="cursor-pointer group"
                onClick={() => handleVideoClick({
                    ...searchedVideoInfo,
                    videoUrl: searchedVideoInfo.mp4Formats[0]?.url // Use the best quality mp4
                })}
              >
                <Card className="bg-gray-800/50 border-gray-700/50 overflow-hidden backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <motion.img
                      src={searchedVideoInfo.thumbnail}
                      alt={searchedVideoInfo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      width={500}
                      height={300}
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-16 h-16 bg-red-600/80 rounded-full flex items-center justify-center backdrop-blur-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </motion.div>
                    </motion.div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                      {searchedVideoInfo.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {searchedVideoInfo.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-1">{searchedVideoInfo.author}</p>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Grid */}
        {!searchedVideoInfo && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence>
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="cursor-pointer group"
                onClick={() => handleVideoClick(video)}
              >
                <Card className="bg-gray-800/50 border-gray-700/50 overflow-hidden backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <motion.img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      width={500}
                      height={300}
                    />
                    
                    {/* Play overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-16 h-16 bg-red-600/80 rounded-full flex items-center justify-center backdrop-blur-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </motion.div>
                    </motion.div>

                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="text-white text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-1">{video.channel}</p>
                    <div className="flex items-center text-gray-500 text-xs space-x-2">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.views}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{video.time}</span>
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                LegeztTube
              </span>
            </div>
            <p className="text-gray-400 text-sm">&copy; 2025 LegeztTube. All rights reserved. | Premium Video Experience</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
