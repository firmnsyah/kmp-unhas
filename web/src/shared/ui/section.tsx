import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Reveal } from "./motion";

/** Pembungkus section halaman publik dengan lebar konsisten. */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20", className)}>
      {children}
    </section>
  );
}

/** Judul section dengan aksen merah/biru + animasi reveal. */
export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
      <div>
        <div className="brand-gradient mb-3 h-1 w-12 rounded-full" aria-hidden />
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        {subtitle ? <p className="text-muted-foreground mt-2 max-w-xl">{subtitle}</p> : null}
      </div>
      {action}
    </Reveal>
  );
}

/** Header halaman (selain beranda). */
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <Reveal>
          <div className="brand-gradient mb-4 h-1 w-12 rounded-full" aria-hidden />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          {subtitle ? <p className="text-muted-foreground mt-3 max-w-2xl">{subtitle}</p> : null}
        </Reveal>
      </div>
    </div>
  );
}

/** Empty state sederhana. */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-muted-foreground rounded-lg border border-dashed px-6 py-16 text-center">
      {message}
    </div>
  );
}
