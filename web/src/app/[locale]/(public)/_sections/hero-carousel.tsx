"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Gambar latar hero bawaan bila CMS belum mengatur gambar.
const DEFAULT_HERO_IMAGES = ["/images/hero1.webp", "/images/hero2.webp", "/images/hero3.jpg"];

// Carousel gambar latar hero — cross-fade otomatis, hormati prefers-reduced-motion.
export function HeroCarousel({ images }: { images: string[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const slides = images.length ? images : DEFAULT_HERO_IMAGES;

  useEffect(() => {
    if (reduceMotion || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [reduceMotion, slides.length]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <AnimatePresence initial={false}>
        <m.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index]}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </m.div>
      </AnimatePresence>
      {/* Overlay gelap transparan 70% (opasitas 30%) agar teks tetap terbaca */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
