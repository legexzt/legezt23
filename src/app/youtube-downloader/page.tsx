'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Download, Link as LinkIcon, Scissors, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchYoutubeInfo, type FetchYoutubeInfoOutput } from '@/ai/flows/fetch-youtube-info';
import { downloadYoutube, type DownloadYoutubeInput } from '@/ai/flows/download-youtube';


export default function YoutubeDownloaderPage() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const [trim, setTrim] = useState([0, 100]);
  const [videoInfo, setVideoInfo] = useState<FetchYoutubeInfoOutput | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleFetch = async () => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!url.trim() || !youtubeRegex.test(url)) {
        toast({ title: 'Invalid URL', description: 'Please enter a valid YouTube URL.', variant: 'destructive' });
        return;
    }
    
    setIsFetching(true);
    setVideoInfo(null);
    try {
      const info = await fetchYoutubeInfo({ videoUrl: url });
      setVideoInfo(info);
      setTrim([0, 100]);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error fetching video', description: 'Could not fetch video details. Please check the URL and try again.', variant: 'destructive' });
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;

    setIsDownloading(true);
    try {
      const input: DownloadYoutubeInput = {
          videoUrl: url,
          format: format as 'mp3' | 'mp4',
      };

      if (format === 'mp3') {
          const startTime = (trim[0] / 100) * videoInfo.duration;
          const endTime = (trim[1] / 100) * videoInfo.duration;
          input.startTime = formatTimeForFfmpeg(startTime);
          input.endTime = formatTimeForFfmpeg(endTime);
      }
      
      const result = await downloadYoutube(input);

      // Create a link and click it to start download
      const link = document.createElement('a');
      link.href = result.dataUri;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
        console.error('Download error:', error);
        toast({ title: 'Download Failed', description: 'There was an error preparing your download.', variant: 'destructive' });
    } finally {
        setIsDownloading(false);
    }
  };

  const formatTime = (percentage: number) => {
    if (!videoInfo) return '00:00';
    const timeInSeconds = (percentage / 100) * videoInfo.duration;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const formatTimeForFfmpeg = (seconds: number) => {
    const hh = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mm = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const ss = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }


  return (
    <div className="container mx-auto max-w-3xl">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">YouTube Downloader</CardTitle>
          <CardDescription>Enter a YouTube video URL to download it as an MP3 or MP4 file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="YouTube URL"
              disabled={isFetching || isDownloading}
            />
            <Button onClick={handleFetch} disabled={isFetching || isDownloading || !url}>
              {isFetching ? <Loader2 className="animate-spin" /> : 'Fetch'}
            </Button>
          </div>

          {videoInfo && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Image
                      src={videoInfo.thumbnail}
                      alt="Video thumbnail"
                      width={160}
                      height={90}
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                    <div className="space-y-1">
                      <h3 className="font-semibold font-headline">{videoInfo.title}</h3>
                      <p className="text-sm text-muted-foreground">{videoInfo.channel}</p>
                      <p className="text-sm text-muted-foreground">Duration: {formatDuration(videoInfo.duration)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Label>Download Format</Label>
                <RadioGroup defaultValue="mp3" value={format} onValueChange={setFormat} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mp3" id="mp3" />
                    <Label htmlFor="mp3">MP3 (Audio)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mp4" id="mp4" />
                    <Label htmlFor="mp4">MP4 (Video)</Label>
                  </div>
                </RadioGroup>
              </div>

              {format === 'mp3' && (
                <div className="space-y-4">
                  <Label className="flex items-center gap-2"><Scissors className="h-4 w-4" /> Trim Audio</Label>
                  <Slider
                    defaultValue={[0, 100]}
                    value={trim}
                    onValueChange={setTrim}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={isDownloading}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Start: {formatTime(trim[0])}</span>
                    <span>End: {formatTime(trim[1])}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button disabled={!videoInfo || isDownloading || isFetching} className="w-full" size="lg" onClick={handleDownload}>
            {isDownloading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Downloading...</> : <><Download className="mr-2 h-5 w-5" /> Download</>}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
