import { Card, CardContent } from "@/components/ui/card";
import { FormFiller, getPublicForm } from "@/modules/forms";
import { pickLocale } from "@/shared/lib/locale";
import { Reveal } from "@/shared/ui/motion";
import { PageHeader, Section } from "@/shared/ui/section";
import { Clock } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const form = await getPublicForm(slug);
  if (!form) return {};
  const title = pickLocale(form.title, locale);
  const description = pickLocale(form.description, locale);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(form.banner_url ? { images: [{ url: form.banner_url }] } : {}),
    },
  };
}

export default async function PublicFormPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const form = await getPublicForm(slug);
  if (!form) notFound();

  const closed = !form.is_active || new Date(form.deadline_at) < new Date();
  const title = pickLocale(form.title, locale);
  const description = pickLocale(form.description, locale);

  return (
    <>
      <PageHeader title={title} subtitle={description} />
      <Section className="max-w-2xl">
        <Reveal>
          {closed ? (
            <Card>
              <CardContent className="space-y-3 py-12 text-center">
                <Clock className="text-muted-foreground mx-auto size-10" />
                <h2 className="text-lg font-bold">Form Sudah Ditutup</h2>
                <p className="text-muted-foreground text-sm">
                  Maaf, pengisian form ini sudah ditutup. Pantau media sosial KMP-UNHAS untuk
                  informasi berikutnya.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              {/* Banner form di atas card (bukan latar header) */}
              {form.banner_url ? (
                <div className="relative aspect-16/6 w-full overflow-hidden border-b">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.banner_url}
                    alt={title}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
              ) : null}
              <CardContent className="py-6">
                <FormFiller form={form} questions={form.questions} />
              </CardContent>
            </Card>
          )}
        </Reveal>
      </Section>
    </>
  );
}
