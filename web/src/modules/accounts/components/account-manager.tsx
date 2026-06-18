"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import type { UserRole } from "@/modules/auth/types";
import { DashboardPageHeader, DataTable, EmptyRow, roleLabel, StatusBadge } from "@/modules/dashboard";
import { useConfirm } from "@/shared/ui/confirm-provider";
import { KeyRound, Plus, Power, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createAccount,
  deleteAccount,
  resetAccountPassword,
  setAccountActive,
  setAccountRole,
} from "../actions";
import type { AccountRow } from "../queries";

export function AccountManager({
  accounts,
  roleOptions,
  canManageRoles,
  title,
  description,
}: {
  accounts: AccountRow[];
  roleOptions: UserRole[];
  canManageRoles: boolean;
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const { confirm, prompt } = useConfirm();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createAccount(formData);
      if (res.ok) {
        toast.success("Akun dibuat.");
        setOpen(false);
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  function toggleActive(acc: AccountRow) {
    startTransition(async () => {
      const res = await setAccountActive(acc.id, !acc.is_active);
      if (res.ok) {
        toast.success(acc.is_active ? "Akun dinonaktifkan." : "Akun diaktifkan.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  function changeRole(acc: AccountRow, role: UserRole) {
    startTransition(async () => {
      const res = await setAccountRole(acc.id, role);
      if (res.ok) {
        toast.success("Role diperbarui.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  async function resetPassword(acc: AccountRow) {
    const password = await prompt({
      title: "Reset Kata Sandi",
      description: `Akun: ${acc.full_name}`,
      label: "Kata sandi baru (min. 8 karakter)",
      type: "text",
      confirmText: "Reset",
    });
    if (!password) return;
    startTransition(async () => {
      const res = await resetAccountPassword(acc.id, password);
      if (res.ok) toast.success("Kata sandi direset.");
      else toast.error(res.error ?? "Gagal.");
    });
  }

  async function removeAccount(acc: AccountRow) {
    const ok = await confirm({
      title: "Hapus akun permanen?",
      description: `Akun "${acc.full_name}" akan dihapus dan tidak bisa dikembalikan.`,
      confirmText: "Hapus",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteAccount(acc.id);
      if (res.ok) {
        toast.success("Akun dihapus.");
        router.refresh();
      } else toast.error(res.error ?? "Gagal.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DashboardPageHeader
        title={title}
        description={description}
        action={
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Tambah Akun
            </Button>
          </DialogTrigger>
        }
      />
      <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Akun</DialogTitle>
            </DialogHeader>
            <form onSubmit={onCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input id="full_name" name="full_name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi Awal</Label>
                <Input id="password" name="password" type="text" minLength={8} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={roleOptions[0]}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabel(r)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  Buat Akun
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>

      <DataTable
        head={
          <>
            <th>Nama</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-right">Aksi</th>
          </>
        }
      >
        {accounts.length ? (
          accounts.map((acc) => (
            <tr key={acc.id}>
              <td className="font-medium">{acc.full_name}</td>
              <td>
                {canManageRoles ? (
                  <Select
                    value={acc.role}
                    onValueChange={(v) => changeRole(acc, v as UserRole)}
                    disabled={pending}
                  >
                    <SelectTrigger size="sm" className="w-auto text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["super_admin", "admin", "panitia"] as UserRole[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {roleLabel(r)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  roleLabel(acc.role)
                )}
              </td>
              <td>
                <StatusBadge tone={acc.is_active ? "success" : "neutral"}>
                  {acc.is_active ? "Aktif" : "Nonaktif"}
                </StatusBadge>
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => resetPassword(acc)} disabled={pending} aria-label="Reset kata sandi">
                    <KeyRound className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleActive(acc)} disabled={pending} aria-label="Aktif/Nonaktif">
                    <Power className={acc.is_active ? "text-destructive size-4" : "size-4"} />
                  </Button>
                  {canManageRoles ? (
                    <Button variant="ghost" size="icon" onClick={() => removeAccount(acc)} disabled={pending} aria-label="Hapus akun">
                      <Trash2 className="text-destructive size-4" />
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <EmptyRow colSpan={4} message="Belum ada akun." />
        )}
      </DataTable>
    </Dialog>
  );
}
