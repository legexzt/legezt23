'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Download, Link, Scissors } from 'lucide-react';

export default function YoutubeDownloaderPage() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const [trim, setTrim] = useState([0, 100]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFetch = () => {
    if (url) {
      setShowPreview(true);
    }
  };

  const videoDuration = 210; // Example duration in seconds

  const formatTime = (percentage: number) => {
    const timeInSeconds = (percentage / 100) * videoDuration;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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
            />
            <Button onClick={handleFetch}>Fetch</Button>
          </div>

          {showPreview && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Image
                      src="https://placehold.co/160x90.png"
                      alt="Video thumbnail"
                      width={160}
                      height={90}
                      className="rounded-lg object-cover"
                      data-ai-hint="music video"
                    />
                    <div className="space-y-1">
                      <h3 className="font-semibold font-headline">Video Title Placeholder</h3>
                      <p className="text-sm text-muted-foreground">Channel Name</p>
                      <p className="text-sm text-muted-foreground">Duration: 03:30</p>
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
          <Button disabled={!showPreview} className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" /> Download
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
