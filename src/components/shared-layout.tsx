
"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from "./theme-switcher";
import { Home, Music, Image as ImageIcon, Youtube, FileText, Bot, Settings, LogIn, X } from "lucide-react";

export default function SharedLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/legeztify", icon: Music, label: "Legeztify" },
    { href: "/legezterest", icon: ImageIcon, label: "Legezterest" },
    { href: "/legezttube", icon: Youtube, label: "LegeztTube" },
    { href: "/legezt-pdf-ai", icon: FileText, label: "Legezt PDF AI" },
    { href: "/legezt-ai", icon: Bot, label: "Legezt AI" },
  ];

  return (
    <>
      {user && (
        <>
          {/* Always visible fixed menu button on the left */}
          <button
            className="fixed top-6 left-6 z-[60] p-2 bg-card/80 backdrop-blur-sm border border-border rounded-full shadow-lg hover:bg-accent transition-colors duration-300"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
          </button>

          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full w-64 bg-card/95 backdrop-blur-lg border-r border-border z-[70] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out shadow-2xl flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <span className="text-2xl font-bold text-primary">Menu</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="p-1 rounded-full hover:bg-accent transition-colors duration-300">
                <X className="w-6 h-6 text-primary" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 p-6 flex-grow">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className="flex items-center gap-4 py-3 px-4 rounded-lg text-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300" onClick={() => setSidebarOpen(false)}>
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
               {!user && (
                <Link href="/" className="flex items-center gap-4 py-3 px-4 rounded-lg text-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300" onClick={() => setSidebarOpen(false)}>
                  <LogIn className="w-5 h-5"/>
                  Login
                </Link>
              )}
            </nav>
            <div className="p-4 border-t border-border">
                <button onClick={() => { setSettingsOpen(true); setSidebarOpen(false); }} className="w-full flex items-center gap-4 py-3 px-4 rounded-lg text-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300">
                    <Settings className="w-5 h-5" />
                    Settings
                </button>
            </div>
          </aside>
          
          {/* Overlay for sidebar on mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-[65] bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
          )}
        </>
      )}

      <AnimatePresence>
        {settingsOpen && <ThemeSwitcher onClose={() => setSettingsOpen(false)} />}
      </AnimatePresence>
      
      <main>{children}</main>
    </>
  );
}
