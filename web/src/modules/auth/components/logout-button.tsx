"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { logoutAction } from "../actions";

export function LogoutMenuItem() {
  const [pending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={pending}
      className="cursor-pointer"
      onSelect={(e) => {
        // Cegah menu menutup & meng-unmount sebelum aksi server berjalan.
        e.preventDefault();
        startTransition(() => {
          void logoutAction();
        });
      }}
    >
      <LogOut className="size-4" />
      {pending ? "Keluar..." : "Keluar"}
    </DropdownMenuItem>
  );
}
