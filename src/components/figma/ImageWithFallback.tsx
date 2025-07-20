
"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageWithFallback = ({ src, alt, ...props }: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <Image
      src={error ? 'https://placehold.co/300x300' : src}
      alt={alt}
      onError={handleError}
      {...props}
      width={300} // Set a default width
      height={300} // Set a default height
    />
  );
};
