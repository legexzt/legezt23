
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Music, Image as ImageIcon, FileText, Bot, ArrowRight, Rss, Mail, LogOut, ChevronRight } from "lucide-react";

export default function HomePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/'); // Redirect to login page after sign out
  };

  const featureCards = [
    {
      title: "LegeztTube",
      description: "Watch your favorite videos from the internet, all in one place.",
      icon: Youtube,
      link: "/legezttube",
      color: "bg-red-500",
      image: "https://placehold.co/400x200",
      "data-ai-hint": "video stream"
    },
    {
      title: "Legeztify",
      description: "Enjoy music from around the world, create playlists and discover new tracks.",
      icon: Music,
      link: "/legeztify",
      color: "bg-green-500",
      image: "https://placehold.co/400x200",
       "data-ai-hint": "music stream"
    },
    {
      title: "Legezterest",
      description: "Discover, save, and download inspiring images with our creative visual hub.",
      icon: ImageIcon,
      link: "/legezterest",
      color: "bg-orange-500",
      image: "https://placehold.co/400x200",
      "data-ai-hint": "abstract gallery"
    },
    {
      title: "Legezt PDF AI",
      description: "Upload your PDF and get instant AI-powered summaries and insights.",
      icon: FileText,
      link: "/legezt-pdf-ai",
      color: "bg-blue-500",
      image: "https://placehold.co/400x200",
      "data-ai-hint": "document analysis"
    },
    {
      title: "Legezt AI",
      description: "Chat with our advanced AI assistant for help, advice, or just a conversation.",
      icon: Bot,
      link: "/legezt-ai",
      color: "bg-purple-500",
      image: "https://placehold.co/400x200",
      "data-ai-hint": "ai chat"
    }
  ];

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };


  return (
    <div className="min-h-screen w-full font-sans bg-background text-foreground">
        <div className="absolute inset-0 z-0 opacity-20">
            {/* You can keep the animated background or use a static one */}
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background via-background/90 to-background"></div>

        <main className="relative z-20 container mx-auto px-4 py-24 sm:py-32">
            {/* Hero Section */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-24"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
                    Welcome to Legezt
                </h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Your all-in-one AI-powered media hub. Stream videos, listen to music, analyze PDFs, and chat with our advanced AI, all in one place.
                </p>
            </motion.section>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featureCards.map((card, index) => (
                    <motion.div
                        key={card.link}
                        className="col-span-1"
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ staggerChildren: 0.2, delay: index * 0.1 }}
                    >
                        <motion.div variants={cardVariants}>
                            <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-primary transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-primary/20">
                                <div className="relative h-48 overflow-hidden">
                                     <Image
                                        src={card.image}
                                        alt={card.title}
                                        width={400}
                                        height={200}
                                        data-ai-hint={card['data-ai-hint']}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                                    <div className={`absolute top-4 right-4 p-3 rounded-full bg-card/50 backdrop-blur-sm`}>
                                        <card.icon className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-foreground mb-2">{card.title}</h3>
                                    <p className="text-muted-foreground mb-6">{card.description}</p>
                                    <Link href={card.link} className="inline-flex items-center font-semibold text-primary hover:text-primary/80 transition-colors">
                                        Explore Now <ChevronRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                ))}
                
                {/* Sign Out Card */}
                 <motion.div
                    className="md:col-span-1 lg:col-span-1"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ staggerChildren: 0.2 }}
                >
                     <motion.div variants={cardVariants}>
                         <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-destructive/50 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-destructive/20 flex flex-col justify-center p-6">
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                     <div className="p-3 rounded-full bg-card/50 backdrop-blur-sm border border-border">
                                        <LogOut className="w-6 h-6 text-destructive" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Sign Out</h3>
                                <p className="text-muted-foreground mb-6">Ready to leave? Click below to end your session securely.</p>
                                 <Button onClick={handleSignOut} variant="destructive" className="w-full">
                                    Sign Out
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                 </motion.div>
            </div>
        </main>

        {/* Footer */}
        <footer className="relative z-20 mt-32 pb-12 border-t border-border">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                    <div className="col-span-1">
                        <h4 className="text-2xl font-bold text-primary mb-4">LEGEZT</h4>
                        <p className="text-muted-foreground">The future of media, powered by AI. Your central hub for entertainment and productivity.</p>
                    </div>
                    <div className="col-span-1">
                        <h5 className="font-semibold text-foreground mb-4">Quick Links</h5>
                        <ul className="space-y-2">
                           {featureCards.slice(0, 4).map(item => (
                               <li key={item.link}>
                                   <Link href={item.link} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                       <ArrowRight className="w-4 h-4"/>
                                       {item.title}
                                   </Link>
                               </li>
                           ))}
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h5 className="font-semibold text-foreground mb-4">Subscribe</h5>
                        <p className="text-muted-foreground mb-4">Get the latest news and updates from Legezt directly to your inbox.</p>
                        <form className="flex">
                            <Input type="email" placeholder="your@email.com" className="bg-background/50 rounded-r-none focus:border-primary" />
                            <Button type="submit" variant="secondary" className="rounded-l-none">
                                <Rss className="w-5 h-5"/>
                            </Button>
                        </form>
                    </div>
                </div>
                 <div className="text-center text-sm text-muted-foreground mt-12 pt-8 border-t border-border/50">
                    © {new Date().getFullYear()} Legezt. All Rights Reserved.
                </div>
            </div>
        </footer>
    </div>
  );
}
