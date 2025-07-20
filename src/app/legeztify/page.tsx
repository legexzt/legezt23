
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Home, Search, Library, ChevronLeft, ChevronRight, Play, Laptop2, ListMusic, Mic2, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import MusicPlayer from './MusicPlayer';

const playlists = ["Chill Mix", "Workout", "90s Rock Anthems", "Coding Focus", "Late Night Jazz"];
const allMusic = [
    { id: 1, title: "Daily Mix 1", artist: "Wallows, COIN, girl in red and more", album: "Daily Mixes", image: "https://placehold.co/300x300", "data-ai-hint": "music playlist", duration: "3:45", premium: false },
    { id: 2, title: "Daily Mix 2", artist: "Lana Del Rey, Taylor Swift, Lorde", album: "Daily Mixes", image: "https://placehold.co/300x300", "data-ai-hint": "pop music", duration: "4:15", premium: true },
    { id: 3, title: "Daily Mix 3", artist: "The Killers, Foo Fighters, Muse", album: "Daily Mixes", image: "https://placehold.co/300x300", "data-ai-hint": "rock music", duration: "5:02", premium: false },
    { id: 4, title: "Discover Weekly", artist: "Various Artists", album: "Discover", image: "https://placehold.co/300x300", "data-ai-hint": "discover music", duration: "2:58", premium: false },
    { id: 5, title: "Release Radar", artist: "Various Artists", album: "New Releases", image: "https://placehold.co/300x300", "data-ai-hint": "new music", duration: "3:12", premium: true },
    { id: 6, title: "Indie Mix", artist: "A mix of your favorite indie artists.", album: "Top Mixes", image: "https://placehold.co/300x300", "data-ai-hint": "indie music", duration: "4:30", premium: false },
];
const topMixes = [
    { id: 6, title: "Indie Mix", description: "A mix of your favorite indie artists.", image: "https://placehold.co/200x200", "data-ai-hint": "indie music" },
    { id: 2, title: "Pop Mix", description: "The biggest pop hits right now.", image: "https://placehold.co/200x200", "data-ai-hint": "pop hits" },
    { id: 3, title: "Rock Mix", description: "From classic rock to modern hits.", image: "https://placehold.co/200x200", "data-ai-hint": "guitar rock" },
    { id: 4, title: "Hip Hop Mix", description: "The best of hip hop and rap.", image: "https://placehold.co/200x200", "data-ai-hint": "hip hop" },
    { id: 5, title: "Electronic Mix", description: "Dance and electronic music.", image: "https://placehold.co/200x200", "data-ai-hint": "electronic music" },
];

const MusicCard = ({ item, onPlay }: { item: any, onPlay: (item: any) => void }) => (
    <div className="bg-[#181818] p-4 rounded-lg group relative hover:bg-[#282828] transition-colors duration-300 w-full cursor-pointer" onClick={() => onPlay(item)}>
        <div className="relative mb-4">
            <Image src={item.image} alt={item.title} width={200} height={200} className="w-full h-auto rounded-md shadow-lg" data-ai-hint={item['data-ai-hint']} />
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onPlay(item); }}
                className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300 shadow-xl hover:scale-105"
            >
                <Play className="w-6 h-6 fill-black" />
            </Button>
        </div>
        <h3 className="text-white font-bold truncate">{item.title}</h3>
        <p className="text-gray-400 text-sm truncate">{item.description || item.artist}</p>
    </div>
);


export default function LegeztifyPage() {
    const [selectedMusic, setSelectedMusic] = useState<any>(null);

    const handleSelectMusic = (musicItem: any) => {
        const fullMusicDetails = allMusic.find(m => m.id === musicItem.id);
        setSelectedMusic(fullMusicDetails || musicItem);
    };

    const handleBack = () => {
        setSelectedMusic(null);
    };

    if (selectedMusic) {
        return <MusicPlayer music={selectedMusic} onBack={handleBack} allMusic={allMusic} />;
    }

    return (
        <div className="h-screen w-full bg-black text-[#b3b3b3] p-2 flex gap-2 font-sans">
            {/* Left Sidebar */}
            <aside className="w-[250px] flex-shrink-0 flex flex-col gap-2">
                <div className="bg-[#121212] rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-4 text-white font-bold">
                        <Home className="w-6 h-6" />
                        <span>Home</span>
                    </div>
                    <div className="flex items-center gap-4 hover:text-white transition-colors">
                        <Search className="w-6 h-6" />
                        <span>Search</span>
                    </div>
                    <div className="flex items-center gap-4 hover:text-white transition-colors">
                        <Library className="w-6 h-6" />
                        <span>Your Library</span>
                    </div>
                </div>
                <div className="bg-[#121212] rounded-lg p-2 flex-grow">
                    <div className="p-2">
                        <h2 className="text-white font-bold mb-4">Playlists</h2>
                    </div>
                    <ScrollArea className="h-[calc(100%-80px)] px-2">
                        <div className="space-y-2">
                            {playlists.map(name => (
                                <a key={name} href="#" className="block p-2 rounded-md hover:bg-[#1a1a1a] text-sm truncate">
                                    {name}
                                </a>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow bg-[#121212] rounded-lg overflow-y-auto">
                <header className="sticky top-0 bg-[#121212]/80 backdrop-blur-sm z-10 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="bg-black/50 rounded-full"><ChevronLeft className="w-6 h-6 text-white" /></Button>
                        <Button variant="ghost" size="icon" className="bg-black/50 rounded-full"><ChevronRight className="w-6 h-6 text-white" /></Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-full text-white font-bold border-gray-500 hover:border-white hover:scale-105">Upgrade</Button>
                        <div className="bg-black rounded-full p-1 flex items-center gap-2">
                             <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="text-white font-bold pr-2">Legezt</span>
                        </div>
                    </div>
                </header>
                <div className="p-6 space-y-8">
                    <section>
                        <h2 className="text-white text-2xl font-bold mb-4">Good afternoon</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {/* Simplified version of "Good afternoon" cards */}
                            <div className="bg-[#2a2a2a] rounded-md flex items-center gap-4 hover:bg-[#3a3a3a] transition-colors"><Image src="https://placehold.co/80x80" alt="Liked Songs" width={80} height={80} className="rounded-l-md" data-ai-hint="heart music" /><h3 className="text-white font-bold">Liked Songs</h3></div>
                            <div className="bg-[#2a2a2a] rounded-md flex items-center gap-4 hover:bg-[#3a3a3a] transition-colors"><Image src="https://placehold.co/80x80" alt="Playlist" width={80} height={80} className="rounded-l-md" data-ai-hint="playlist icon" /><h3 className="text-white font-bold">My Playlist #1</h3></div>
                            <div className="bg-[#2a2a2a] rounded-md flex items-center gap-4 hover:bg-[#3a3a3a] transition-colors"><Image src="https://placehold.co/80x80" alt="Artist" width={80} height={80} className="rounded-l-md" data-ai-hint="singer microphone" /><h3 className="text-white font-bold">Artist Name</h3></div>
                        </div>
                    </section>
                    <section>
                        <h2 className="text-white text-2xl font-bold mb-4">Made For You</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {allMusic.slice(0, 5).map(item => <MusicCard key={item.id} item={item} onPlay={handleSelectMusic} />)}
                        </div>
                    </section>
                    <section>
                        <h2 className="text-white text-2xl font-bold mb-4">Your top mixes</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {topMixes.map(item => <MusicCard key={item.id} item={item} onPlay={handleSelectMusic} />)}
                        </div>
                    </section>
                </div>
            </main>
            <style jsx global>{`
                main::-webkit-scrollbar {
                    width: 12px;
                }
                main::-webkit-scrollbar-track {
                    background: #121212;
                }
                main::-webkit-scrollbar-thumb {
                    background-color: #2a2a2a;
                    border-radius: 20px;
                    border: 3px solid #121212;
                }
                main::-webkit-scrollbar-thumb:hover {
                    background-color: #535353;
                }
                aside .h-\\[calc\\(100\\%-80px\\)\\] {
                    height: calc(100% - 80px);
                }
            `}</style>
        </div>
    );
}
