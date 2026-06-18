import { z } from "zod";

// Pesan error berupa kunci terjemahan — diterjemahkan di sisi form
// (registration.validation.*) agar mengikuti locale aktif.
export const registrationSchema = z.object({
  full_name: z.string().min(3, "min").max(100, "max"),
  nim: z.string().regex(/^[A-Za-z0-9]{5,20}$/, "nim"),
  faculty: z.string().min(3, "min").max(100, "max"),
  major: z.string().min(3, "min").max(100, "max"),
  batch: z.string().regex(/^20\d{2}$/, "required"),
  origin: z.string().min(3, "min").max(150, "max"),
  email: z.string().email("email"),
  whatsapp: z.string().regex(/^(\+62|62|0)8\d{7,12}$/, "phone"),
  reason: z.string().min(10, "min").max(1000, "max"),
  consent: z.boolean().refine((v) => v === true, { message: "consent" }),
  // Honeypot anti-spam: harus kosong (diisi bot, bukan manusia)
  website: z.string().max(0).optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
