"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { LogoutMenuItem } from "@/modules/auth/components/logout-button";
import type { Profile } from "@/modules/auth/types";
import { Logo } from "@/shared/ui/logo";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { Menu, UserCircle } from "lucide-react";
import { useState } from "react";
import { roleLabel } from "../nav";
import { SidebarNav } from "./sidebar-nav";

export function DashboardHeader({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-background flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sm:px-6">
      <div className="flex items-center gap-2">
        {/* Toggle sidebar mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 overflow-y-auto p-0">
            <SheetHeader className="border-b">
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <SidebarNav role={profile.role} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="hidden text-sm font-semibold sm:inline">Dashboard</span>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="size-7">
                <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name} />
                <AvatarFallback>{profile.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden text-left sm:block">
                <span className="block text-sm leading-tight font-medium">{profile.full_name}</span>
                <span className="text-muted-foreground block text-xs">{roleLabel(profile.role)}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium">{profile.full_name}</p>
              <p className="text-muted-foreground text-xs">{roleLabel(profile.role)}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profil">
                <UserCircle className="size-4" />
                Pengaturan Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">Lihat Situs</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutMenuItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
