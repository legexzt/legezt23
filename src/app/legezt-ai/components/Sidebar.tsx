
"use client";

import React from 'react';
import { 
  Plus, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';

interface Chat {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
  model: string;
}

interface Model {
  id: string;
  name: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  currentChatId: number;
  onChatSelect: (id: number) => void;
  onNewChat: () => void;
  selectedModel: string;
  models: Model[];
  onModelChange: (id: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
}: SidebarProps) {
  
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
        <motion.aside 
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-80 bg-card/95 backdrop-blur-lg border-r border-border flex flex-col fixed md:relative z-50 h-full"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Chat History</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground md:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-4">
            <Button onClick={onNewChat} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="px-4 space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    currentChatId === chat.id 
                      ? 'bg-primary/20 text-primary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-sm truncate text-foreground">{chat.title}</h3>
                    <Badge variant={currentChatId === chat.id ? 'default' : 'secondary'} className="text-xs">{chat.model}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.lastMessage || '...'}</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">{chat.timestamp}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </motion.aside>
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
        ></div>
        </>
      )}
    </AnimatePresence>
  );
}
