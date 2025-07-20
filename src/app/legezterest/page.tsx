
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import ImageGallery from './ImageGallery';
import ImageModal from './ImageModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock data for images
const mockImages = [
  // Generating a diverse set of images with different aspect ratios
  { id: '1', url: 'https://placehold.co/500x750', title: 'Crimson Tower', author: 'Alex Drone', likes: 1200, category: 'Architecture', tags: ['city', 'red', 'skyscraper', 'urban'], size: { width: 4000, height: 6000 } },
  { id: '2', url: 'https://placehold.co/500x400', title: 'Ocean Whisper', author: 'Maria Seal', likes: 2300, category: 'Nature', tags: ['sea', 'waves', 'blue', 'calm'], size: { width: 5000, height: 4000 } },
  { id: '3', url: 'https://placehold.co/500x600', title: 'Forest Light', author: 'John Arbor', likes: 850, category: 'Nature', tags: ['woods', 'sunbeam', 'green'], size: { width: 3000, height: 4000 } },
  { id: '4', url: 'https://placehold.co/500x500', title: 'Abstract Curves', author: 'Nina Form', likes: 1500, category: 'Abstract', tags: ['design', 'colorful', 'pattern'], size: { width: 4500, height: 4500 } },
  { id: '5', url: 'https://placehold.co/500x800', title: 'Mountain Peak', author: 'Leo Summit', likes: 3100, category: 'Travel', tags: ['alps', 'snow', 'adventure', 'peak'], size: { width: 4000, height: 7000 } },
  { id: '6', url: 'https://placehold.co/500x450', title: 'Cyber City', author: 'Eva Glitch', likes: 4500, category: 'Sci-Fi', tags: ['neon', 'future', 'ai', 'tech'], size: { width: 6000, height: 5000 } },
  { id: '7', url: 'https://placehold.co/500x700', title: 'Vintage Portrait', author: 'Retro Cam', likes: 980, category: 'People', tags: ['portrait', 'bw', 'classic'], size: { width: 3500, height: 5000 } },
  { id: '8', url: 'https://placehold.co/500x350', title: 'Desert Dunes', author: 'Sandy Foot', likes: 1800, category: 'Travel', tags: ['desert', 'sand', 'hot', 'journey'], size: { width: 7000, height: 4000 } },
  { id: '9', url: 'https://placehold.co/500x650', title: 'Gourmet Delight', author: 'Chef Plate', likes: 720, category: 'Food', tags: ['food', 'delicious', 'restaurant'], size: { width: 4000, height: 5500 } },
  { id: '10', url: 'https://placehold.co/500x550', title: 'Wild Tiger', author: 'Jungle Eye', likes: 5200, category: 'Animals', tags: ['tiger', 'wildlife', 'nature', 'cat'], size: { width: 5000, height: 5500 } },
  { id: '11', url: 'https://placehold.co/500x750', title: 'Galactic Swirl', author: 'Stargazer', likes: 6300, category: 'Space', tags: ['galaxy', 'stars', 'nebula', 'cosmos'], size: { width: 4000, height: 6000 } },
  { id: '12', url: 'https://placehold.co/500x400', title: 'Minimalist Interior', author: 'Clean Lines', likes: 1100, category: 'Architecture', tags: ['minimal', 'design', 'home'], size: { width: 5000, height: 4000 } },
];


export default function LegezterestPage() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching images
    setIsLoading(true);
    setTimeout(() => {
      setImages(mockImages);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleImageLike = (imageId) => {
    setLikedImages((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(imageId)) {
        newLiked.delete(imageId);
      } else {
        newLiked.add(imageId);
      }
      return newLiked;
    });
  };

  return (
    <div className="min-h-screen bg-background text-white">
       <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-background via-purple-900/10 to-pink-900/10" />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Legezterest
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Your visual discovery engine. Find and save a collection of ideas.
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for ideas, images, and inspiration..."
              className="w-full h-14 pl-12 pr-32 bg-card border-border rounded-full text-lg focus:border-primary"
            />
            <Button className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery
          images={images}
          onImageSelect={handleImageSelect}
          onImageLike={handleImageLike}
          likedImages={likedImages}
          isLoading={isLoading}
        />

        {/* Image Modal */}
        <ImageModal
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={handleCloseModal}
          onLike={() => handleImageLike(selectedImage.id)}
          isLiked={selectedImage && likedImages.has(selectedImage.id)}
        />
      </main>
    </div>
  );
}
