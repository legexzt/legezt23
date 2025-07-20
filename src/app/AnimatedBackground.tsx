
"use client";
import { useEffect, useState } from "react";
import styles from "./AnimatedBackground.module.css";

const IMAGE_COUNT = 5; // Use 5 placeholder images

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
        setCurrent((prev) => (prev % IMAGE_COUNT) + 1);
        setFade(false);
      }, 1500); // Fade duration
    }, 4000); // Image rotation interval

    return () => clearInterval(interval);
  }, []);

  const getImageUrl = () => {
    // Use different placeholder dimensions to ensure the image visibly changes
    const dimensions = ['1920x1080', '1280x720', '1024x768', '1600x900', '1366x768'];
    // The current state is 1-based, so subtract 1 for 0-based array index
    return `https://placehold.co/${dimensions[current - 1]}`;
  };

  return (
    <div
      className={`${styles["animated-bg"]} ${styles["animated-bg-dynamic"]} ${fade ? styles.fade : ""} ${className}`}
      style={{
        ["--bg-url"]: `url('${getImageUrl()}')`
      } as Record<string, string>}
    />
  );
}
