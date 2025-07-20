"use client";
import { useEffect, useState } from "react";
import styles from "./AnimatedBackground.module.css";

// Dynamically detect all images named bg1.jpg, bg2.jpg, ... in public/backgrounds
function detectImageCount(max = 50) {
  return new Promise<number>((resolve) => {
    function check(i: number) {
      const img = new window.Image();
      img.src = `/backgrounds/bg${i}.jpg`;
      img.onload = () => {
        if (i < max) check(i + 1);
        else resolve(i);
      };
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
  const [imageCount, setImageCount] = useState(3);

  useEffect(() => {
    if (typeof window === "undefined") return;
    detectImageCount(100).then((count) => {
      setImageCount(count);
    });
  }, []);

  useEffect(() => {
    if (imageCount < 1) return;
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrent((prev) => (prev % imageCount) + 1);
        setFade(false);
      }, 1500); // Longer fade duration
    }, 4000); // Faster rotation

    return () => clearInterval(interval);
  }, [imageCount]);

  return (
    <div
      className={`${styles["animated-bg"]} ${styles["animated-bg-dynamic"]} ${fade ? styles.fade : ""} ${className}`}
      style={{
        ["--bg-url"]: `url('/backgrounds/bg${current}.jpg')`
      } as Record<string, string>}
    />
  );
}
