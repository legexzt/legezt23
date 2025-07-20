
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceOrbProps {
  isListening: boolean;
  onClose: () => void;
}

export default function VoiceOrb({ isListening, onClose }: VoiceOrbProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background/50">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Outer pulsing layers */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          />
        ))}

        {/* Inner dynamic orb */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent"
          animate={{
            scale: isListening ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-background/50 blur-xl"></div>
        </motion.div>

        {/* Central icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Mic className="w-20 h-20 text-primary-foreground drop-shadow-2xl" />
        </div>
      </div>

      <p className="mt-8 text-2xl text-foreground">
        {isListening ? "Listening..." : "Voice mode activated"}
      </p>
      
      <Button
        onClick={onClose}
        variant="ghost"
        className="mt-4 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4 mr-2" />
        Exit Voice Mode
      </Button>
    </div>
  );
}
