import { content } from "@/lib/content";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HeroGridBackground } from "@/components/HeroGridBackground";
import { SocialProofBar } from "@/components/SocialProofBar";
import { ServicesSection } from "@/components/ServicesSection";
import { FooterSection } from "@/components/FooterSection";

export default function Home() {
  const { site, hero, socialProof, services, footer } = content;

  // Structured data: who the organisation is, the site, and the services it offers.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.siteUrl}/#organization`,
        name: site.organizationName,
        url: site.siteUrl,
        logo: `${site.siteUrl}/images/brand/upthrust-symbol.png`,
        description: site.seoDescription,
        email: footer.channels[0]?.email,
        ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Design services",
          itemListElement: services.items.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: service.title, description: service.description },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.siteUrl}/#website`,
        url: site.siteUrl,
        name: site.organizationName,
        publisher: { "@id": `${site.siteUrl}/#organization` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so CMS content can never close the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Navbar brandName={site.organizationName} contactText={site.contactButtonText} />

      <main id="main">
        <div className="relative flex min-h-svh flex-col pt-16">
          <HeroGridBackground />
          <HeroSection hero={hero} />
          <SocialProofBar content={socialProof} />
        </div>

        <ServicesSection content={services} />
      </main>

      <FooterSection content={footer} />
    </>
  );
}
