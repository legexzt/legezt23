
"use client";
import { useEffect, useRef, useState } from "react";
import HomePage from "../home-page";
import AnimatedBackground from "../AnimatedBackground";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Show popup, then fade out, then show intro video
    const popupTimer = setTimeout(() => {
      setShowPopup(false);
      setTimeout(() => {
        setShowIntro(true);
      }, 1000); // fade duration
    }, 1200); // popup visible duration
    return () => clearTimeout(popupTimer);
  }, []);

  // Ensure only one of popup, intro, or home is visible at a time
  useEffect(() => {
    if (!showPopup && !showIntro && !showHome) {
      setShowHome(true);
    }
  }, [showPopup, showIntro, showHome]);

  const handleVideoEnd = () => {
    setShowIntro(false);
    setTimeout(() => {
      setShowHome(true);
    }, 1000);
  };

  const handleMuteToggle = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (videoRef.current) {
        videoRef.current.muted = newMuted;
      }
      return newMuted;
    });
  };

  return (
    <div className="relative min-h-screen text-white font-sans">
      <AnimatedBackground />
      {showPopup && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 transition-opacity duration-1000 ${!showPopup ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="text-5xl font-bold tracking-widest text-white drop-shadow-[0_4px_24px_#00ffe7] animate-fadeIn">legezt</div>
        </div>
      )}

      {showIntro && (
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#181818] transition-opacity duration-1000 ${!showIntro ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl blur-[60px] opacity-70 bg-gradient-to-tr from-[#00ffe7] via-[#00bfff] to-[#181818] animate-glow z-0"></div>
            <video
              ref={videoRef}
              className="relative z-10 w-[90vw] h-[220px] sm:w-[900px] sm:h-[500px] md:w-[1100px] md:h-[620px] rounded-3xl shadow-2xl object-cover animate-scaleIn"
              src="/videos/intro.mp4"
              onEnded={handleVideoEnd}
              controls={false}
              autoPlay
              muted={isMuted}
              playsInline
            >
              Sorry, your browser does not support the video tag.
            </video>
            <button
              onClick={handleMuteToggle}
              className="absolute z-50 right-6 bottom-6 bg-black/60 hover:bg-black/80 p-2 rounded-full shadow-lg transition mute-button"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#00ffe7]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 19L5 5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-[#00ffe7]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
                </svg>
              )}
            </button>
          </div>
          {/* Skip Button */}
          <button
            onClick={() => {
              setShowIntro(false);
              setTimeout(() => setShowHome(true), 1000);
            }}
            className="mt-6 px-5 py-2 rounded-full bg-black/60 hover:bg-black/80 text-[#00ffe7] text-sm font-semibold shadow-lg transition-all duration-200 z-[60]"
          >
            Skip
          </button>
          <style jsx global>{`
            @keyframes scaleIn {
              0% { transform: scale(0.9); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-scaleIn {
              animation: scaleIn 1.2s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes glow {
              0%,100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
            .animate-glow {
              animation: glow 2.5s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}

      {showHome && <HomePage />}
    </div>
  );
}
