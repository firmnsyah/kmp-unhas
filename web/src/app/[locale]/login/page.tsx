import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "@/modules/auth";
import { Reveal } from "@/shared/ui/motion";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false },
  };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await params;
  const { next } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("login");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-16">
      <Reveal className="w-full max-w-md">
        <Card>
          <CardContent className="space-y-5 py-8">
            <Link
              href="/"
              className="mb-8 flex justify-center"
              aria-label="KMP-UNHAS"
            >
              <Image
                src="/images/logo.png"
                alt="Logo KMP-UNHAS"
                width={300}
                height={300}
                priority
                className="size-24 object-contain"
              />
            </Link>
            <div className="space-y-1 text-center">
              <h1 className="text-xl font-bold">{t("title")}</h1>
              <p className="text-muted-foreground text-sm">
                {t("description")}
              </p>
            </div>

            <LoginForm next={next} />

            <Link
              href="/"
              className="text-muted-foreground hover:text-primary flex items-center justify-center gap-1.5 text-sm transition-colors"
            >
              <ArrowLeft className="size-4" />
              {t("backHome")}
            </Link>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
