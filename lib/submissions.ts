import { promises as fs } from "fs";
import path from "path";

export interface Submission {
  id: string;
  email: string;
  consent: boolean;
  source: string;
  submittedAt: string;
  pageUrl?: string;
}

export type StorageTarget = "webhook" | "local-file" | "server-log";

const LOCAL_FILE = path.join(process.cwd(), "data", "submissions.json");

/**
 * Persists a submission. The target is picked from the environment, so the same code runs
 * locally and in production without changes:
 *
 *  1. FORM_WEBHOOK_URL set  → POST to the webhook (Google Apps Script → Google Sheet in this
 *     project; Zapier, Make or a CRM endpoint would work the same way).
 *  2. Local dev (not Vercel) → append to data/submissions.json (git-ignored).
 *  3. Otherwise              → structured log line, visible in Vercel → Logs. Serverless file
 *     systems are read-only, so writing a file there is not an option.
 */
export async function storeSubmission(submission: Submission): Promise<StorageTarget> {
  const webhookUrl = process.env.FORM_WEBHOOK_URL;

  if (webhookUrl) {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...submission, secret: process.env.FORM_WEBHOOK_SECRET }),
      signal: AbortSignal.timeout(8000),
    });
    // Apps Script always answers 200, so also honour an explicit { ok: false } in the body.
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || data?.ok === false) throw new Error(`Webhook rejected the submission (${res.status})`);
    return "webhook";
  }

  if (!process.env.VERCEL) {
    const existing = await readLocalSubmissions();
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, JSON.stringify([submission, ...existing], null, 2), "utf-8");
    return "local-file";
  }

  console.info("[newsletter] submission", JSON.stringify(submission));
  return "server-log";
}

export async function readLocalSubmissions(): Promise<Submission[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf-8")) as Submission[];
  } catch {
    return [];
  }
}
