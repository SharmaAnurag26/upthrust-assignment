/**
 * Newsletter validation shared by the browser (instant feedback) and the API route
 * (the source of truth — client-side checks can always be bypassed).
 */
export interface NewsletterInput {
  email: string;
  consent: boolean;
}

export type FieldErrors = Partial<Record<keyof NewsletterInput, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateNewsletter(raw: unknown): {
  data: NewsletterInput | null;
  errors: FieldErrors;
} {
  const input = (raw ?? {}) as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const consent = input.consent === true;
  const errors: FieldErrors = {};

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > 254 || !EMAIL_PATTERN.test(email))
    errors.email = "Please enter a valid email address, e.g. name@company.com.";

  if (!consent) errors.consent = "Please tick the box to agree to receive our emails.";

  return Object.keys(errors).length ? { data: null, errors } : { data: { email, consent }, errors };
}
