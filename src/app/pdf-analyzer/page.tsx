'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzePdf, type AnalyzePdfOutput } from '@/ai/flows/pdf-analyzer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUp, Bot } from 'lucide-react';

export default function PdfAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzePdfOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !question.trim()) {
      toast({
        title: 'Error',
        description: 'Please upload a PDF and enter a question.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const pdfDataUri = await fileToDataUri(file);
      const res = await analyzePdf({ pdfDataUri, question });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An error occurred',
        description: 'Failed to analyze the PDF. Please try again.',
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
          <CardTitle className="font-headline text-3xl">PDF Analyzer AI</CardTitle>
          <CardDescription>Upload a PDF document and ask Gemini questions about its content.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="pdf-file">PDF Document</Label>
                <div className="flex items-center gap-2">
                    <FileUp className="h-5 w-5 text-muted-foreground" />
                    <Input id="pdf-file" type="file" accept="application/pdf" onChange={handleFileChange} disabled={loading} />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                    id="question"
                    placeholder="e.g., What are the key findings of this report?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[100px]"
                    disabled={loading}
                />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Analyzing...' : 'Analyze PDF'}
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
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-6 animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline"><Bot className="h-6 w-6" /> AI Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed">{result.answer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
