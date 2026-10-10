import type { Entry } from "@keystatic/core/reader";
import type keystaticConfig from "../keystatic.config";

import site from "../content/site.json";
import hero from "../content/hero.json";
import socialProof from "../content/social-proof.json";
import services from "../content/services.json";
import footer from "../content/footer.json";

/**
 * Content layer. The JSON files in /content are written by Keystatic (/keystatic) and
 * imported statically, so the page is fully pre-rendered at build time and any CMS save
 * hot-reloads in dev. Types are derived from the Keystatic schema, so the components and
 * the CMS can never drift apart silently.
 */
type Singletons = (typeof keystaticConfig)["singletons"];

export type SiteContent = Entry<Singletons["site"]>;
export type HeroContent = Entry<Singletons["hero"]>;
export type SocialProofContent = Entry<Singletons["socialProof"]>;
export type ServicesContent = Entry<Singletons["services"]>;
export type ServiceItem = ServicesContent["items"][number];
export type FooterContent = Entry<Singletons["footer"]>;

export const content = {
  site: site as SiteContent,
  hero: hero as HeroContent,
  // Keystatic omits empty optional fields (e.g. no logo) when saving, hence the `unknown` hop.
  socialProof: socialProof as unknown as SocialProofContent,
  services: services as ServicesContent,
  footer: footer as FooterContent,
};
