'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export type HeroSlide = {
  id: string;
  imageUrl: string;
  title: string;
};

const INTERVAL_MS = 6000;

export function HeroBanner({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    // z-0 + pointer-events-none: this layer is purely decorative background.
    // It can never render above, or intercept clicks meant for, the text/buttons.
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      {/* Scrim: sits above the images, below the text (text container uses z-10+),
          so the slides never reduce readability regardless of the photo's own contrast. */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/80 to-surface" />
    </div>
  );
}
