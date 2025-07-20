
"use client";

import React, { useState } from 'react';
import { Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import Masonry from 'react-responsive-masonry';

interface Image {
    id: string;
    url: string;
    title: string;
    tags: string[];
}

interface ImageGalleryProps {
    images: Image[];
    onImageSelect: (image: Image) => void;
    onImageLike: (id: string) => void;
    likedImages: Set<string>;
    isLoading: boolean;
}

export default function ImageGallery({ images, onImageSelect, onImageLike, likedImages, isLoading }: ImageGalleryProps) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  if (isLoading) {
    return (
        <Masonry columnsCount={5} gutter="24px">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-card/50 rounded-3xl animate-pulse"
                style={{ height: `${Math.random() * 150 + 200}px`, marginBottom: '24px' }}
              ></div>
            ))}
        </Masonry>
    );
  }

  return (
    <>
    <Masonry columnsCount={5} gutter="24px" className="masonry-grid">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="group cursor-pointer relative overflow-hidden rounded-3xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20"
          onMouseEnter={() => setHoveredImage(image.id)}
          onMouseLeave={() => setHoveredImage(null)}
          onClick={() => onImageSelect(image)}
          style={{
            animationDelay: `${index * 0.05}s`,
            animation: 'fadeInUp 0.5s ease-out forwards',
            opacity: 0,
          }}
        >
          {/* Image */}
          <div className="relative overflow-hidden">
            <ImageWithFallback
              src={image.url}
              alt={image.title}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300`}></div>
            
            <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${hoveredImage === image.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageLike(image.id);
                }}
                className={`w-10 h-10 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 ${
                  likedImages.has(image.id)
                    ? 'bg-pink-500 border-pink-400 text-white hover:bg-pink-600'
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedImages.has(image.id) ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                size="icon"
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-green-500 hover:border-green-400 transition-all duration-300 hover:scale-110"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${hoveredImage === image.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="text-white font-semibold mb-1 truncate">{image.title}</h3>
                <div className="flex flex-wrap gap-1">
                {image.tags.slice(0, 2).map((tag, tagIndex) => (
                  <Badge
                    key={tagIndex}
                    variant="outline"
                    className="bg-white/10 border-transparent text-white/80 text-xs px-2 py-1 backdrop-blur-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </Masonry>
    <style jsx global>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    </>
  );
}
