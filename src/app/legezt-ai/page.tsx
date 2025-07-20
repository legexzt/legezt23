
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Settings, 
  Menu,
  Sparkles,
  Mic,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChatInterface from './components/ChatInterface';
import VoiceOrb from './components/VoiceOrb';
import Sidebar from './components/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock AI models
const aiModels = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', premium: true, description: 'Most capable model' },
  { id: 'gpt-3.5', name: 'GPT-3.5', provider: 'OpenAI', premium: false, description: 'Fast and reliable' },
  { id: 'claude-3', name: 'Claude-3', provider: 'Anthropic', premium: true, description: 'Advanced reasoning' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', premium: true, description: 'Multimodal AI' },
  { id: 'llama-2', name: 'Llama-2', provider: 'Meta', premium: false, description: 'Open source' }
];

// Mock chat history
const mockChats = [
  {
    id: 1,
    title: "React Best Practices",
    lastMessage: "Here are some React best practices...",
    timestamp: "2 hours ago",
    model: "gpt-4"
  },
  {
    id: 2,
    title: "AI Art Generation",
    lastMessage: "I'll help you create amazing AI art...",
    timestamp: "5 hours ago",
    model: "claude-3"
  },
  {
    id: 3,
    title: "JavaScript Algorithms",
    lastMessage: "Let's solve this algorithm step by step...",
    timestamp: "Yesterday",
    model: "gpt-3.5"
  },
  {
    id: 4,
    title: "UI/UX Design Tips",
    lastMessage: "Here are some modern design principles...",
    timestamp: "2 days ago",
    model: "gemini-pro"
  }
];

export default function LegeztAIPage() {
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [chats, setChats] = useState(mockChats);
  const [inputMessage, setInputMessage] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
        setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const currentModel = aiModels.find(model => model.id === selectedModel);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      lastMessage: "",
      timestamp: "Now",
      model: selectedModel
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };

  const handleChatSelect = (chatId: number) => {
    setCurrentChatId(chatId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    console.log('Sending message:', inputMessage, 'to model:', selectedModel);
    setInputMessage('');
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        selectedModel={selectedModel}
        models={aiModels}
        onModelChange={setSelectedModel}
      />

      <main className="flex-1 flex flex-col relative">
        <header className="relative z-10">
          <div className="absolute inset-0 bg-card/80 backdrop-blur-xl border-b border-border"></div>
          <div className="relative flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className={`text-foreground hover:bg-accent md:hidden ${isSidebarOpen ? 'hidden' : 'flex'}`}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-2xl shadow-primary/25">
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl text-foreground bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Legezt AI
                  </h1>
                  <p className="text-xs text-muted-foreground">Next-Gen AI Assistant</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-48 bg-background/50 border-border text-foreground backdrop-blur-md hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${currentModel?.premium ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${model.premium ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                          <span>{model.name}</span>
                        </div>
                        {model.premium && (
                          <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <div className="flex-1 relative overflow-y-auto">
          {isVoiceMode ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <VoiceOrb 
                isListening={isVoiceMode}
                onClose={() => setIsVoiceMode(false)}
              />
            </div>
          ) : (
            <ChatInterface 
              chatId={currentChatId}
              model={currentModel}
            />
          )}
        </div>

        {!isVoiceMode && (
          <div className="relative z-10 p-4 border-t border-border bg-card/50">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-2 md:gap-4 p-2 md:p-4 bg-background border border-border rounded-3xl shadow-lg">
                <div className="flex-1">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Ask ${currentModel?.name} anything...`}
                    className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 ring-offset-0 resize-none min-h-[24px] max-h-32 text-base w-full"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleVoiceMode}
                    variant="secondary"
                    size="icon"
                    className="w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 relative"
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    size="icon"
                    className="w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-2">
                <div className="text-xs text-muted-foreground">
                  Powered by {currentModel?.name}
                  {currentModel?.premium && (
                    <Badge variant="secondary" className="ml-2">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
