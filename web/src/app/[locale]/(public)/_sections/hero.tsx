"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { m } from "motion/react";
import Image from "next/image";
import { HeroCarousel } from "./hero-carousel";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function Hero({
  title,
  subtitle,
  description,
  ctaPrimary,
  ctaSecondary,
  images,
}: {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  images: string[];
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-2.5 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border md:rounded-3xl">
        {/* Background carousel gambar + overlay */}
        <HeroCarousel images={images} />

        <m.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-center px-6 py-20 text-center text-white md:py-28"
        >
          <m.div variants={item}>
            <Image
              src="/images/logo.png"
              alt="Logo KMP-UNHAS"
              width={300}
              height={300}
              priority
              className="mb-6 size-24 object-contain drop-shadow-lg md:size-28"
            />
          </m.div>
          <m.h1
            variants={item}
            className="max-w-3xl text-3xl font-extrabold tracking-tight text-balance drop-shadow-sm sm:text-4xl md:text-5xl"
          >
            {title} <span className="text-white/90">{subtitle}</span>
          </m.h1>
          <m.p
            variants={item}
            className="mt-6 max-w-2xl text-balance text-white/85 drop-shadow-sm md:text-lg"
          >
            {description}
          </m.p>
          <m.div variants={item} className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/pendaftaran">
                {ctaPrimary}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/tentang/sejarah">{ctaSecondary}</Link>
            </Button>
          </m.div>
        </m.div>
      </div>
    </div>
  );
}
