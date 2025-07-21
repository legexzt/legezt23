
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, Download, ThumbsUp, ThumbsDown, 
  Share2, RotateCcw, RotateCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import type { videoFormat } from 'ytdl-core';

interface VideoPlayerInfo {
    title: string;
    channel: string;
    videoUrl: string;
}

interface SuggestedVideo {
    id: number;
    title: string;
    channel: string;
    views: string;
    duration: string;
    thumbnail: string;
    "data-ai-hint": string;
}

const suggestedVideos: SuggestedVideo[] = [
  {
    id: 7,
    title: "Related Gaming Content | Top Plays",
    channel: "Gaming Hub",
    views: "1.2M views",
    duration: "8:45",
    thumbnail: "https://placehold.co/200x120",
    "data-ai-hint": "gaming",
  },
  {
    id: 8,
    title: "Best Music Mix 2025",
    channel: "Music Central",
    views: "3.4M views", 
    duration: "12:30",
    thumbnail: "https://placehold.co/200x120",
    "data-ai-hint": "dj mixing",
  },
  {
    id: 9,
    title: "Amazing Travel Vlog",
    channel: "Adventure Time",
    views: "890K views",
    duration: "15:20",
    thumbnail: "https://placehold.co/200x120",
    "data-ai-hint": "nature travel",
  }
];

interface VideoPlayerProps {
  video: VideoPlayerInfo;
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
  const [quality, setQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
      } else {
          videoRef.current.pause();
          setIsPlaying(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) videoRef.current.muted = newMutedState;
  }, [isMuted]);

  const skipTime = useCallback((seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const updateTime = () => setCurrentTime(videoEl.currentTime);
    const updateDuration = () => setDuration(videoEl.duration);
    
    videoEl.addEventListener('timeupdate', updateTime);
    videoEl.addEventListener('loadedmetadata', updateDuration);
    videoEl.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      videoEl.removeEventListener('timeupdate', updateTime);
      videoEl.removeEventListener('loadedmetadata', updateDuration);
      videoEl.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      
      switch (e.key) {
        case ' ': e.preventDefault(); togglePlayPause(); break;
        case 'ArrowLeft': skipTime(-10); break;
        case 'ArrowRight': skipTime(10); break;
        case 'ArrowUp': e.preventDefault(); setVolume(prev => { const newVol = Math.min(1, prev + 0.1); if (videoRef.current) videoRef.current.volume = newVol; return newVol; }); break;
        case 'ArrowDown': e.preventDefault(); setVolume(prev => { const newVol = Math.max(0, prev - 0.1); if (videoRef.current) videoRef.current.volume = newVol; return newVol; }); break;
        case 'f': toggleFullscreen(); break;
        case 'm': toggleMute(); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayPause, toggleMute, skipTime]);

   useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = parseFloat(playbackSpeed);
    }
  }, [playbackSpeed]);


  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = playerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const isRightSide = clickX > rect.width / 2;
    if (isRightSide) skipTime(10);
    else skipTime(-10);
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
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if(isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = (format: 'mp3' | 'mp4', quality?: string) => {
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
        <div className="flex-1 relative bg-black">
          <div 
            ref={playerRef}
            className="relative w-full h-full group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {if(isPlaying) setShowControls(false)}}
            onClick={togglePlayPause}
            onDoubleClick={handleDoubleClick}
          >
            <video ref={videoRef} src={video.videoUrl} className="w-full h-full object-contain" onClick={(e) => e.stopPropagation()} autoPlay />

            {!duration && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            )}

            <AnimatePresence>
              {(showControls || !isPlaying) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 flex flex-col justify-between p-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl text-white mb-1">{video.title}</h2>
                      <p className="text-muted-foreground text-sm">{video.channel}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onClose();}} className="text-white hover:bg-white/20">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>

                  <div className="flex-1 flex items-center justify-center pointer-events-none">
                    <motion.div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all pointer-events-auto" initial={{opacity: 0, scale: 1.2}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}} onClick={(e) => {e.stopPropagation(); togglePlayPause()}}>
                      {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-white text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <div className="flex-1">
                        <Slider value={[currentTime]} max={duration || 1} step={1} onValueChange={([value]) => { if (videoRef.current) { videoRef.current.currentTime = value; setCurrentTime(value); } }} className="w-full" />
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); skipTime(-10); }} className="text-white hover:bg-white/20"><RotateCcw className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="text-white hover:bg-white/20">{isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}</Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); skipTime(10); }} className="text-white hover:bg-white/20"><RotateCw className="w-5 h-5" /></Button>
                        <div className="flex items-center space-x-2 group/volume">
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="text-white hover:bg-white/20">{isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</Button>
                          <div className="w-20 opacity-0 group-hover/volume:opacity-100 transition-opacity">
                            <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={([value]) => { setVolume(value); setIsMuted(value === 0); if (videoRef.current) { videoRef.current.volume = value; videoRef.current.muted = value === 0; } }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="relative">
                           <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} className="text-white hover:bg-white/20"><Settings className="w-5 h-5" /></Button>
                            <AnimatePresence>
                              {showSettings && (
                                <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} className="absolute bottom-12 right-0 bg-card/95 backdrop-blur-md rounded-lg p-4 min-w-[250px] text-left border border-border" onClick={(e) => e.stopPropagation()}>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-foreground text-sm mb-2">Quality</label>
                                      <Select value={quality} onValueChange={setQuality}>
                                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
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
                                      <label className="block text-foreground text-sm mb-2">Playback Speed</label>
                                      <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
                                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
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
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="text-white hover:bg-white/20">{isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="lg:w-96 bg-card/95 backdrop-blur-md border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1 rounded-full bg-background p-1">
                <Button variant={isLiked ? "secondary" : "ghost"} size="sm" onClick={() => { setIsLiked(!isLiked); setIsDisliked(false); }} className={`text-foreground rounded-full`}><ThumbsUp className="w-5 h-5 mr-2" />Like</Button>
                <Separator orientation="vertical" className="h-6 bg-border" />
                <Button variant={isDisliked ? "secondary" : "ghost"} size="sm" onClick={() => { setIsDisliked(!isDisliked); setIsLiked(false); }} className={`text-foreground rounded-full`}><ThumbsDown className="w-5 h-5" /></Button>
              </div>
              <div className="flex items-center space-x-2">
                 <Button variant="ghost" size="icon" onClick={() => setShowDownload(!showDownload)} className="text-foreground hover:bg-accent rounded-full"><Download className="w-5 h-5" /></Button>
                 <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent rounded-full"><Share2 className="w-5 h-5" /></Button>
              </div>
            </div>
            <AnimatePresence>
              {showDownload && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-background rounded-lg p-4 mb-4">
                  <h4 className="text-foreground mb-3">Download Options</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload('mp4', '1080p')}>MP4 1080p</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload('mp4', '720p')}>MP4 720p</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload('mp4', '480p')}>MP4 480p</Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload('mp3')}>MP3 Audio</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="bg-background p-3 rounded-lg">
                <p className="text-foreground text-sm">2.1M views  •  3 days ago</p>
                <p className="text-muted-foreground text-sm mt-2 line-clamp-3">This is an epic gaming montage featuring the best moments. Sit back, relax, and enjoy the show! #gaming #esports</p>
            </div>
          </div>
           <div className="flex-grow overflow-y-auto">
                <div className="p-4">
                    <h3 className="text-foreground mb-4">Up Next</h3>
                    <div className="space-y-4">
                    {suggestedVideos.map((suggestedVideo) => (
                        <motion.div key={suggestedVideo.id} className="flex space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-accent" whileHover={{ x: 5 }}>
                        <div className="relative flex-shrink-0">
                            <Image src={suggestedVideo.thumbnail} alt={suggestedVideo.title} width={128} height={80} data-ai-hint={suggestedVideo['data-ai-hint']} className="w-32 h-20 object-cover rounded-lg group-hover:opacity-80" />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">{suggestedVideo.duration}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-foreground text-sm line-clamp-2 group-hover:text-accent-foreground">{suggestedVideo.title}</h4>
                            <p className="text-muted-foreground text-xs mt-1">{suggestedVideo.channel}</p>
                            <p className="text-muted-foreground text-xs">{suggestedVideo.views}</p>
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
