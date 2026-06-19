import { Link } from "@/i18n/navigation";
import { richTextToHtml } from "@/shared/lib/html";
import { InstagramIcon } from "@/shared/ui/brand-icons";
import { Logo } from "@/shared/ui/logo";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ContactContent } from "@/shared/lib/types";

export async function Footer({ contact }: { contact: ContactContent }) {
  const t = await getTranslations("common");

  const exploreLinks = [
    { href: "/tentang/sejarah", label: t("nav.about") },
    { href: "/tentang/pimpinan", label: t("nav.aboutLeadership") },
    { href: "/berita", label: t("nav.news") },
    { href: "/agenda", label: t("nav.events") },
    { href: "/pendaftaran", label: t("nav.register") },
  ];

  return (
    <footer className="border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="text-muted-foreground max-w-xs text-sm">{t("footer.tagline")}</p>
          {contact.instagram ? (
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
            >
              <InstagramIcon className="size-4" />
              Instagram
            </a>
          ) : null}
        </div>

        <nav aria-label={t("footer.explore")}>
          <h3 className="mb-4 text-sm font-semibold">{t("footer.explore")}</h3>
          <ul className="space-y-2.5">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold">{t("footer.contactUs")}</h3>
          <ul className="text-muted-foreground space-y-2.5 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <div
                className="[&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: richTextToHtml(contact.address) }}
              />
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              {contact.phone}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs sm:px-6">
          <p>
            © {new Date().getFullYear()} KMP-UNHAS. {t("footer.rights")}
          </p>
          <Link href="/privasi" className="hover:text-primary transition-colors">
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
