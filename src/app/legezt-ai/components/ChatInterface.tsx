
"use client";

import React from 'react';
import { Bot, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  chatId: number;
  model: {
    id: string;
    name: string;
  } | undefined;
}

// Mock messages for demonstration
const mockMessages: { [key: number]: Message[] } = {
  1: [
    { role: 'user', content: 'What are the best practices for writing clean React code?' },
    { role: 'assistant', content: 'Great question! Some best practices include: using functional components with hooks, keeping components small and focused, using a consistent file structure, and writing meaningful tests.' },
  ],
  2: [
    { role: 'user', content: 'Generate a prompt for an AI image generator to create a futuristic cityscape.' },
    { role: 'assistant', content: 'Certainly! How about this: "A sprawling cyberpunk cityscape at dusk, neon signs reflecting on rain-slicked streets, flying vehicles weaving between towering holographic skyscrapers, with a lone figure in a trench coat looking over the metropolis."' },
  ],
  3: [
    { role: 'user', content: 'How do I implement a binary search algorithm in JavaScript?' },
    { role: 'assistant', content: 'Binary search is an efficient algorithm for finding an item from a sorted list of items. Here is a sample implementation in JavaScript...' },
  ],
  4: [
    { role: 'user', content: 'Give me some tips for improving UI/UX design.' },
    { role: 'assistant', content: 'To improve UI/UX, focus on clarity, consistency, and feedback. Ensure your design is intuitive, predictable, and communicates clearly with the user through visual cues and affordances.' },
  ],
};

export default function ChatInterface({ chatId, model }: ChatInterfaceProps) {
  const messages = mockMessages[chatId] || [];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-4 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
          )}

          <div
            className={`max-w-xl p-4 rounded-2xl ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-none'
                : 'bg-card border border-border text-card-foreground rounded-bl-none'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          {message.role === 'user' && (
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-accent-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
