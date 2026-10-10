import Image from "next/image";
import type { FooterContent } from "@/lib/content";
import { NewsletterForm } from "./NewsletterForm";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} {...external} className={`inline-flex items-center gap-1.5 transition-colors hover:text-brand ${className}`}>
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function FooterSection({ content }: { content: FooterContent }) {
  return (
    <footer id="contact" className="relative w-full overflow-hidden bg-black text-white">
      {/*
        Full-bleed wordmark. Sized in container-query units (cqw) so it always spans the
        container width in pure CSS: no JavaScript measuring and no layout shift.
      */}
      <div className="relative mx-auto w-full max-w-[1440px] px-4 pt-8 sm:px-8 sm:pt-10 lg:px-[70px] lg:pt-12 [container-type:inline-size]">
        <p className="flex items-baseline whitespace-nowrap font-anton uppercase leading-none text-[14.9cqw]">
          <span className="sr-only">{`${content.headlineWord1} ${content.headlineWord2}`}</span>
          <span aria-hidden="true">{content.headlineWord1}</span>
          <span aria-hidden="true" className="relative mx-[0.04em] inline-block w-[0.32em] shrink-0 translate-y-[36%]">
            <Image src="/images/brand/upthrust-symbol.png" alt="" width={670} height={630} sizes="20vw" className="h-auto w-full" />
          </span>
          <span aria-hidden="true">{content.headlineWord2}</span>
        </p>
      </div>

      <div className="relative z-10 w-full border-t border-white/[0.18]" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:px-[70px]">
        <div className="grid min-h-[340px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-0">
          <div className="flex flex-col justify-between space-y-12 lg:col-span-7 lg:space-y-0 lg:pr-12 xl:pr-16">
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
              {content.channels.map((channel) => (
                <li key={channel.title} className="space-y-6">
                  <ExternalLink href={channel.url ?? "#"} className="text-[14px] text-white">
                    {channel.title}
                  </ExternalLink>
                  <div className="space-y-1">
                    <p className="text-[13px] text-neutral-400">{channel.description}</p>
                    <a href={`mailto:${channel.email}`} className="block text-[13px] text-neutral-300 transition-colors hover:text-white">
                      {channel.email}
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <p className="pt-8 text-[13px] text-neutral-400 lg:pt-16">{content.tagline}</p>
          </div>

          <div className="flex flex-col justify-between space-y-8 border-t border-white/[0.18] pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 xl:pl-14">
            <NewsletterForm content={content.newsletter} />

            <nav aria-label="Upthrust websites" className="flex items-center gap-6 pt-2 text-[14px]">
              {content.channels.map((channel) => (
                <ExternalLink key={channel.title} href={channel.url ?? "#"} className="text-white">
                  {channel.title}
                </ExternalLink>
              ))}
            </nav>

            <div className="space-y-1.5 pt-2 text-[13px]">
              <ul className="flex gap-1 text-neutral-300">
                {content.socialLinks.map((link, i) => (
                  <li key={link.href}>
                    <a href={link.href} {...external} className="transition-colors hover:text-white">
                      {link.label}
                    </a>
                    {i < content.socialLinks.length - 1 && <span aria-hidden="true">,</span>}
                  </li>
                ))}
              </ul>
              <ul>
                {content.legalLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-neutral-400 transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="pt-0.5 text-neutral-400">{content.copyright}</p>
            </div>
          </div>
        </div>
      </div>

      <FooterMesh />
    </footer>
  );
}

function FooterMesh() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[60vh] overflow-hidden opacity-20" aria-hidden="true">
      <svg viewBox="0 0 1440 600" fill="none" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="footerWaveFade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 15 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 40} C 400 ${i * 40 + 40}, 1000 ${i * 40 - 40}, 1440 ${i * 40}`} stroke="url(#footerWaveFade)" strokeWidth="1" />
        ))}
        {Array.from({ length: 36 }, (_, i) => {
          const x = i * 40;
          const d = i % 2 === 0 ? 30 : -30;
          return <path key={`v${i}`} d={`M${x} 0 C ${x + d} 300, ${x - d} 600, ${x} 1440`} stroke="url(#footerWaveFade)" strokeWidth="0.8" />;
        })}
      </svg>
    </div>
  );
}
