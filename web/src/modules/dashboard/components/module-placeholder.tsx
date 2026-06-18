import { Card, CardContent } from "@/components/ui/card";
import { Hammer } from "lucide-react";
import { DashboardPageHeader } from "./dashboard-ui";

/** Placeholder modul dashboard yang akan dilengkapi pada tahap berikutnya. */
export function ModulePlaceholder({
  title,
  description,
  note,
}: {
  title: string;
  description?: string;
  note?: string;
}) {
  return (
    <>
      <DashboardPageHeader title={title} description={description} />
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="bg-accent text-primary flex size-12 items-center justify-center rounded-full">
            <Hammer className="size-6" />
          </span>
          <p className="font-medium">Modul sedang disiapkan</p>
          <p className="text-muted-foreground max-w-md text-sm text-pretty">
            {note ??
              "Antarmuka pengelolaan untuk modul ini sedang dikembangkan dan akan tersedia pada pembaruan berikutnya."}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
