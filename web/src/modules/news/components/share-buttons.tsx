"use client";

import { Button } from "@/components/ui/button";
import { FacebookIcon, WhatsAppIcon, XIcon } from "@/shared/ui/brand-icons";
import { Check, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const t = useTranslations("common.actions");
  const tNews = useTranslations("news");
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const targets = [
    {
      label: "WhatsApp",
      icon: WhatsAppIcon,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground mr-1 text-sm font-medium">{tNews("shareTitle")}</span>
      {targets.map((target) => (
        <Button key={target.label} asChild variant="outline" size="icon" aria-label={target.label}>
          <a href={target.href} target="_blank" rel="noopener noreferrer">
            <target.icon className="size-4" />
          </a>
        </Button>
      ))}
      <Button variant="outline" size="sm" onClick={copyLink}>
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied ? t("linkCopied") : t("copyLink")}
      </Button>
    </div>
  );
}
