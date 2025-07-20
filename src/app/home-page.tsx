
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Animations for hero section elements and cards
  useEffect(() => {
    // Animate hero text after the navigation bar
    const heroElements = document.querySelectorAll('.animate-hero-enter');
    heroElements.forEach((el, index) => {
      (el as HTMLElement).style.animationDelay = `${index * 0.15 + 0.7}s`; // Added base delay
      el.classList.add('is-visible');
    });

    // Animate cards
    const cardElements = document.querySelectorAll('.animate-card-pop-in');
    cardElements.forEach((el, index) => {
      (el as HTMLElement).style.animationDelay = `${index * 0.1 + 1.5}s`; // Staggered delay for cards
      el.classList.add('is-visible');
    });

    // Animate footer elements
    const footerElements = document.querySelectorAll('.animate-footer-enter');
    footerElements.forEach((el, index) => {
      (el as HTMLElement).style.animationDelay = `${index * 0.15 + 2.5}s`; // Staggered delay for footer
      el.classList.add('is-visible');
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-inter">
      {/* AnimatedBackground is now handled by the parent 'Home' component */}
      {/* Top Navigation Bar */}
      <nav className="w-full bg-black/80 border-b border-[#222] shadow-lg fixed top-0 left-0 z-50 animate-nav-slide-down">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold tracking-tight text-white bg-[#222] px-3 py-1 rounded-lg shadow-md animate-pulse-logo">LEGEZT</span>
            <span className="text-xs text-[#00ffe7] font-semibold tracking-widest ml-2 hidden sm:block">Premium Tech in Space</span>
          </div>
          <div className="hidden md:flex gap-6 text-white font-medium text-lg">
  <Link href="/" className="hover:text-[#00ffe7] transition-colors duration-300 transform hover:scale-105 hover:drop-shadow-[0_0_10px_#00ffe7]">Home</Link>
  <Link href="/legeztify" className="hover:text-[#00ffe7] transition-colors duration-300 transform hover:scale-105 hover:drop-shadow-[0_0_10px_#00ffe7]">Legeztify</Link>
  <Link href="/legezterest" className="hover:text-[#00ffe7] transition-colors duration-300 transform hover:scale-105 hover:drop-shadow-[0_0_10px_#00ffe7]">Legezterest</Link>
  <Link href="/legezttube" className="hover:text-[#00ffe7] transition-colors duration-300 transform hover:scale-105 hover:drop-shadow-[0_0_10px_#00ffe7]">LegeztTube</Link>
  <Link href="/legezt-pdf-ai" className="hover:text-[#00ffe7] transition-colors duration-300 transform hover:scale-105 hover:drop-shadow-[0_0_10px_#00ffe7]">Legezt PDF AI</Link>
  <Link href="/legezt-ai" className="hover:text-[#00ffe7] transition-colors duration-300 transform hover:scale-105 hover:drop-shadow-[0_0_10px_#00ffe7]">Legezt AI</Link>
</div>
        </div>
      </nav>
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
  <Link href="/" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300">Home</Link>
  <Link href="/legeztify" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300">Legeztify</Link>
  <Link href="/legezterest" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300">Legezterest</Link>
  <Link href="/legezttube" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300">LegeztTube</Link>
  <Link href="/legezt-pdf-ai" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300">Legezt PDF AI</Link>
  <Link href="/legezt-ai" className="py-2 px-4 rounded text-lg text-white hover:bg-[#00ffe7] hover:text-[#181818] transition-colors duration-300">Legezt AI</Link>
</nav>
      </aside>
      {/* Overlay for sidebar on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[65] bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Hero Section */}
      <section className="pt-28 pb-12 flex flex-col items-center justify-center text-center relative px-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-[0_4px_24px_#00ffe7] tracking-tight mb-2 animate-hero-enter animate-text-glow-pulse">LEGEZT: YOUR AI POWERED MEDIA HUB</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#00ffe7] mb-6 tracking-widest animate-hero-enter">Stream Videos, Listen to Music, Download Images, Analyze PDFs, and Chat with AI</h2>
        <div className="flex flex-col md:flex-row flex-wrap gap-6 justify-center w-full max-w-6xl mx-auto mt-8">
          {/* Card 1: Video Streaming */}
          <div className="bg-black/80 rounded-xl shadow-xl p-6 flex-1 min-w-[260px] max-w-sm border-t-4 border-[#00ffe7] transform hover:scale-105 transition-transform duration-300 animate-card-pop-in group hover:ring-4 hover:ring-[#00ffe7] hover:ring-offset-2 hover:ring-offset-black">
            <div className="relative mb-4 overflow-hidden rounded">
              <Image
                src="https://placehold.co/320x128/00ffe7/ffffff?text=Video+Stream"
                alt="Stream Videos"
                width={320}
                height={128}
                className="w-full h-32 object-cover rounded transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors duration-300">
                <svg className="w-12 h-12 text-[#00ffe7] bg-black/60 rounded-full p-2 group-hover:bg-black/80 transition-colors duration-300 card-icon-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Legezt Tube</h3>
            <p className="text-gray-300 mb-4 text-sm">Watch your favorite videos from the internet, all in one place with blazing fast streaming and a beautiful interface.</p>
            <button className="bg-[#00ffe7] text-[#181818] font-bold px-4 py-2 rounded-lg shadow-md hover:bg-[#00bfff] transition-all duration-300 transform hover:-translate-y-1">Explore Videos</button>
          </div>
          {/* Card 2: Music Streaming */}
          <div className="bg-black/80 rounded-xl shadow-xl p-6 flex-1 min-w-[260px] max-w-sm border-t-4 border-[#00ff99] transform hover:scale-105 transition-transform duration-300 animate-card-pop-in group hover:ring-4 hover:ring-[#00ff99] hover:ring-offset-2 hover:ring-offset-black">
            <div className="relative mb-4 overflow-hidden rounded">
              <Image
                src="https://placehold.co/320x128/00ff99/ffffff?text=Music+Stream"
                alt="Listen to Music"
                width={320}
                height={128}
                className="w-full h-32 object-cover rounded transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors duration-300">
                <svg className="w-12 h-12 text-[#00ff99] bg-black/60 rounded-full p-2 group-hover:bg-black/80 transition-colors duration-300 card-icon-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-2v13" />
                  <circle cx="6" cy="18" r="3" strokeWidth={2} />
                </svg>
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Legeztify</h3>
            <p className="text-gray-300 mb-4 text-sm">Enjoy music from around the world, create playlists, and discover new tracks with AI recommendations.</p>
            <button className="bg-[#00ff99] text-[#181818] font-bold px-4 py-2 rounded-lg shadow-md hover:bg-[#00ffe7] transition-all duration-300 transform hover:-translate-y-1">Explore Music</button>
          </div>
          {/* Card 3: Image Download */}
          <div className="bg-black/80 rounded-xl shadow-xl p-6 flex-1 min-w-[260px] max-w-sm border-t-4 border-[#ffaa00] transform hover:scale-105 transition-transform duration-300 animate-card-pop-in group hover:ring-4 hover:ring-[#ffaa00] hover:ring-offset-2 hover:ring-offset-black">
            <div className="relative mb-4 overflow-hidden rounded">
              <Image
                src="https://placehold.co/320x128/ffaa00/ffffff?text=Image+Download"
                alt="Download Images"
                width={320}
                height={128}
                className="w-full h-32 object-cover rounded transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors duration-300">
                <svg className="w-12 h-12 text-[#ffaa00] bg-black/60 rounded-full p-2 group-hover:bg-black/80 transition-colors duration-300 card-icon-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-4 4V4" />
                </svg>
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Legezterest</h3>
            <p className="text-gray-300 mb-4 text-sm">Discover, save, and download inspiring images with Legezterest—your creative visual hub.</p>
            <button className="bg-[#ffaa00] text-[#181818] font-bold px-4 py-2 rounded-lg shadow-md hover:bg-[#ffcc00] transition-all duration-300 transform hover:-translate-y-1">Explore Legezterest</button>
          </div>
          {/* Card 4: PDF AI Analysis */}
          <div className="bg-black/80 rounded-xl shadow-xl p-6 flex-1 min-w-[260px] max-w-sm border-t-4 border-[#00bfff] transform hover:scale-105 transition-transform duration-300 animate-card-pop-in group hover:ring-4 hover:ring-[#00bfff] hover:ring-offset-2 hover:ring-offset-black">
            <div className="relative mb-4 overflow-hidden rounded">
              <Image
                src="https://placehold.co/320x128/00bfff/ffffff?text=PDF+AI"
                alt="PDF AI Analysis"
                width={320}
                height={128}
                className="w-full h-32 object-cover rounded transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors duration-300">
                <svg className="w-12 h-12 text-[#00bfff] bg-black/60 rounded-full p-2 group-hover:bg-black/80 transition-colors duration-300 card-icon-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8h8M8 12h8M8 16h4" />
                </svg>
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Legezt PDF AI</h3>
            <p className="text-gray-300 mb-4 text-sm">Upload your PDF and get instant AI-powered summaries, insights, and advanced answers from your documents.</p>
            <button className="bg-[#00bfff] text-[#181818] font-bold px-4 py-2 rounded-lg shadow-md hover:bg-[#00ffe7] transition-all duration-300 transform hover:-translate-y-1">Analyze PDF</button>
          </div>
          {/* Card 5: AI Chat */}
          <div className="bg-black/80 rounded-xl shadow-xl p-6 flex-1 min-w-[260px] max-w-sm border-t-4 border-[#ff00cc] transform hover:scale-105 transition-transform duration-300 animate-card-pop-in group hover:ring-4 hover:ring-[#ff00cc] hover:ring-offset-2 hover:ring-offset-black">
            <div className="relative mb-4 overflow-hidden rounded">
              <Image
                src="https://placehold.co/320x128/ff00cc/ffffff?text=AI+Chat"
                alt="AI Chat"
                width={320}
                height={128}
                className="w-full h-32 object-cover rounded transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors duration-300">
                <svg className="w-12 h-12 text-[#ff00cc] bg-black/60 rounded-full p-2 group-hover:bg-black/80 transition-colors duration-300 card-icon-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15h8M9 10h.01M15 10h.01" />
                </svg>
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Legezt AI Chat</h3>
            <p className="text-gray-300 mb-4 text-sm">Chat with our advanced AI assistant for help, advice, or just a friendly conversation—anytime, anywhere.</p>
            <button className="bg-[#ff00cc] text-[#181818] font-bold px-4 py-2 rounded-lg shadow-md hover:bg-[#ff66cc] transition-all duration-300 transform hover:-translate-y-1">Start Chatting</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-black/90 border-t border-[#222] py-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-6">
          <div className="flex flex-col gap-2 text-white text-sm text-center md:text-left animate-footer-enter">
            <span className="font-bold text-lg">SUBSCRIBE TO OUR NEWSLETTER!</span>
            <span>Get the latest news and updates from Legezt.</span>
            <div className="flex mt-2 w-full max-w-sm mx-auto md:mx-0">
              <input type="email" placeholder="Your e-mail address..." className="px-3 py-2 rounded-l-lg bg-[#181818] border border-[#00ffe7] text-white focus:outline-none focus:ring-2 focus:ring-[#00ffe7] flex-grow" />
              <button className="px-4 py-2 bg-[#00ffe7] text-[#181818] font-bold rounded-r-lg hover:bg-[#00bfff] transition-colors duration-300">SUBSCRIBE</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-white text-sm text-center md:text-left animate-footer-enter">
            <span className="font-bold text-lg">CONTACT US</span>
            <span>If you are interested in learning more about Legezt, please <a href="#" className="text-[#00ffe7] underline hover:text-[#00bfff] transition-colors duration-300">send us an email</a>. We would love to hear from you!</span>
          </div>
          <div className="flex flex-col gap-2 text-white text-sm text-center md:text-left animate-footer-enter">
            <span className="font-bold text-lg">Quick Links</span>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
  <Link href="/" className="hover:text-[#00ffe7] transition-colors duration-300">Home</Link>
  <Link href="/legeztify" className="hover:text-[#00ffe7] transition-colors duration-300">Legeztify</Link>
  <Link href="/legezterest" className="hover:text-[#00ffe7] transition-colors duration-300">Legezterest</Link>
  <Link href="/legezttube" className="hover:text-[#00ffe7] transition-colors duration-300">LegeztTube</Link>
  <Link href="/legezt-pdf-ai" className="hover:text-[#00ffe7] transition-colors duration-300">Legezt PDF AI</Link>
  <Link href="/legezt-ai" className="hover:text-[#00ffe7] transition-colors duration-300">Legezt AI</Link>
</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-6">© {new Date().getFullYear()} Legezt. All Rights Reserved.</div>
      </footer>

      <style>{`
        /* Font import for Inter */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }

        /* Animations for hero section text */
        @keyframes slideInUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-hero-enter {
          opacity: 0; /* Hidden by default */
          animation: slideInUp 0.8s ease-out forwards;
        }
        .is-visible {
          opacity: 1 !important;
        }

        /* Text glow pulse for main heading */
        @keyframes textGlowPulse {
          0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 231, 0.6), 0 0 20px rgba(0, 255, 231, 0.4); }
          50% { text-shadow: 0 0 15px rgba(0, 255, 231, 0.8), 0 0 30px rgba(0, 255, 231, 0.6); }
        }
        .animate-text-glow-pulse {
          animation: textGlowPulse 3s ease-in-out infinite alternate;
        }

        /* Animations for cards (pop-in effect) */
        @keyframes cardPopIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          70% { opacity: 1; transform: translateY(-5px) scale(1.02); } /* Slight overshoot */
          100% { transform: translateY(0) scale(1); }
        }
        .animate-card-pop-in {
          opacity: 0; /* Hidden by default */
          animation: cardPopIn 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; /* Bouncy effect */
        }

        /* Navigation bar slide down */
        @keyframes navSlideDown {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-nav-slide-down {
          animation: navSlideDown 0.7s ease-out forwards;
        }

        /* Pulse animation for the logo */
        @keyframes pulseLogo {
          0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(0, 255, 231, 0.5); }
          50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(0, 255, 231, 0.8); }
        }
        .animate-pulse-logo {
          animation: pulseLogo 2s ease-in-out infinite alternate;
        }

        /* Icon bounce animation on card hover */
        @keyframes iconBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .group:hover .card-icon-animate {
          animation: iconBounce 0.5s ease-in-out;
        }

        /* Footer section entrance animation */
        .animate-footer-enter {
          opacity: 0; /* Hidden by default */
          animation: slideInUp 0.8s ease-out forwards;
        }

        /* Button hover effect (general) */
        button {
          transition: all 0.3s ease;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(0, 255, 231, 0.4);
        }
        button:active {
          transform: translateY(0);
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
