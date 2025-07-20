
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { scrapeUrl } from '@/ai/flows/scrape';
import type { ScrapeResult } from '@/ai/flows/scrape-types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Link as LinkIcon, Search } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSearchStore } from '@/hooks/use-search';
import { useToast } from '@/hooks/use-toast';

function GallerySkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-lg" />
            ))}
        </div>
    );
}

export default function GalleryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any | null>(null);
    const { query } = useSearchStore();
    const { toast } = useToast();
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchImages = async (searchQuery: string) => {
        if (!searchQuery) {
            setImages([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setHasSearched(true);
        try {
            const result: ScrapeResult = await scrapeUrl({
                url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery)}`,
            });
            if (result && result.success && result.data && Array.isArray(result.data.images)) {
                setImages(result.data.images.slice(0, 50));
            } else {
                setImages([]);
                console.error('No images found or invalid data format:', result?.error || result);
                if(result?.error) {
                    toast({
                        title: 'Search Failed',
                        description: result.error,
                        variant: 'destructive',
                    });
                }
            }
        } catch (error: any) {
            console.error('Failed to fetch images:', error);
            setImages([]);
            toast({
                title: 'Error',
                description: error.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (imageUrl: string, imageName: string = 'legezterest-image.png') => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = imageName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
            toast({
                title: 'Download Error',
                description: 'Could not download the image.',
                variant: 'destructive',
            });
        }
    };
    
    const handleCopyLink = (src: string) => {
        navigator.clipboard.writeText(src);
        toast({ title: 'Link Copied!', description: 'Image URL copied to clipboard.' });
    }

    useEffect(() => {
        if (user) {
            fetchImages(query);
        }
    }, [user, query]);

    if (authLoading || !user) {
        return <GallerySkeleton />;
    }

    const renderContent = () => {
        if (loading) {
            return <GallerySkeleton />;
        }
        if (!hasSearched) {
            return (
                 <div className="text-center text-muted-foreground mt-16 flex flex-col items-center gap-4">
                    <Search className="h-16 w-16" />
                    <h2 className="text-2xl font-semibold">Search for images</h2>
                    <p>Use the search bar above to find images on Legezterest.</p>
                </div>
            )
        }
        if (images.length > 0) {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                        <Card key={index} className="overflow-hidden cursor-pointer" onClick={() => setSelectedImage(image)}>
                            <Image
                                src={image.src}
                                alt={image.alt || `Anime image ${index + 1}`}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover aspect-square"
                                unoptimized
                            />
                        </Card>
                    ))}
                </div>
            );
        }
        return (
            <div className="text-center text-muted-foreground mt-16">
                <p>No images found for &quot;{query}&quot;.</p>
                <p>Try searching for something else.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold mb-8 capitalize">{query || 'Legezterest'}</h1>
            {renderContent()}
            
            <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0">
                    {selectedImage && (
                        <div className="relative">
                            <Image 
                                src={selectedImage.src} 
                                alt={selectedImage.alt || 'Selected anime image'}
                                width={1200}
                                height={1200}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                unoptimized
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                               <Button size="icon" variant="secondary" onClick={() => selectedImage.src && handleCopyLink(selectedImage.src)}>
                                   <LinkIcon className="h-4 w-4" />
                               </Button>
                               <Button size="icon" variant="secondary" onClick={() => handleDownload(selectedImage.src, selectedImage.alt)}>
                                   <Download className="h-4 w-4" />
                               </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}

