import { z } from "zod";

const optionalShortText = z.string().trim().max(100, "Keep this under 100 characters.");
const invalidEmailMessage = "Enter a valid email address.";
const emailFormatSchema = z.email(invalidEmailMessage);

export const waitlistEmailOnBlurSchema = z
  .string()
  .trim()
  .refine((value) => value.length === 0 || emailFormatSchema.safeParse(value).success, {
    message: invalidEmailMessage,
  });

export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(320, "Keep this under 320 characters.")
    .pipe(emailFormatSchema)
    .transform((email) => email.toLowerCase()),
  name: optionalShortText,
  company: optionalShortText,
  role: optionalShortText,
  currentAi: z.string().trim().max(300, "Keep this under 300 characters."),
  aiFeelings: z.string().trim().max(1000, "Keep this under 1,000 characters."),
  aiEraChange: z.string().trim().max(1000, "Keep this under 1,000 characters."),
});

export type WaitlistFormValues = z.input<typeof waitlistSchema>;
export type WaitlistSubmission = z.output<typeof waitlistSchema>;
