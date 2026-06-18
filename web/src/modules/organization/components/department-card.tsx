import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/shared/lib/locale";
import type { Department } from "@/shared/lib/types";
import { HoverLift } from "@/shared/ui/motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function DepartmentCard({
  department,
  locale,
  detailLabel,
}: {
  department: Department;
  locale: string;
  detailLabel: string;
}) {
  const name = pickLocale(department.name, locale);
  return (
    <HoverLift className="h-full">
      <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-md">
        <Link href={`/tentang/departemen/${department.slug}`} className="flex h-full flex-col">
          <div className="relative aspect-[2/1] w-full">
            <Image
              src={department.image_url ?? "/images/dept-placeholder.svg"}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <CardContent className="flex flex-1 flex-col gap-2 p-5">
            <h3 className="font-semibold leading-snug">{name}</h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {pickLocale(department.description, locale)}
            </p>
            <span className="text-primary mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium">
              {detailLabel}
              <ArrowRight className="size-4" />
            </span>
          </CardContent>
        </Link>
      </Card>
    </HoverLift>
  );
}
