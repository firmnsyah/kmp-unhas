import { Card, CardContent } from "@/components/ui/card";
import { pickLocale } from "@/shared/lib/locale";
import type { Localized } from "@/shared/lib/types";
import Image from "next/image";

export function PersonCard({
  name,
  position,
  photoUrl,
  batchLabel,
  locale,
}: {
  name: string;
  position: Localized;
  photoUrl: string | null;
  batchLabel?: string;
  locale: string;
}) {
  return (
    <Card className="overflow-hidden p-0 text-center">
      <div className="relative aspect-square w-full">
        <Image
          src={photoUrl ?? "/images/avatar-placeholder.svg"}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
      </div>
      <CardContent className="space-y-1 p-4">
        <h3 className="text-sm font-semibold leading-tight">{name}</h3>
        <p className="text-primary text-xs font-medium">{pickLocale(position, locale)}</p>
        {batchLabel ? <p className="text-muted-foreground text-xs">{batchLabel}</p> : null}
      </CardContent>
    </Card>
  );
}
