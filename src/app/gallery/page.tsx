
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { scrapeUrl, type ScrapeResult } from '@/ai/flows/scrape';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Link } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSearchStore } from '@/hooks/use-search';

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
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<any | null>(null);
    const { query, setQuery } = useSearchStore();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchImages = async (searchQuery: string) => {
        setLoading(true);
        try {
            const result: ScrapeResult = await scrapeUrl({
                url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery)}`,
            });
            if (result && result.data && Array.isArray(result.data.images)) {
                setImages(result.data.images.slice(0, 50));
            } else {
                setImages([]);
                console.error('No images found or invalid data format:', result);
            }
        } catch (error) {
            console.error('Failed to fetch images:', error);
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchImages(query);
        }
    }, [user, query]);

    if (authLoading || !user) {
        return <GallerySkeleton />;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold mb-8 capitalize">{query || 'Image Gallery'}</h1>
            {loading ? (
                <GallerySkeleton />
            ) : (
                images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                            <Card key={index} className="overflow-hidden cursor-pointer" onClick={() => setSelectedImage(image)}>
                                <Image
                                    src={image.src}
                                    alt={image.alt || `Anime image ${index + 1}`}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover aspect-square"
                                />
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground mt-16">
                        <p>No images found for &quot;{query}&quot;.</p>
                        <p>Try searching for something else.</p>
                    </div>
                )
            )}
            
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
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                               <Button size="icon" variant="secondary" onClick={() => selectedImage.src && navigator.clipboard.writeText(selectedImage.src)}>
                                   <Link className="h-4 w-4" />
                               </Button>
                               <a href={selectedImage.src} download target="_blank" rel="noopener noreferrer">
                                   <Button size="icon" variant="secondary">
                                       <Download className="h-4 w-4" />
                                   </Button>
                               </a>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}
