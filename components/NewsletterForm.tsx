"use client";

import { useRef, useState } from "react";
import type { FooterContent } from "@/lib/content";
import { validateNewsletter, type FieldErrors } from "@/lib/newsletter";
import { pushDataLayerEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Newsletter sign-up.
 * Flow: validate in the browser → POST /api/newsletter (validates again, stores) →
 * only on a 200 response push `form_submit` to the GTM data layer and show the success state.
 */
export function NewsletterForm({ content }: { content: FooterContent["newsletter"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") ?? ""),
      consent: formData.get("consent") === "on",
      company: String(formData.get("company") ?? ""), // honeypot
    };

    const { errors: clientErrors } = validateNewsletter(payload);
    setErrors(clientErrors);
    setFormError(null);
    if (Object.keys(clientErrors).length) {
      // Send keyboard and screen-reader users straight to the first problem.
      form.querySelector<HTMLElement>(clientErrors.email ? "#newsletter-email" : "#newsletter-consent")?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      // Conversion event — fired only after the server confirmed the submission was stored.
      pushDataLayerEvent({
        event: "form_submit",
        form_id: "footer_newsletter",
        form_name: "Newsletter sign-up",
        form_location: "footer",
        submission_id: data.id,
      });

      form.reset();
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setFormError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <div className="w-full">
      <h2 className="mb-2.5 text-[14px] font-normal text-white sm:text-[15px]">{content.heading}</h2>

      {status === "success" ? (
        <div ref={successRef} tabIndex={-1} role="status" className="rounded-sm border border-emerald-500/40 bg-emerald-950/30 p-4">
          <p className="mb-1 flex items-center gap-2 text-xs font-medium text-emerald-400">
            <span aria-hidden="true">✓</span> You&apos;re subscribed
          </p>
          <p className="mb-2 text-xs leading-relaxed text-neutral-300">{content.successMessage}</p>
          <button type="button" onClick={() => setStatus("idle")} className="text-xs text-white underline underline-offset-2 hover:text-brand">
            Sign up another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5" aria-describedby={formError ? "newsletter-form-error" : undefined}>
          {/* Honeypot: visually hidden and skipped by keyboard users; bots fill it in. */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="newsletter-company">Company</label>
            <input id="newsletter-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <label className="group flex cursor-pointer items-start gap-2.5 text-[11px] leading-snug text-neutral-400">
              <input
                id="newsletter-consent"
                name="consent"
                type="checkbox"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "newsletter-consent-error" : undefined}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand"
              />
              <span className="transition-colors group-hover:text-neutral-300">{content.consentText}</span>
            </label>
            {errors.consent && (
              <p id="newsletter-consent-error" className="mt-1.5 text-xs text-rose-400">
                {errors.consent}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder={content.placeholder}
              disabled={status === "submitting"}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "newsletter-email-error" : undefined}
              className="w-full border-b border-white/30 bg-transparent py-2 text-[14px] text-white placeholder:text-neutral-500 focus:border-white aria-[invalid=true]:border-rose-400"
            />
            {errors.email && (
              <p id="newsletter-email-error" className="mt-1.5 text-xs text-rose-400">
                {errors.email}
              </p>
            )}
          </div>

          {formError && (
            <p id="newsletter-form-error" role="alert" className="text-xs text-rose-400">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="py-1 text-[14px] text-white transition-colors hover:text-brand disabled:opacity-60"
          >
            {status === "submitting" ? "Submitting…" : content.buttonText}
          </button>
        </form>
      )}
    </div>
  );
}
