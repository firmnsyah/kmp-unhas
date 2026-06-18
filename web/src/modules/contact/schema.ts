import { z } from "zod";

// Pesan error = kunci terjemahan (registration.validation.* dipakai bersama)
export const contactSchema = z.object({
  name: z.string().min(2, "min").max(100, "max"),
  email: z.string().email("email"),
  subject: z.string().min(3, "min").max(150, "max"),
  message: z.string().min(10, "min").max(2000, "max"),
  website: z.string().max(0).optional(), // honeypot
});

export type ContactInput = z.infer<typeof contactSchema>;
