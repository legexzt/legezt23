'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { visualQAndA, type VisualQAndAOutput } from '@/ai/flows/visual-q-and-a';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Image as ImageIcon } from 'lucide-react';

export default function VisualQAPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VisualQAndAOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a question.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await visualQAndA({ question });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An error occurred',
        description: 'Failed to get an answer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Visual Q&A</CardTitle>
          <CardDescription>Ask a question and let Gemini AI answer with text and a generated image.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Textarea
              placeholder="e.g., What is the distance between the Earth and the Moon?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px]"
              disabled={loading}
              aria-label="Your question"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Ask Gemini'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {loading && (
        <Card className="mt-6">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="aspect-video w-full rounded-lg" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-6 animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Bot className="h-6 w-6" /> AI Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base leading-relaxed">{result.answer}</p>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Visual Representation</h4>
              <Image
                src={result.imageUrl}
                alt="Visually generated answer"
                width={512}
                height={512}
                className="rounded-lg border shadow-md w-full object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
