
"use client";

import React, { useState } from 'react';
import { Search, Play, Heart, Download, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MusicPlayer from './MusicPlayer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

// Mock data for music suggestions with audio URLs
const mockMusic = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    image: "https://placehold.co/300x300",
    "data-ai-hint": "neon lights",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    premium: true
  },
  {
    id: 2,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    image: "https://placehold.co/300x300",
    "data-ai-hint": "summer beach",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    premium: false
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    image: "https://placehold.co/300x300",
    "data-ai-hint": "disco ball",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    premium: true
  },
  {
    id: 4,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    image: "https://placehold.co/300x300",
    "data-ai-hint": "teenager bedroom",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    premium: true
  },
  {
    id: 5,
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    duration: "2:21",
    image: "https://placehold.co/300x300",
    "data-ai-hint": "city skyline",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    premium: false
  },
  {
    id: 6,
    title: "Industry Baby",
    artist: "Lil Nas X ft. Jack Harlow",
    album: "MONTERO",
    duration: "3:32",
    image: "https://placehold.co/300x300",
    "data-ai-hint": "gold trophy",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    premium: true
  }
];

const trendingArtists = [
  {
    name: "The Weeknd",
    image: "https://placehold.co/150x150",
    "data-ai-hint": "male singer"
  },
  {
    name: "Dua Lipa",
    image: "https://placehold.co/150x150",
    "data-ai-hint": "female singer"
  },
  {
    name: "Harry Styles",
    image: "https://placehold.co/150x150",
    "data-ai-hint": "man fashion"
  },
  {
    name: "Olivia Rodrigo",
    image: "https://placehold.co/150x150",
    "data-ai-hint": "young woman"
  }
];

export default function LegeztifyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMusic, setSelectedMusic] = useState<any>(null);
  const [filteredMusic, setFilteredMusic] = useState(mockMusic);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      const filtered = mockMusic.filter(music => 
        music.title.toLowerCase().includes(value.toLowerCase()) ||
        music.artist.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMusic(filtered);
    } else {
      setFilteredMusic(mockMusic);
    }
  };

  const handleMusicSelect = (music: any) => {
    setSelectedMusic(music);
  };

  const handleBackToHome = () => {
    setSelectedMusic(null);
  };

  if (selectedMusic) {
    return (
      <MusicPlayer 
        music={selectedMusic} 
        onBack={handleBackToHome}
        allMusic={mockMusic}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-3xl"></div>
        <div className="relative px-6 py-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center animate-pulse">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
              <h1 className="text-3xl text-white bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                Legeztify
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for songs, artists, albums..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 border-white/20 rounded-full text-white placeholder-gray-400 backdrop-blur-md focus:bg-white/20 transition-all duration-300 focus:ring-2 focus:ring-pink-500/50"
              />
            </div>
          </div>

          {/* Premium Badge */}
          <div className="flex justify-center mb-8">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 text-sm animate-pulse">
              ✨ Premium Experience
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* Trending Artists */}
        <div className="mb-12">
          <h2 className="text-2xl text-white mb-6">Trending Artists</h2>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {trendingArtists.map((artist, index) => (
              <div key={index} className="flex-shrink-0 text-center group cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-4 ring-gradient-to-r from-pink-500 to-violet-500 p-1 group-hover:scale-105 transition-transform duration-300">
                  <ImageWithFallback
                    src={artist.image}
                    alt={artist.name}
                    data-ai-hint={artist['data-ai-hint']}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="text-white text-sm group-hover:text-pink-400 transition-colors duration-200">{artist.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Music Suggestions */}
        <div>
          <h2 className="text-2xl text-white mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Recommended for You'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMusic.map((music) => (
              <Card 
                key={music.id} 
                className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/20 transition-all duration-300 cursor-pointer group hover:scale-105"
                onClick={() => handleMusicSelect(music)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-shrink-0">
                      <ImageWithFallback
                        src={music.image}
                        alt={music.title}
                        data-ai-hint={music['data-ai-hint']}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                      {music.premium && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1">
                            Premium
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white truncate group-hover:text-pink-400 transition-colors duration-200">{music.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{music.artist}</p>
                      <p className="text-gray-500 text-xs truncate">{music.album}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-gray-400 text-sm">{music.duration}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-pink-400 p-1 transition-all duration-200 hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-pink-400 p-1 transition-all duration-200 hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMusic.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No music found for "{searchQuery}"</p>
              <p className="text-gray-500 text-sm mt-2">Try searching for different artists or songs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
