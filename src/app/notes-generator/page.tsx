'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { youtubeNotesGenerator, type YoutubeNotesGeneratorOutput } from '@/ai/flows/youtube-notes-generator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

export default function NotesGeneratorPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YoutubeNotesGeneratorOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeUrl.trim() || !youtubeRegex.test(youtubeUrl)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid YouTube video URL.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await youtubeNotesGenerator({ youtubeVideoLink: youtubeUrl });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An error occurred',
        description: 'Failed to generate notes. Please check the URL and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNotes = (notes: string) => {
      return notes.split('* ').filter(s => s.trim()).map((item, index) => (
          <li key={index} className="mb-2 pl-2 border-l-2 border-primary">
              {item.trim()}
          </li>
      ))
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">AI Notes Generator</CardTitle>
          <CardDescription>Paste a YouTube video link to get a bullet-point summary of its content.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={loading}
              aria-label="YouTube video URL"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Generate Notes'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {loading && (
        <Card className="mt-6">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-6 animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Bot className="h-6 w-6" /> Generated Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-inside">
                {formatNotes(result.notes)}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
