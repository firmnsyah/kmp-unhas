"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};
type PromptOptions = {
  title?: string;
  description?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  type?: string;
};

type ConfirmContextValue = {
  confirm: (opts?: ConfirmOptions) => Promise<boolean>;
  prompt: (opts?: PromptOptions) => Promise<string | null>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

/** Pengganti window.confirm — dialog shadcn, mengembalikan Promise<boolean>. */
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm/usePrompt harus di dalam <ConfirmProvider>.");
  return ctx;
}

type State =
  | { kind: "confirm"; opts: ConfirmOptions; resolve: (v: boolean) => void }
  | { kind: "prompt"; opts: PromptOptions; resolve: (v: string | null) => void }
  | null;

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(null);
  const [value, setValue] = useState("");

  const confirm = useCallback(
    (opts: ConfirmOptions = {}) =>
      new Promise<boolean>((resolve) => setState({ kind: "confirm", opts, resolve })),
    [],
  );
  const prompt = useCallback(
    (opts: PromptOptions = {}) =>
      new Promise<string | null>((resolve) => {
        setValue(opts.defaultValue ?? "");
        setState({ kind: "prompt", opts, resolve });
      }),
    [],
  );

  const api = useMemo(() => ({ confirm, prompt }), [confirm, prompt]);

  const settle = useCallback(
    (result: boolean | string | null) => {
      setState((s) => {
        if (s) s.resolve(result as never);
        return null;
      });
    },
    [],
  );

  const cancelValue = state?.kind === "prompt" ? null : false;
  const isDestructive = state?.kind === "confirm" && state.opts.destructive;

  return (
    <ConfirmContext.Provider value={api}>
      {children}
      <Dialog open={state !== null} onOpenChange={(o) => { if (!o) settle(cancelValue); }}>
        {state ? (
          <DialogContent showCloseButton={false} className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {state.opts.title ?? (state.kind === "confirm" ? "Konfirmasi" : "Masukkan data")}
              </DialogTitle>
              {state.opts.description ? (
                <DialogDescription>{state.opts.description}</DialogDescription>
              ) : null}
            </DialogHeader>

            {state.kind === "prompt" ? (
              <div className="space-y-2">
                {state.opts.label ? <Label htmlFor="confirm-prompt-input">{state.opts.label}</Label> : null}
                <Input
                  id="confirm-prompt-input"
                  type={state.opts.type ?? "text"}
                  value={value}
                  placeholder={state.opts.placeholder}
                  autoFocus
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      settle(value);
                    }
                  }}
                />
              </div>
            ) : null}

            <DialogFooter>
              <Button variant="outline" onClick={() => settle(cancelValue)}>
                {state.opts.cancelText ?? "Batal"}
              </Button>
              <Button
                variant={isDestructive ? "destructive" : "default"}
                onClick={() => settle(state.kind === "confirm" ? true : value)}
              >
                {state.opts.confirmText ?? (state.kind === "confirm" ? "Ya, lanjutkan" : "Simpan")}
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </ConfirmContext.Provider>
  );
}
