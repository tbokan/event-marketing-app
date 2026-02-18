import { z } from "zod";

export const nameSchema = z.object({
  name: z.string().min(1, "Ime je obvezno").max(50),
  lastname: z.string().min(1, "Priimek je obvezen").max(50),
});

export const emailSchema = z.object({
  email: z.string().email("Neveljaven e-poštni naslov"),
});

export const profileSchema = z.object({
  answer: z.enum(["podatkovni", "produktni", "performance", "ne_vem"], {
    message: "Izberi odgovor",
  }),
});

export type NameFormValues = z.infer<typeof nameSchema>;
export type EmailFormValues = z.infer<typeof emailSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
