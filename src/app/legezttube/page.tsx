"use client";

import { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Search, Download, Music, Video as VideoIcon } from 'lucide-react';
import { getVideoInfo } from './actions';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type VideoInfo = {
  title: string;
  thumbnail: string;
  author: string;
  duration: string;
  url: string;
  mp4Formats: any[];
  mp3Formats: any[];
};

export default function LegeztTubePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a YouTube URL.");
      return;
    }
    setLoading(true);
    setError(null);
    setVideoInfo(null);

    try {
      const info = await getVideoInfo(url);
      setVideoInfo(info);
    } catch (err: any) {
      setError(err.message || "Failed to fetch video information. The URL might be invalid or the video is restricted.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = (downloadUrl: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-[#00ffe7]">
            LegeztTube
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-4 md:text-xl md:max-w-2xl">
            Stream, Watch, and Download your favorite YouTube videos in high quality.
          </p>
        </header>

        <Card className="mb-8 shadow-2xl border-2 border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="text-[#00ffe7]" />
              Find Your Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube video URL here..."
                className="flex-grow text-lg p-6"
                disabled={loading}
              />
              <Button type="submit" size="lg" className="text-lg" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        {videoInfo && (
          <Card className="shadow-2xl border-2 border-primary/20 bg-card/80 backdrop-blur-sm animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00ffe7]">{videoInfo.title}</CardTitle>
              <p className="text-gray-400">by {videoInfo.author} - {videoInfo.duration}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden shadow-lg">
                  <ReactPlayer
                    url={videoInfo.url}
                    width="100%"
                    height="100%"
                    controls
                    playing
                    light={videoInfo.thumbnail}
                  />
                </AspectRatio>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <h3 className="text-xl font-semibold flex items-center gap-2"><VideoIcon /> Download Video (MP4)</h3>
                   <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                       {videoInfo.mp4Formats.map((format, i) => (
                           <Button key={i} onClick={() => handleDownload(format.url, `${videoInfo.title} - ${format.qualityLabel}.mp4`)} variant="outline" className="w-full justify-between">
                               <span>{format.qualityLabel}</span>
                               <Download className="w-4 h-4"/>
                           </Button>
                       ))}
                   </div>
                </div>
                 <div className="space-y-4">
                   <h3 className="text-xl font-semibold flex items-center gap-2"><Music /> Download Audio (MP3)</h3>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                        {videoInfo.mp3Formats.map((format, i) => (
                           <Button key={i} onClick={() => handleDownload(format.url, `${videoInfo.title}.mp3`)} variant="outline" className="w-full justify-between">
                               <span>{Math.round(format.bitrate / 1000)}kbps</span>
                               <Download className="w-4 h-4"/>
                           </Button>
                       ))}
                   </div>
                </div>
              </div>

            </CardContent>
          </Card>
        )}
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
