"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitRegistration } from "../actions";
import { registrationSchema, type RegistrationInput } from "../schema";

export function RegistrationForm() {
  const t = useTranslations("registration");
  const tCommon = useTranslations("common");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      full_name: "",
      nim: "",
      faculty: "",
      major: "",
      batch: "",
      origin: "",
      email: "",
      whatsapp: "",
      reason: "",
      consent: false,
      website: "",
    },
  });

  async function onSubmit(values: RegistrationInput) {
    const result = await submitRegistration(values);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    toast.error(result.error === "unconfigured" ? tCommon("dbUnconfigured") : t("error"));
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardContent className="space-y-4 py-10">
          <CheckCircle2 className="text-primary mx-auto size-14" aria-hidden />
          <h2 className="text-xl font-bold">{t("success.title")}</h2>
          <p className="text-muted-foreground">{t("success.description")}</p>
          <Button asChild className="mt-2">
            <Link href="/">{t("success.backHome")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { errors, isSubmitting } = form.formState;
  const fieldError = (key: keyof RegistrationInput) =>
    errors[key] ? t(`validation.${errors[key]?.message}`) : null;

  const textField = (
    key: Exclude<keyof RegistrationInput, "consent" | "website" | "reason">,
    options?: { type?: string; placeholder?: string },
  ) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{t(`fields.${key === "full_name" ? "fullName" : key}`)}</Label>
      <Input
        id={key}
        type={options?.type ?? "text"}
        placeholder={options?.placeholder}
        aria-invalid={Boolean(errors[key])}
        {...form.register(key)}
      />
      {fieldError(key) ? (
        <p role="alert" className="text-destructive text-xs">
          {fieldError(key)}
        </p>
      ) : null}
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-5" noValidate>
      {/* Honeypot anti-bot — tersembunyi dari manusia */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...form.register("website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {textField("full_name", { placeholder: t("fields.fullNamePlaceholder") })}
        {textField("nim", { placeholder: t("fields.nimPlaceholder") })}
        {textField("faculty", { placeholder: t("fields.facultyPlaceholder") })}
        {textField("major", { placeholder: t("fields.majorPlaceholder") })}
        {textField("batch", { placeholder: t("fields.batchPlaceholder") })}
        {textField("origin", { placeholder: t("fields.originPlaceholder") })}
        {textField("email", { type: "email", placeholder: t("fields.emailPlaceholder") })}
        {textField("whatsapp", { type: "tel", placeholder: t("fields.whatsappPlaceholder") })}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">{t("fields.reason")}</Label>
        <Textarea
          id="reason"
          rows={4}
          placeholder={t("fields.reasonPlaceholder")}
          aria-invalid={Boolean(errors.reason)}
          {...form.register("reason")}
        />
        {fieldError("reason") ? (
          <p role="alert" className="text-destructive text-xs">
            {fieldError("reason")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="accent-primary mt-0.5 size-4"
            aria-invalid={Boolean(errors.consent)}
            {...form.register("consent")}
          />
          <span>
            {t.rich("fields.consent", {
              link: (chunks) => (
                <Link href="/privasi" className="text-primary underline underline-offset-2">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {errors.consent ? (
          <p role="alert" className="text-destructive text-xs">
            {t("validation.consent")}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {tCommon("actions.submitting")}
          </>
        ) : (
          tCommon("actions.submit")
        )}
      </Button>
    </form>
  );
}
