
"use client";

import React from 'react';
import { X, Download, Heart, User, Tag, Info, Copy, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface Image {
    id: string;
    url: string;
    title: string;
    author: string;
    tags: string[];
    size: {
        width: number;
        height: number;
    };
    category: string;
}

interface ImageModalProps {
    image: Image | null;
    isOpen: boolean;
    onClose: () => void;
    onLike: () => void;
    isLiked: boolean;
}

export default function ImageModal({ image, isOpen, onClose, onLike, isLiked }: ImageModalProps) {
  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (platform: 'facebook' | 'twitter') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this amazing image: ${image.title}`);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] bg-card/80 backdrop-blur-xl border-border p-0 overflow-hidden shadow-2xl">
        <div className="flex h-full flex-col md:flex-row">
          <div className="flex-grow flex items-center justify-center p-6 bg-background/50 relative">
            <div className="relative w-full h-full flex items-center justify-center">
              <ImageWithFallback
                src={image.url}
                alt={image.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          <aside className="w-full md:w-96 bg-card flex-shrink-0 border-l border-border overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                </Button>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{image.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>by {image.author}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                  <Button onClick={onLike} variant={isLiked ? "secondary" : "outline"} size="lg" className="flex-1">
                      <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? 'Liked' : 'Like'}
                  </Button>
                  <Button onClick={handleDownload} variant="outline" size="lg" className="flex-1">
                      <Download className="w-5 h-5 mr-2" />
                      Download
                  </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                 <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    Details
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <span className="text-foreground">{image.size.width} × {image.size.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="text-foreground">{image.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Share</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => handleShare('twitter')} variant="outline"><Twitter className="w-4 h-4 mr-2" />Twitter</Button>
                  <Button onClick={() => handleShare('facebook')} variant="outline"><Facebook className="w-4 h-4 mr-2" />Facebook</Button>
                </div>
                 <div className="relative">
                    <input type="text" readOnly value={typeof window !== 'undefined' ? window.location.href : ''} className="w-full bg-background border border-input rounded-md p-2 pr-10 text-sm text-muted-foreground" />
                    <Button variant="ghost" size="icon" onClick={handleCopyLink} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground">
                      <Copy className="w-4 h-4" />
                    </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
