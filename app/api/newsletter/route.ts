import { NextResponse } from "next/server";
import { validateNewsletter } from "@/lib/newsletter";
import { readLocalSubmissions, storeSubmission, type Submission } from "@/lib/submissions";

/**
 * POST /api/newsletter — validates, stores and acknowledges a newsletter sign-up.
 * The GTM `form_submit` event is pushed by the browser only after this returns 200,
 * so analytics never counts a submission the server rejected.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: the "company" input is hidden from humans, so only bots fill it in.
  // Pretend it worked so the bot learns nothing, but store nothing.
  if (typeof body.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true, id: "ignored" });
  }

  const { data, errors } = validateNewsletter(body);
  if (!data) {
    return NextResponse.json(
      { ok: false, message: "Please fix the highlighted fields.", errors },
      { status: 422 }
    );
  }

  const submission: Submission = {
    id: crypto.randomUUID(),
    email: data.email,
    consent: data.consent,
    source: "footer_newsletter",
    submittedAt: new Date().toISOString(),
    pageUrl: request.headers.get("referer") ?? undefined,
  };

  try {
    const storedIn = await storeSubmission(submission);
    return NextResponse.json({ ok: true, id: submission.id, storedIn });
  } catch (error) {
    console.error("[newsletter] failed to store submission", error);
    return NextResponse.json(
      { ok: false, message: "We couldn't save your sign-up. Please try again in a moment." },
      { status: 502 }
    );
  }
}

/**
 * GET /api/newsletter — lists locally stored submissions for demos.
 * Contains personal data, so outside local dev it requires `Authorization: Bearer <ADMIN_TOKEN>`.
 */
export async function GET(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  const isDev = process.env.NODE_ENV === "development";
  const authorised = isDev || (token && request.headers.get("authorization") === `Bearer ${token}`);

  if (!authorised) {
    return NextResponse.json({ ok: false, message: "Unauthorised." }, { status: 401 });
  }

  const submissions = await readLocalSubmissions();
  return NextResponse.json({ ok: true, count: submissions.length, submissions });
}
