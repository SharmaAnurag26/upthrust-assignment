import { config, fields, singleton } from "@keystatic/core";

/**
 * Keystatic CMS schema.
 *
 * Every editable piece of the landing page lives in a JSON file under /content.
 * Editors change it through the admin UI at /keystatic:
 *  - Locally (`npm run dev`) saves are written straight to the files on disk.
 *  - In production, set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO and the Keystatic GitHub App
 *    env vars: every save becomes a commit, which triggers a Vercel redeploy.
 */
const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as
  | `${string}/${string}`
  | undefined;

const image = (label: string, section: string) =>
  fields.image({
    label,
    directory: `public/images/${section}`,
    publicPath: `/images/${section}/`,
    validation: { isRequired: true },
  });

const link = fields.object({
  label: fields.text({ label: "Label", validation: { isRequired: true } }),
  href: fields.text({ label: "URL", validation: { isRequired: true } }),
});

export default config({
  storage: githubRepo ? { kind: "github", repo: githubRepo } : { kind: "local" },
  ui: {
    brand: { name: "Upthrust CMS" },
    navigation: {
      Settings: ["site"],
      "Page sections": ["hero", "socialProof", "services", "footer"],
    },
  },
  singletons: {
    site: singleton({
      label: "Site settings & SEO",
      path: "content/site",
      format: { data: "json" },
      schema: {
        seoTitle: fields.text({
          label: "SEO title",
          description: "Shown in the browser tab and Google results (aim for < 60 characters).",
          validation: { isRequired: true, length: { max: 70 } },
        }),
        seoDescription: fields.text({
          label: "Meta description",
          description: "Shown under the title in Google results (aim for 140–160 characters).",
          multiline: true,
          validation: { isRequired: true, length: { max: 200 } },
        }),
        siteUrl: fields.url({
          label: "Canonical site URL",
          description: "Production domain, without a trailing slash.",
          validation: { isRequired: true },
        }),
        organizationName: fields.text({ label: "Organisation name", validation: { isRequired: true } }),
        sameAs: fields.array(fields.url({ label: "Profile URL" }), {
          label: "Official social profiles (used in structured data)",
          itemLabel: (props) => props.value ?? "Profile",
        }),
        contactButtonText: fields.text({ label: "Header button text", validation: { isRequired: true } }),
      },
    }),

    hero: singleton({
      label: "Hero",
      path: "content/hero",
      format: { data: "json" },
      schema: {
        headline: fields.text({
          label: "Headline (H1)",
          description:
            "The page's main heading for search engines and screen readers. The large orange lettering is artwork and is not changed by this field.",
          validation: { isRequired: true },
        }),
        leftNote: fields.object(
          {
            line1: fields.text({ label: "Line 1" }),
            circledWord: fields.text({ label: "Circled word" }),
          },
          { label: "Upper-left note" }
        ),
        pillars: fields.array(fields.text({ label: "Pillar" }), {
          label: "Pillars (lower-left, the last one is underlined)",
          itemLabel: (props) => props.value,
        }),
        rightNote: fields.object(
          {
            line1: fields.text({ label: "Line 1" }),
            underlinedPhrase: fields.text({ label: "Underlined phrase" }),
          },
          { label: "Upper-right note" }
        ),
        statuePoster: image("Statue poster image (shown before the 3D model loads)", "hero"),
        statueAlt: fields.text({ label: "Statue alt text", validation: { isRequired: true } }),
      },
    }),

    socialProof: singleton({
      label: "Social proof",
      path: "content/social-proof",
      format: { data: "json" },
      schema: {
        statNumber: fields.text({ label: "Stat number", validation: { isRequired: true } }),
        statLabel: fields.text({ label: "Stat label", validation: { isRequired: true } }),
        clients: fields.array(
          fields.object({
            name: fields.text({ label: "Client name", validation: { isRequired: true } }),
            logo: fields.image({
              label: "Logo (optional — the name is rendered as text when empty)",
              directory: "public/images/clients",
              publicPath: "/images/clients/",
            }),
          }),
          { label: "Client logos", itemLabel: (props) => props.fields.name.value }
        ),
      },
    }),

    services: singleton({
      label: "Services",
      path: "content/services",
      format: { data: "json" },
      schema: {
        kicker: fields.text({ label: "Kicker above each title", validation: { isRequired: true } }),
        items: fields.array(
          fields.object({
            title: fields.text({ label: "Title", validation: { isRequired: true } }),
            description: fields.text({ label: "Description", multiline: true, validation: { isRequired: true } }),
            capabilities: fields.array(fields.text({ label: "Capability" }), {
              label: "Capabilities",
              itemLabel: (props) => props.value,
            }),
            image: image("Showcase image", "services"),
            imageAlt: fields.text({ label: "Image alt text", validation: { isRequired: true } }),
            ctaText: fields.text({ label: "Button text", defaultValue: "CONTACT" }),
            ctaHref: fields.text({ label: "Button link", defaultValue: "#contact" }),
          }),
          {
            label: "Service slides (drag to reorder)",
            itemLabel: (props) => props.fields.title.value,
          }
        ),
      },
    }),

    footer: singleton({
      label: "Footer & newsletter",
      path: "content/footer",
      format: { data: "json" },
      schema: {
        headlineWord1: fields.text({ label: "Headline word 1" }),
        headlineWord2: fields.text({ label: "Headline word 2" }),
        channels: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            url: fields.url({ label: "URL" }),
            description: fields.text({ label: "Description" }),
            email: fields.text({ label: "Email" }),
          }),
          { label: "Channels", itemLabel: (props) => props.fields.title.value }
        ),
        newsletter: fields.object(
          {
            heading: fields.text({ label: "Heading" }),
            consentText: fields.text({ label: "Consent text", multiline: true }),
            placeholder: fields.text({ label: "Email placeholder" }),
            buttonText: fields.text({ label: "Button text" }),
            successMessage: fields.text({ label: "Success message", multiline: true }),
          },
          { label: "Newsletter form" }
        ),
        tagline: fields.text({ label: "Tagline" }),
        socialLinks: fields.array(link, {
          label: "Social links",
          itemLabel: (props) => props.fields.label.value,
        }),
        legalLinks: fields.array(link, {
          label: "Legal links",
          itemLabel: (props) => props.fields.label.value,
        }),
        copyright: fields.text({ label: "Copyright line" }),
      },
    }),
  },
});
