"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitContactMessage } from "../actions";
import { contactSchema, type ContactInput } from "../schema";

export function ContactForm() {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("registration.validation");

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  const { errors, isSubmitting } = form.formState;
  const fieldError = (key: keyof ContactInput) =>
    errors[key] ? tValidation(errors[key]?.message as string) : null;

  async function onSubmit(values: ContactInput) {
    const result = await submitContactMessage(values);
    if (result.ok) {
      toast.success(t("success"));
      form.reset();
      return;
    }
    toast.error(result.error === "unconfigured" ? tCommon("dbUnconfigured") : t("error"));
  }

  const field = (key: "name" | "email" | "subject") => (
    <div className="space-y-2">
      <Label htmlFor={`contact-${key}`}>{t(`fields.${key}`)}</Label>
      <Input
        id={`contact-${key}`}
        type={key === "email" ? "email" : "text"}
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...form.register("website")}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name")}
        {field("email")}
      </div>
      {field("subject")}
      <div className="space-y-2">
        <Label htmlFor="contact-message">{t("fields.message")}</Label>
        <Textarea
          id="contact-message"
          rows={5}
          placeholder={t("fields.messagePlaceholder")}
          aria-invalid={Boolean(errors.message)}
          {...form.register("message")}
        />
        {fieldError("message") ? (
          <p role="alert" className="text-destructive text-xs">
            {fieldError("message")}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={isSubmitting}>
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
