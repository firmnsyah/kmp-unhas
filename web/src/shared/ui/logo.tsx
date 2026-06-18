import { cn } from "@/lib/utils";
import Image from "next/image";

/** Logo resmi organisasi KMP-UNHAS. */
export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/images/logo.png"
        alt="Logo KMP-UNHAS"
        width={300}
        height={300}
        className="size-9 shrink-0 object-contain"
      />
      {withText ? (
        <span className="leading-tight">
          <span className="block text-sm font-bold tracking-tight">KMP-UNHAS</span>
          <span className="text-muted-foreground block text-[10px]">
            Kerukunan Mahasiswa Pinrang
          </span>
        </span>
      ) : null}
    </span>
  );
}
