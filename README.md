# Upthrust — landing page

Responsive landing page built from the Upthrust Figma file and assets, with CMS-editable content, a working newsletter form and Google Tag Manager conversion tracking.

**Live:** _add Vercel URL_ · **CMS:** `/keystatic` · **Design references:** [`design/`](design/)

## Stack and why

| Choice | Why |
| --- | --- |
| **Next.js 16 (App Router) + React 19** | The page is pre-rendered to static HTML at build time (all content is in the HTML, nothing waits for JavaScript), while API routes give us a backend for the form in the same project. |
| **Tailwind CSS v4** | Design tokens (brand colours, fonts) live in one `@theme` block; responsive variants map directly onto the 375 / 768 / 1440 breakpoints. |
| **Keystatic CMS** | Git-based headless CMS: content is JSON in the repo, editors get a friendly UI, there's no extra database or paid service, and every content change is versioned and reviewable like code. |
| **Vercel** | Zero-config Next.js hosting, preview deployments per branch, edge caching for images. |
| **`<model-viewer>`** | Google's web component for the 3D statue; loaded only on desktop, after the page is idle. |

Trade-off considered: a hosted CMS (Sanity, Contentful) suits large editorial teams and real-time preview better, but adds an account, an API dependency and cost. For a marketing site edited a few times a month, Git-based content is simpler and safer. The content layer (`lib/content.ts`) is the only file that would change if we switched.

## Project structure

```
app/
  (site)/              Marketing site (own root layout: fonts, GTM, metadata)
    layout.tsx         SEO metadata, fonts, GTM, skip link
    page.tsx           Assembles sections + JSON-LD structured data
    globals.css        Design tokens (@theme), focus styles, reduced motion
    opengraph-image.png
  keystatic/           CMS admin UI (separate root layout, noindex)
  api/newsletter/      Form handler: validate → store → respond
  api/keystatic/       Keystatic's API (reads/writes content)
  robots.ts, sitemap.ts
components/            One file per section (Hero, Services, Footer, …)
content/*.json         All editable copy and image paths (written by the CMS)
lib/
  content.ts           Typed content layer (types derived from the CMS schema)
  newsletter.ts        Validation shared by browser and server
  submissions.ts       Storage adapter (webhook → Google Sheet / local file / logs)
  analytics.ts         GTM dataLayer helper
keystatic.config.ts    CMS schema: fields, labels, validation, image folders
public/images/         CMS-managed images · public/art/ design artwork · public/models/ 3D
docs/                  Apps Script for the Google Sheet webhook
design/                Supplied PDFs / Blender / original GLB (not deployed)
```

## Running locally

```bash
npm install
cp .env.example .env.local   # all values optional for local dev
npm run dev                  # http://localhost:3000  ·  CMS: http://localhost:3000/keystatic
npm run build && npm start   # production build
```

## Editing content (non-developers)

Open **`/keystatic`** → pick a section (Hero, Social proof, Services, Footer, Site settings & SEO) → edit → **Save**.

- Headlines, body copy, alt text, SEO title/description, links, newsletter copy.
- Images: upload in the field; Keystatic stores them in `public/images/…`.
- Repeated content (service slides, client logos, capabilities, footer links): add, delete and drag to reorder.
- Locally a save writes the JSON file and the page hot-reloads. In production (GitHub mode, see below) a save creates a commit, Vercel rebuilds, and the change is live in ~1 minute. Every edit is in Git history and can be reverted.

The large orange "BOLD DESIGN / THAT / PERFORMS" lettering is warped artwork (SVG), so it's not a text field; the H1 text behind it is editable.

## Form handling and tracking

1. **Browser** (`components/NewsletterForm.tsx`): validates with the same rules as the server, shows inline field errors (linked via `aria-describedby`, focus moves to the first error).
2. **API** (`POST /api/newsletter`): re-validates (the client can't be trusted), drops bots via a hidden honeypot field, normalises the email, stores it.
3. **Storage** (`lib/submissions.ts`), chosen by environment:
   - `FORM_WEBHOOK_URL` set → POST to a Google Apps Script that appends a row to a Google Sheet ([`docs/form-webhook.gs`](docs/form-webhook.gs)), protected by a shared secret.
   - Local dev → `data/submissions.json` (git-ignored; contains personal data).
   - Neither → structured line in Vercel's function logs (serverless file systems are read-only).
4. **Conversion event**: only after the API returns 200, the browser pushes
   ```js
   { event: "form_submit", form_id: "footer_newsletter", form_name: "Newsletter sign-up", form_location: "footer", submission_id: "<uuid>" }
   ```
   to `window.dataLayer`. No email or other PII is pushed (Google Analytics' terms forbid it).

**Verifying tracking:** type `dataLayer` in the console after submitting · GTM **Preview** mode (Tag Assistant) shows the `form_submit` event and which tags fired · in GTM, a *Custom Event* trigger `form_submit` drives a GA4 event tag; confirm in GA4 **DebugView / Realtime**.

`GET /api/newsletter` lists locally stored submissions for demos: open in dev, `Authorization: Bearer $ADMIN_TOKEN` elsewhere.

## Environment variables

See [`.env.example`](.env.example). Set in Vercel → Settings → Environment Variables (separately for Preview and Production); `.env*` files are git-ignored. Only `NEXT_PUBLIC_*` values reach the browser, and the GTM ID is public by nature. Webhook secret and admin token stay server-side.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GTM_ID` | GTM container (GTM only loads when set) |
| `FORM_WEBHOOK_URL`, `FORM_WEBHOOK_SECRET` | Google Sheet webhook |
| `ADMIN_TOKEN` | Protects `GET /api/newsletter` |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` + Keystatic GitHub App vars | CMS in production (commits to GitHub) |

**Keystatic in production:** set `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo` in `.env.local`, run `npm run dev`, open `/keystatic` and follow the prompt to create the GitHub App. Keystatic writes the `KEYSTATIC_*` values to your local env file; copy them (and the repo variable) into Vercel and add the deployed URL as a callback URL in the GitHub App settings.

## SEO, accessibility, performance

- **SEO:** unique title and description, canonical, Open Graph and Twitter tags, OG image, `robots.txt`, `sitemap.xml`, one H1 → H2 → H3, JSON-LD (`Organization` with its service catalogue + `WebSite`). Fully static HTML.
- **Accessibility:** semantic landmarks, skip link, visible `:focus-visible` ring, labelled form fields with linked errors, ARIA carousel pattern with a keyboard-scrollable track, decorative images `alt=""`, `prefers-reduced-motion` respected, brand orange darkened for small text (#D13600) to meet WCAG AA.
- **Performance:** `next/image` (AVIF/WebP, responsive sizes), self-hosted fonts via `next/font`, 3D model 1.58 MB → 126 KB (Draco), 1.7 MB blueprint SVG → 120 KB PNG, unused assets removed, 3D library deferred until idle and desktop-only, services carousel server-rendered with a small client controller, GTM loaded after hydration.
- Local Lighthouse (production build): Accessibility 100 · SEO 100 · Best Practices 96. Measure Performance with PageSpeed Insights on the deployed URL; local mobile runs on a slow machine vary ±8 points.

## Safe updates after launch

Content → CMS (versioned commits). Code → feature branch → Vercel preview URL → review → merge to `main` → production deploy. Any deploy can be rolled back instantly from the Vercel dashboard.

## AI tools used

Claude Code (Anthropic) for code review, refactoring (CMS integration, form backend, accessibility and performance fixes), asset optimisation scripts, and documentation drafts. All changes were reviewed, run and tested locally (Lighthouse, Playwright screenshots at 375/768/1440, form and CMS round-trips).

## Known limitations and next steps

- Client logos are typographic stand-ins; real SVG logos can be uploaded per client in the CMS.
- Footer copy "add description here" / "Lorem ipsum" comes from the Figma file; it's placeholder text to be replaced via the CMS.
- No rate limiting on the form beyond the honeypot. Next: Vercel KV / Upstash rate limit, double opt-in email via Resend, CRM sync (HubSpot).
- Privacy Policy link is a placeholder anchor.
- Mobile shows a static render of the statue; 3D is desktop-only by design for performance.
- With more time: visual regression tests (Playwright), Lighthouse CI on each PR, consent banner (Consent Mode v2) before GTM fires marketing tags.
