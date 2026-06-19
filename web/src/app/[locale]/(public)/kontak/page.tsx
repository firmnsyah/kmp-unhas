import { Card, CardContent } from "@/components/ui/card";
import { getContactContent } from "@/modules/cms";
import { ContactForm } from "@/modules/contact";
import { richTextToHtml } from "@/shared/lib/html";
import { InstagramIcon } from "@/shared/ui/brand-icons";
import { Reveal } from "@/shared/ui/motion";
import { PageHeader, Section } from "@/shared/ui/section";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const contact = await getContactContent();

  const infoItems = [
    { icon: MapPin, label: t("address"), value: contact.address, html: true },
    { icon: Mail, label: t("email"), value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: t("phone"), value: contact.phone },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Info kontak */}
          <Reveal className="space-y-6">
            <div className="space-y-4">
              {infoItems.map((item) => (
                <div key={item.label} className="flex gap-3.5">
                  <span className="text-primary flex size-10 shrink-0 items-center justify-center">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : item.html ? (
                      <div
                        className="text-muted-foreground text-sm [&_p]:m-0"
                        dangerouslySetInnerHTML={{ __html: richTextToHtml(item.value) }}
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
              {contact.instagram ? (
                <div className="flex gap-3.5">
                  <span className="text-primary flex size-10 shrink-0 items-center justify-center">
                    <InstagramIcon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t("socials")}</p>
                    <a
                      href={contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              ) : null}
            </div>

            {contact.maps_embed ? (
              <div className="overflow-hidden rounded-xl border">
                <iframe
                  src={contact.maps_embed}
                  title={t("mapTitle")}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="aspect-video w-full"
                />
              </div>
            ) : null}
          </Reveal>

          {/* Form pesan */}
          <Reveal delay={0.08}>
            <Card>
              <CardContent className="space-y-5">
                <h2 className="text-lg font-bold">{t("formTitle")}</h2>
                <ContactForm />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
