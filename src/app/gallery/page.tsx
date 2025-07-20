
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

function GallerySkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-lg" />
            ))}
        </div>
    );
}

type ImageType = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

export default function GalleryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [images, setImages] = useState<ImageType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
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
        try {
            // Using a more reliable image provider instead of scraping
            const response = await fetch('https://picsum.photos/v2/list?page=1&limit=50');
            if (!response.ok) {
                throw new Error('Failed to fetch images from the provider.');
            }
            const data: ImageType[] = await response.json();
            setImages(data);
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
            // Use a proxy or server-side fetch if CORS issues persist
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
                        <Card key={image.id} className="overflow-hidden cursor-pointer" onClick={() => setSelectedImage(image)}>
                            <Image
                                src={image.download_url}
                                alt={`Photo by ${image.author}`}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover aspect-square"
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
                                src={selectedImage.download_url} 
                                alt={`Photo by ${selectedImage.author}`}
                                width={1200}
                                height={1200}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                               <Button size="icon" variant="secondary" onClick={() => selectedImage && handleCopyLink(selectedImage.download_url)}>
                                   <LinkIcon className="h-4 w-4" />
                               </Button>
                               <Button size="icon" variant="secondary" onClick={() => handleDownload(selectedImage.download_url, `photo-${selectedImage.id}-by-${selectedImage.author}.jpg`)}>
                                   <Download className="h-4 w-4" />
                               </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );

    