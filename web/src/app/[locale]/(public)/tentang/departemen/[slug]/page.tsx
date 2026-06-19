import { Card, CardContent } from "@/components/ui/card";
import { getDepartmentBySlug, getDepartments, PersonCard } from "@/modules/organization";
import { richTextToHtml } from "@/shared/lib/html";
import { pickLocale } from "@/shared/lib/locale";
import { Reveal } from "@/shared/ui/motion";
import { PageHeader, Section } from "@/shared/ui/section";
import { ClipboardList } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const departments = await getDepartments();
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const department = await getDepartmentBySlug(slug);
  if (!department) return {};
  return {
    title: pickLocale(department.name, locale),
    description: pickLocale(department.description, locale),
  };
}

export default async function DepartmentDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const department = await getDepartmentBySlug(slug);
  if (!department) notFound();

  const t = await getTranslations("structure");

  return (
    <>
      <PageHeader
        title={pickLocale(department.name, locale)}
        subtitle={pickLocale(department.description, locale)}
      />

      {department.members.length ? (
        <Section className="py-12 md:py-14">
          <Reveal>
            <h2 className="mb-6 text-xl font-bold md:text-2xl">{t("members")}</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {department.members.map((member, i) => (
              <Reveal key={member.id} delay={(i % 4) * 0.05}>
                <PersonCard
                  name={member.name}
                  position={member.position}
                  photoUrl={member.photo_url}
                  batchLabel={member.batch ? t("batch", { batch: member.batch }) : undefined}
                  locale={locale}
                />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {department.programs.length ? (
        <Section className="py-12 md:py-14">
          <Reveal>
            <h2 className="mb-6 text-xl font-bold md:text-2xl">{t("programs")}</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {department.programs.map((program, i) => (
              <Reveal key={program.id} delay={(i % 2) * 0.05}>
                <Card className="h-full">
                  <CardContent className="flex gap-4">
                    <span className="text-primary flex size-10 shrink-0 items-center justify-center">
                      <ClipboardList className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{pickLocale(program.name, locale)}</h3>
                      <div
                        className="prose prose-sm prose-neutral dark:prose-invert text-muted-foreground mt-1 max-w-none"
                        dangerouslySetInnerHTML={{ __html: richTextToHtml(pickLocale(program.description, locale)) }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
