"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/shared/ui/logo";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

// Sub-menu dropdown "Tentang"
const aboutChildren = [
  { href: "/tentang/mars", key: "aboutMars" },
  { href: "/tentang/struktur-kepengurusan", key: "aboutStructure" },
  { href: "/tentang/departemen", key: "aboutDepartments" },
  { href: "/tentang/logo", key: "aboutLogo" },
  { href: "/tentang/dewan-pembina", key: "aboutAdvisory" },
  { href: "/tentang/dewan-pertimbangan", key: "aboutCouncil" },
  { href: "/tentang/pimpinan", key: "aboutLeadership" },
  { href: "/tentang/visi-misi", key: "aboutVisionMission" },
  { href: "/tentang/sejarah", key: "aboutHistory" },
] as const;

export function Navbar() {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    null, // posisi dropdown "Tentang"
    { href: "/berita", label: t("news") },
    { href: "/galeri", label: t("gallery") },
    { href: "/agenda", label: t("events") },
    { href: "/kontak", label: t("contact") },
  ] as const;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" aria-label={t("home")}>
          <Logo />
        </Link>

        {/* Navigasi desktop */}
        <NavigationMenu viewport={false} className="hidden lg:flex">
          <NavigationMenuList>
            {links.map((link, i) =>
              link ? (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "px-3 py-2 text-sm font-medium",
                      isActive(link.href) && "text-primary",
                    )}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={`about-${i}`}>
                  <NavigationMenuTrigger
                    className={cn(
                      "px-3 py-2 text-sm font-medium",
                      isActive("/tentang") && "text-primary",
                    )}
                  >
                    {t("about")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-64 gap-0.5 p-2">
                      {aboutChildren.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "block rounded-md px-3 py-2 text-sm font-medium",
                                isActive(item.href) && "text-primary",
                              )}
                            >
                              {t(item.key)}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/pendaftaran">{t("register")}</Link>
          </Button>

          {/* Menu mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("menu")}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-6" aria-label={t("menu")}>
                {links.map((link, i) =>
                  link ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "hover:bg-accent rounded-md px-3 py-2 text-sm font-medium",
                        isActive(link.href) && "text-primary",
                      )}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <div key={`about-${i}`} className="px-3 py-2">
                      <p className="text-muted-foreground mb-1.5 text-xs font-semibold uppercase tracking-wide">
                        {t("about")}
                      </p>
                      {aboutChildren.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "hover:bg-accent -mx-1 block rounded-md px-3 py-2 text-sm font-medium",
                            isActive(item.href) && "text-primary",
                          )}
                        >
                          {t(item.key)}
                        </Link>
                      ))}
                    </div>
                  ),
                )}
                <div className="mt-3 flex flex-col gap-2 border-t pt-4">
                  <Button asChild>
                    <Link href="/pendaftaran" onClick={() => setOpen(false)}>
                      {t("register")}
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
