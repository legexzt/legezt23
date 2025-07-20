
'use client';
import { useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
             <div className="container mx-auto py-8 px-4">
                <Skeleton className="h-12 w-1/3 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold mb-8">Anime News</h1>

            <div className="flex gap-4 mb-8">
                <Input placeholder="Search news..." className="max-w-sm"/>
                <div className="flex gap-2">
                    <Button variant="outline">Spoilers</Button>
                    <Button variant="outline">Reviews</Button>
                    <Button variant="outline">New Seasons</Button>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The news section is currently under development. Check back soon for the latest updates!</p>
                </CardContent>
            </Card>
        </div>
    );
}
