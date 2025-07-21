
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Clock, Eye, Play
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getVideoInfo, SearchedVideoInfo } from './actions';
import Image from 'next/image';
import { VideoPlayer } from './VideoPlayer';

interface VideoPlayerInfo {
    title: string;
    channel: string;
    videoUrl: string;
}

interface VideoCardInfo {
    id: number;
    title: string;
    channel: string;
    views: string;
    time: string;
    duration: string;
    thumbnail: string;
    "data-ai-hint": string;
    videoUrl: string;
}

const FloatingParticles = () => {
    const [particles, setParticles] = useState<Array<{left: string, top: string, duration: number, delay: number, x: number}>>([]);
  
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
            className="absolute w-1 h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30"
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
  const [selectedVideo, setSelectedVideo] = useState<VideoPlayerInfo | null>(null);
  const [filteredVideos, setFilteredVideos] = useState<VideoCardInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedVideoInfo, setSearchedVideoInfo] = useState<SearchedVideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mockVideos: VideoCardInfo[] = [
        { id: 1, title: "Epic Gaming Montage 2025 | Best Moments", channel: "GameMaster Pro", views: "2.1M views", time: "3 days ago", duration: "15:42", thumbnail: "https://placehold.co/500x300", "data-ai-hint": "gaming montage", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
        { id: 2, title: "Relaxing Lofi Hip Hop Beats | Study Music", channel: "Chill Vibes", views: "8.5M views", time: "1 week ago", duration: "1:24:33", thumbnail: "https://placehold.co/500x300", "data-ai-hint": "lofi girl", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        { id: 3, title: "Amazing Nature Documentary | 4K Ultra HD", channel: "Wild Explorer", views: "5.2M views", time: "5 days ago", duration: "28:15", thumbnail: "https://placehold.co/500x300", "data-ai-hint": "nature documentary", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
        { id: 4, title: "Tech Review: Latest Smartphone 2025", channel: "Tech Central", views: "1.8M views", time: "2 days ago", duration: "12:38", thumbnail: "https://placehold.co/500x300", "data-ai-hint": "smartphone review", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
        { id: 5, title: "Cooking Masterclass | Italian Pasta", channel: "Chef's Kitchen", views: "3.7M views", time: "1 day ago", duration: "18:22", thumbnail: "https://placehold.co/500x300", "data-ai-hint": "cooking show", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
        { id: 6, title: "Workout Routine | Full Body Training", channel: "Fitness Pro", views: "4.1M views", time: "4 days ago", duration: "22:45", thumbnail: "https://placehold.co/500x300", "data-ai-hint": "gym workout", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" }
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
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleVideoClick = (video: VideoCardInfo | VideoPlayerInfo) => setSelectedVideo(video as VideoPlayerInfo);
  const closeVideo = () => setSelectedVideo(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(var(--secondary)/0.08),transparent_50%)]"></div>
        <FloatingParticles />
      </div>

      <AnimatePresence>
        {selectedVideo && <VideoPlayer video={selectedVideo} onClose={closeVideo} />}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8 relative z-10">
        
        {isSearching && ( <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 text-center"><p className="text-muted-foreground">Searching...</p></motion.div> )}
        {error && ( <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 bg-destructive/20 text-destructive-foreground border border-destructive/50 rounded-lg"><p>Error: {error}</p></motion.div> )}
        
        <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">LegeztTube</h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">Your portal to endless video content. Search, discover, and watch anything from YouTube, right here.</p>
        </div>
        
        <motion.div className="max-w-2xl mx-auto mb-12" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <form onSubmit={handleSearch} className="relative">
                <Input type="text" placeholder="Search or paste a YouTube link..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-14 bg-card border-border rounded-full pl-6 pr-14 text-lg" />
                <motion.button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} animate={isSearching ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: isSearching ? Infinity : 0 }}>
                    <Search className="w-5 h-5" />
                </motion.button>
            </form>
        </motion.div>
        
        <AnimatePresence>
          {searchedVideoInfo && (
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -50, scale: 0.9 }} className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Your Video:</h2>
               <div className="cursor-pointer group" onClick={() => handleVideoClick({ title: searchedVideoInfo.title, videoUrl: searchedVideoInfo.mp4Formats[0]?.url, channel: searchedVideoInfo.author })}>
                <Card className="bg-card/80 border-border overflow-hidden backdrop-blur-sm hover:border-primary transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <motion.div whileHover={{ scale: 1.05 }} className="w-full h-full">
                        <Image src={searchedVideoInfo.thumbnail} alt={searchedVideoInfo.title} layout="fill" objectFit="cover" className="transition-transform duration-300" />
                    </motion.div>
                    <motion.div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                      <motion.div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Play className="w-6 h-6 text-primary-foreground ml-1" /></motion.div>
                    </motion.div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">{searchedVideoInfo.duration}</div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{searchedVideoInfo.title}</h3>
                    <p className="text-muted-foreground text-sm mb-1">{searchedVideoInfo.author}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!searchedVideoInfo && (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" layout>
          <AnimatePresence>
            {filteredVideos.map((video, index) => (
              <motion.div key={video.id} initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -50, scale: 0.9 }} transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="cursor-pointer group" onClick={() => handleVideoClick(video)}>
                <Card className="bg-card/80 border-border overflow-hidden backdrop-blur-sm hover:border-primary transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <motion.div whileHover={{ scale: 1.05 }} className="w-full h-full">
                        <Image src={video.thumbnail} alt={video.title} width={500} height={300} data-ai-hint={video['data-ai-hint']} className="w-full h-full object-cover transition-transform duration-300" />
                    </motion.div>
                    <motion.div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                      <motion.div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-sm" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Play className="w-5 h-5 text-primary-foreground ml-1" /></motion.div>
                    </motion.div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">{video.duration}</div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                     <h3 className="text-foreground text-base font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-grow">{video.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{video.channel}</p>
                    <div className="flex items-center text-muted-foreground text-xs space-x-2">
                      <span className="flex items-center space-x-1"><Eye className="w-3 h-3" /><span>{video.views}</span></span>
                      <span>•</span>
                      <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{video.time}</span></span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        )}
      </main>
    </div>
  );
}
