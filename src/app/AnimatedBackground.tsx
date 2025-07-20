
"use client";
import { useEffect, useState } from "react";
import styles from "./AnimatedBackground.module.css";

// Dynamically detect all images named bg1.jpg, bg2.jpg, ... in public/backgrounds
function detectImageCount(max = 50): Promise<number> {
  return new Promise<number>((resolve) => {
    if (typeof window === "undefined") {
      resolve(0); // Resolve with 0 on the server
      return;
    }
    
    function check(i: number) {
      if (i > max) {
        resolve(i - 1);
        return;
      }
      const img = new window.Image();
      img.src = `/backgrounds/bg${i}.jpg`;
      img.onload = () => check(i + 1);
      img.onerror = () => resolve(i - 1);
    }
    check(1);
  });
}

interface AnimatedBackgroundProps {
  className?: string;
}

export default function AnimatedBackground({ className = "" }: AnimatedBackgroundProps) {
  const [current, setCurrent] = useState(1);
  const [fade, setFade] = useState(false);
  const [imageCount, setImageCount] = useState(0); // Start with 0
  const [usePlaceholders, setUsePlaceholders] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    detectImageCount(100).then((count) => {
      if (count > 0) {
        setImageCount(count);
        setUsePlaceholders(false);
      } else {
        // If no local images found, use placeholders
        console.warn("No local background images found in /public/backgrounds/. Using placeholders.");
        setImageCount(5); // Use 5 placeholder images
        setUsePlaceholders(true);
      }
    });
  }, []);

  useEffect(() => {
    if (imageCount < 1) return; // Don't start the interval until we have a valid image count
    
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrent((prev) => (prev % imageCount) + 1);
        setFade(false);
      }, 1500); // Longer fade duration
    }, 4000); // Faster rotation

    return () => clearInterval(interval);
  }, [imageCount]);

  const getImageUrl = () => {
    if (usePlaceholders) {
      // Use different placeholders to see the change
      const dimensions = ['1920x1080', '1280x720', '1024x768', '1600x900', '1366x768'];
      return `https://placehold.co/${dimensions[current - 1]}`;
    }
    return `/backgrounds/bg${current}.jpg`;
  };

  if (imageCount === 0) {
    // Render a static placeholder or nothing while detecting images
    return <div className={`${styles["animated-bg"]} ${className}`} style={{ backgroundColor: '#0A0F1E' }} />;
  }

  return (
    <div
      className={`${styles["animated-bg"]} ${styles["animated-bg-dynamic"]} ${fade ? styles.fade : ""} ${className}`}
      style={{
        ["--bg-url"]: `url('${getImageUrl()}')`
      } as Record<string, string>}
    />
  );
}
