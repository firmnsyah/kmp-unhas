"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateNameAction, updatePasswordAction, type ActionState } from "../actions";

const initial: ActionState = { ok: false, error: null };

function useToastFeedback(state: ActionState) {
  useEffect(() => {
    if (state.message) toast.success(state.message);
    else if (state.error) toast.error(state.error);
  }, [state]);
}

export function ProfileForm({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const [nameState, nameAction, namePending] = useActionState(updateNameAction, initial);
  const [pwState, pwAction, pwPending] = useActionState(updatePasswordAction, initial);
  useToastFeedback(nameState);
  useToastFeedback(pwState);

  return (
    <div className="grid max-w-2xl gap-6">
      <Card>
        <CardContent>
          <form action={nameAction} className="space-y-4">
            <h2 className="font-semibold">Informasi Akun</h2>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input id="full_name" name="full_name" defaultValue={fullName} required />
            </div>
            <Button type="submit" disabled={namePending}>
              {namePending ? <Loader2 className="size-4 animate-spin" /> : null}
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <form action={pwAction} className="space-y-4">
            <h2 className="font-semibold">Ganti Kata Sandi</h2>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi Baru</Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Konfirmasi Kata Sandi</Label>
              <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
            </div>
            <Button type="submit" disabled={pwPending}>
              {pwPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Perbarui Kata Sandi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
