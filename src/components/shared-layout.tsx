
"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function SharedLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      {user && (
        <>
          {/* Always visible fixed menu button on the left */}
          <button
            className="fixed top-6 left-6 z-[60] p-2 bg-[#222] rounded-full shadow-lg hover:bg-[#333] transition-colors duration-300"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-[#00ffe7]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
          </button>

          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full w-64 bg-[#181818] border-r border-[#00ffe7] z-[70] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out shadow-2xl`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#00ffe7]">
              <span className="text-2xl font-bold text-[#00ffe7]">Menu</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="p-1 rounded hover:bg-[#222] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#00ffe7]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-2 p-6">
              <Link href="/home" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300" onClick={() => setSidebarOpen(false)}>Home</Link>
              <Link href="/legeztify" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300" onClick={() => setSidebarOpen(false)}>Legeztify</Link>
              <Link href="/legezterest" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300" onClick={() => setSidebarOpen(false)}>Legezterest</Link>
              <Link href="/legezttube" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300" onClick={() => setSidebarOpen(false)}>LegeztTube</Link>
              <Link href="/legezt-pdf-ai" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300" onClick={() => setSidebarOpen(false)}>Legezt PDF AI</Link>
              <Link href="/legezt-ai" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300" onClick={() => setSidebarOpen(false)}>Legezt AI</Link>
              {!user && (
                <Link href="/" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300" onClick={() => setSidebarOpen(false)}>Login</Link>
              )}
            </nav>
          </aside>
          {/* Overlay for sidebar on mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-[65] bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
          )}
        </>
      )}
      <main>{children}</main>
    </>
  );
}
