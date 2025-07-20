
"use client";

import React, { useState, useEffect } from 'react';
import { Search, Grid, Filter, Sparkles, TrendingUp, Camera, Eye, Download, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImageGallery from './ImageGallery';
import ImageModal from './ImageModal';

interface Image {
  id: string;
  url: string;
  title: string;
  author: string;
  likes: number;
  category: string;
  tags: string[];
  size: {
    width: number;
    height: number;
  };
}

// Mock data for image categories
const categories = [
  { name: 'Nature', icon: '🌿', count: '2.1M' },
  { name: 'Architecture', icon: '🏛️', count: '1.8M' },
  { name: 'Food', icon: '🍕', count: '3.2M' },
  { name: 'Fashion', icon: '👗', count: '2.5M' },
  { name: 'Travel', icon: '✈️', count: '1.9M' },
  { name: 'Art', icon: '🎨', count: '4.1M' },
  { name: 'Technology', icon: '💻', count: '1.5M' },
  { name: 'Animals', icon: '🦋', count: '2.8M' }
];

// Mock trending searches
const trendingSearches = [
  'Minimalist Design', 'Sunset Photography', 'Modern Architecture', 
  'Street Art', 'Ocean Views', 'Mountain Landscapes', 'Urban Fashion', 
  'Abstract Art', 'Cozy Interiors', 'Vintage Cars'
];

// Mock data for images
const mockImages: Image[] = [
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedImages, setLikedImages] = useState(new Set<string>());

  useEffect(() => {
    // Simulate fetching images
    setIsLoading(true);
    setTimeout(() => {
      setFilteredImages(mockImages);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (value.trim()) {
        const filtered = mockImages.filter(image => 
          image.title.toLowerCase().includes(value.toLowerCase()) ||
          image.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase())) ||
          image.category.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredImages(filtered);
      } else {
        setFilteredImages(mockImages);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);
    
    setTimeout(() => {
      if (category === 'All') {
        setFilteredImages(mockImages);
      } else {
        const filtered = mockImages.filter(image => image.category === category);
        setFilteredImages(filtered);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleImageSelect = (image: Image) => {
    setSelectedImage(image);
  };

  const handleImageLike = (imageId: string) => {
    setLikedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-cyan-500/15 backdrop-blur-xl"></div>
        <div className="relative container mx-auto px-4 py-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-primary/25">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-4xl text-foreground bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  Legezterest
                </h1>
                <p className="text-sm text-muted-foreground">Discover. Inspire. Create.</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors duration-300" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search millions of creative images..."
                className="w-full pl-14 pr-6 py-5 bg-card/50 border-border rounded-3xl text-foreground placeholder-muted-foreground backdrop-blur-xl focus:bg-card/70 transition-all duration-500 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Sparkles className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-8">
        {/* Trending Searches */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl text-foreground">Trending Now</h2>
          </div>
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-4">
            {trendingSearches.map((trend, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-card/50 border-border text-foreground hover:bg-primary/20 hover:border-primary/50 cursor-pointer transition-all duration-300 px-4 py-2 text-sm whitespace-nowrap backdrop-blur-md hover:scale-105"
                onClick={() => handleSearch(trend)}
              >
                {trend}
              </Badge>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl text-foreground mb-6 flex items-center gap-3">
            <Grid className="w-6 h-6 text-secondary" />
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            <Card
              onClick={() => handleCategoryFilter('All')}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedCategory === 'All' 
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50 ring-2 ring-primary/50' 
                  : 'bg-card/50 hover:bg-card/70 border-border'
              } backdrop-blur-md`}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="text-foreground text-sm mb-1">All</h3>
                <p className="text-muted-foreground text-xs">12.1M</p>
              </CardContent>
            </Card>
            
            {categories.map((category, index) => (
              <Card
                key={index}
                onClick={() => handleCategoryFilter(category.name)}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.name 
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50 ring-2 ring-primary/50' 
                    : 'bg-card/50 hover:bg-card/70 border-border'
                } backdrop-blur-md`}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="text-foreground text-sm mb-1">{category.name}</h3>
                  <p className="text-muted-foreground text-xs">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl text-foreground">
              {searchQuery ? `Results for "${searchQuery}"` : selectedCategory === 'All' ? 'Discover Amazing Images' : `${selectedCategory} Collection`}
            </h2>
            <Badge variant="secondary">
              {filteredImages.length} images
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-accent backdrop-blur-md"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery
          images={filteredImages}
          onImageSelect={handleImageSelect}
          onImageLike={handleImageLike}
          likedImages={likedImages}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-foreground text-lg">Finding amazing images...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredImages.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl text-foreground mb-2">No images found</h3>
            <p className="text-muted-foreground text-lg mb-6">Try searching for different keywords or browse our categories</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                handleSearch('');
              }}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              Explore All Images
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-3xl text-foreground mb-2">12M+</h3>
              <p className="text-muted-foreground">Images Discovered</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent/10 to-blue-500/10 border-accent/20 backdrop-blur-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-accent to-blue-600 rounded-full flex items-center justify-center">
                <Download className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-3xl text-foreground mb-2">2.5M+</h3>
              <p className="text-muted-foreground">Downloads Today</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/20 backdrop-blur-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl text-foreground mb-2">500K+</h3>
              <p className="text-muted-foreground">Happy Users</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onLike={() => handleImageLike(selectedImage.id)}
          isLiked={likedImages.has(selectedImage.id)}
        />
      )}
    </div>
  );
}
