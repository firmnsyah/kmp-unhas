"use client";

// Primitive animasi Framer Motion (PRD §3.4):
// subtil (≤ 400ms), berbasis transform/opacity, hormati prefers-reduced-motion
// (ditangani global via CSS), dan dimuat selektif lewat LazyMotion (bundle kecil).

import { LazyMotion, domAnimation, m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** jeda stagger antar elemen saudara (detik) */
  delay?: number;
  /** arah masuk */
  from?: "bottom" | "left" | "right" | "none";
};

/** Scroll reveal: fade + slide halus saat elemen masuk viewport. */
export function Reveal({ children, className, delay = 0, from = "bottom" }: RevealProps) {
  const offset = { bottom: { y: 24 }, left: { x: -24 }, right: { x: 24 }, none: {} }[from];
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}

/** Hover lift untuk kartu (berita, departemen, galeri). */
export function HoverLift({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div className={className} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      {children}
    </m.div>
  );
}

/** Angka statistik menghitung naik saat terlihat (beranda). */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const duration = 1200;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduceMotion]);

  // Saat reduced-motion, tampilkan nilai akhir langsung tanpa animasi.
  const shown = reduceMotion ? value : display;
  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString("id-ID")}
    </span>
  );
}
