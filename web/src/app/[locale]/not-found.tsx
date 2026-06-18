import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/shared/ui/motion";
import { Home } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-16 text-center">
      <Reveal className="space-y-4">
        <p className="text-primary text-7xl font-extrabold md:text-8xl">404</p>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground max-w-md text-pretty">{t("description")}</p>
        <Button asChild className="mt-2">
          <Link href="/">
            <Home className="size-4" />
            {t("backHome")}
          </Link>
        </Button>
      </Reveal>
    </div>
  );
}
