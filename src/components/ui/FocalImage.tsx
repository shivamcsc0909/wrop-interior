import React, { useState } from 'react';

interface FocalImageProps {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  focalPointX?: number; // 0 - 100 percentage
  focalPointY?: number; // 0 - 100 percentage
  priority?: boolean;
  className?: string;
}

export const FocalImage: React.FC<FocalImageProps> = ({
  desktopSrc,
  mobileSrc,
  alt,
  focalPointX = 50,
  focalPointY = 50,
  priority = false,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-charcoal ${className}`}>
      <picture>
        {mobileSrc && (
          <source media="(max-width: 768px)" srcSet={mobileSrc} />
        )}
        <img
          src={desktopSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          style={{
            objectPosition: `${focalPointX}% ${focalPointY}%`,
          }}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      </picture>
    </div>
  );
};
