
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Frown } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                    <Frown className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="mt-4">Oops! Something went wrong.</CardTitle>
                <CardDescription>
                    An unexpected error occurred. We've logged the issue and are looking into it.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                    }
                >
                    Try Again
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
