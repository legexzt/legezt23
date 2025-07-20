
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Download, 
  Share2, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX,
  Mic2,
  MoreHorizontal,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

const mockLyrics = [
  { time: "0:00", text: "Yeah, I feel like I'm just missing something when you're gone" },
  { time: "0:15", text: "What we had was so real, so real, so real" },
  { time: "0:30", text: "And I can't help but think about you when I'm alone" },
  { time: "0:45", text: "All these thoughts running through my head" },
  { time: "1:00", text: "I keep thinking 'bout the way you make me feel" },
  { time: "1:15", text: "When you're lying next to me" },
  { time: "1:30", text: "I can feel your heartbeat" },
  { time: "1:45", text: "And I know that this is right" },
  { time: "2:00", text: "Where we belong together" },
  { time: "2:15", text: "In this moment forever" },
  { time: "2:30", text: "Nothing else matters now" },
  { time: "2:45", text: "Just you and me somehow" },
  { time: "3:00", text: "We can make it through the night" },
];

const getAudioUrl = (musicId) => {
  const audioSamples = {
    1: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    2: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    3: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    4: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    5: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    6: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
  };
  return audioSamples[musicId] || "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3";
};

export default function MusicPlayer({ music, onBack, allMusic = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  const [activeTab, setActiveTab] = useState("player");
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioUrl = getAudioUrl(music.id);
    audio.src = audioUrl;
    audio.volume = volume / 100;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 180);
      setIsLoading(false);
      audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Autoplay failed", e));
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else if (repeatMode === 1) {
        handleNext();
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [music.id, volume, repeatMode]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current;
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audio) {
      audio.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(false);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
        setIsMuted(prev => {
            const newMuted = !prev;
            audio.muted = newMuted;
            return newMuted;
        });
    }
  };

  const handleNext = () => {
    const currentIndex = allMusic.findIndex(m => m.id === music.id);
    const nextIndex = (currentIndex + 1) % allMusic.length;
    console.log('Next song:', allMusic[nextIndex]);
    // In a real app, you would call a function passed via props to change the song
    // e.g., onNext(allMusic[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = allMusic.findIndex(m => m.id === music.id);
    const prevIndex = currentIndex === 0 ? allMusic.length - 1 : currentIndex - 1;
    console.log('Previous song:', allMusic[prevIndex]);
    // In a real app, you would call a function passed via props to change the song
    // e.g., onPrevious(allMusic[prevIndex]);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    if (repeatMode === 2) return <Repeat className="w-5 h-5" />; // Could be Repeat1 icon
    return <Repeat className="w-5 h-5" />;
  };

  const upcomingMusic = allMusic.filter(m => m.id !== music.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
      />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-3xl"></div>
        <div className="relative flex items-center justify-between p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-current" />
            </div>
            <h1 className="text-xl text-white bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Legeztify
            </h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20 mb-8">
            <TabsTrigger value="player" className="text-white data-[state=active]:bg-white/20">
              Player
            </TabsTrigger>
            <TabsTrigger value="lyrics" className="text-white data-[state=active]:bg-white/20">
              Lyrics
            </TabsTrigger>
            <TabsTrigger value="queue" className="text-white data-[state=active]:bg-white/20">
              Up Next
            </TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className={`w-80 h-80 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 transition-transform duration-300 ${isPlaying ? 'animate-pulse' : ''}`}>
                  <ImageWithFallback
                    src={music.image}
                    alt={music.title}
                    className="w-full h-full object-cover"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white">Loading...</div>
                    </div>
                  )}
                </div>
                {music.premium && (
                  <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2">
                    ✨ Premium
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-3xl text-white">{music.title}</h1>
              <p className="text-xl text-gray-300">{music.artist}</p>
              <p className="text-lg text-gray-400">{music.album}</p>
              {isLoading && <p className="text-sm text-yellow-400">Loading audio...</p>}
            </div>

            <div className="flex justify-center items-center space-x-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIsLiked(!isLiked)}
                className={`text-white hover:bg-white/20 transition-colors duration-200 ${isLiked ? 'text-pink-400' : ''}`}
              >
                <Heart className={`w-6 h-6 transition-all duration-200 ${isLiked ? 'fill-current scale-110' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 hover:text-green-400 transition-colors duration-200"
              >
                <Download className="w-6 h-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 hover:text-blue-400 transition-colors duration-200"
              >
                <Share2 className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-4">
              <Slider
                value={[currentTime]}
                max={duration || 180}
                step={1}
                onValueChange={handleTimeChange}
                className="w-full"
                disabled={isLoading}
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-6">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIsShuffled(!isShuffled)}
                className={`text-white hover:bg-white/20 transition-all duration-200 ${isShuffled ? 'text-green-400 scale-110' : ''}`}
              >
                <Shuffle className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handlePrevious}
                className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
              >
                <SkipBack className="w-6 h-6" />
              </Button>

              <Button
                onClick={handlePlayPause}
                disabled={isLoading}
                className={`w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 ${isPlaying ? 'shadow-lg shadow-pink-500/25' : ''}`}
              >
                {isLoading ? (
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleNext}
                className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
              >
                <SkipForward className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={toggleRepeat}
                className={`text-white hover:bg-white/20 transition-all duration-200 ${repeatMode > 0 ? 'text-green-400 scale-110' : ''}`}
              >
                {getRepeatIcon()}
                {repeatMode === 2 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20 transition-colors duration-200"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <div className="w-32">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                />
              </div>
              <span className="text-xs text-gray-400 w-8">{isMuted ? 0 : volume}%</span>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                🎵 Demo Mode: Real audio playback simulated for demonstration
              </p>
            </div>
          </TabsContent>

          <TabsContent value="lyrics" className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl text-white flex items-center justify-center gap-2">
                <Mic2 className="w-6 h-6" />
                Lyrics
              </h2>
              <p className="text-gray-400">{music.title} - {music.artist}</p>
            </div>

            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardContent className="p-6">
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {mockLyrics.map((line, index) => (
                      <div key={index} className="flex items-start space-x-4 hover:bg-white/5 rounded-lg p-2 transition-colors duration-200">
                        <span className="text-sm text-gray-400 min-w-[3rem]">
                          {line.time}
                        </span>
                        <p className="text-white leading-relaxed">
                          {line.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queue" className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl text-white flex items-center justify-center gap-2">
                <Music className="w-6 h-6" />
                Up Next
              </h2>
              <p className="text-gray-400">{upcomingMusic.length} songs in queue</p>
            </div>

            <div className="space-y-4">
              {upcomingMusic.map((song, index) => (
                <Card key={song.id} className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                      <ImageWithFallback
                        src={song.image}
                        alt={song.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white truncate">{song.title}</h3>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      </div>
                      <span className="text-gray-400 text-sm">{song.duration}</span>
                      {song.premium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
