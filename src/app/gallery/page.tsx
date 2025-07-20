
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Link as LinkIcon, Search } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSearchStore } from '@/hooks/use-search';
import { useToast } from '@/hooks/use-toast';
import type { SearchResult } from '@/ai/flows/search-types';
import { searchFlow } from '@/ai/flows/search';

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
    const [images, setImages] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<SearchResult | null>(null);
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
            setHasSearched(false);
            return;
        }
        setLoading(true);
        setHasSearched(true);
        setImages([]); // Clear previous results

        try {
            const result = await searchFlow({ query: searchQuery });
            if (result && result.length > 0) {
                setImages(result);
            } else {
                 toast({
                    title: 'No Images Found',
                    description: `Could not find images for "${searchQuery}". Please try another search.`,
                    variant: 'destructive',
                });
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

    const handleDownload = async (imageUrl: string, imageName: string = 'legezterest-image.jpg') => {
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
                description: 'Could not download the image. The source might be blocking it.',
                variant: 'destructive',
            });
        }
    };
    
    const handleCopyLink = (src: string) => {
        navigator.clipboard.writeText(src);
        toast({ title: 'Link Copied!', description: 'Image URL copied to clipboard.' });
    }

    useEffect(() => {
        if (user && query) {
            fetchImages(query);
        } else {
            setLoading(false);
            setHasSearched(false);
            setImages([]);
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
                        <Card key={`${image.src}-${index}`} className="overflow-hidden cursor-pointer relative group">
                            <Image
                                src={image.src}
                                alt={image.alt || `Image from ${image.source}`}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover aspect-square"
                                onClick={() => setSelectedImage(image)}
                            />
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                {image.source}
                            </div>
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
                                alt={selectedImage.alt || `Image from ${selectedImage.source}`}
                                width={1200}
                                height={1200}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                               <Button size="icon" variant="secondary" onClick={() => selectedImage && handleCopyLink(selectedImage.src)}>
                                   <LinkIcon className="h-4 w-4" />
                               </Button>
                               <Button size="icon" variant="secondary" onClick={() => handleDownload(selectedImage.src, `${selectedImage.source}-${query}-${selectedImage.src.split('/').pop()}.jpg`)}>
                                   <Download className="h-4 w-4" />
                               </Button>
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded-md">
                                Source: {selectedImage.source}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}

    