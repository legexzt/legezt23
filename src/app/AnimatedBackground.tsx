
"use client";
import { useEffect, useState } from "react";
import styles from "./AnimatedBackground.module.css";

const IMAGE_COUNT = 5; // We assume you have bg1.jpg through bg5.jpg in /public/backgrounds/

interface AnimatedBackgroundProps {
  className?: string;
}

export default function AnimatedBackground({ className = "" }: AnimatedBackgroundProps) {
  const [current, setCurrent] = useState(1);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        // Correctly cycle from 1 to IMAGE_COUNT
        setCurrent((prev) => (prev % IMAGE_COUNT) + 1);
        setFade(false);
      }, 1500); // This should match the CSS transition duration for a smooth effect
    }, 4000); // Time each image is displayed

    return () => clearInterval(interval);
  }, []);

  const getImageUrl = (imageNumber: number) => {
    return `/backgrounds/bg${imageNumber}.jpg`;
  };

  return (
    <div
      className={`${styles["animated-bg"]} ${styles["animated-bg-dynamic"]} ${fade ? styles.fade : ""} ${className}`}
      style={{
        ["--bg-url"]: `url('${getImageUrl(current)}')`
      } as Record<string, string>}
    />
  );
}
