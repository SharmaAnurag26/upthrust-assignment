import Image from "next/image";
import type { ServicesContent } from "@/lib/content";
import { ServicesBackground } from "./ServicesBackground";
import { ServicesCarouselControls } from "./ServicesCarouselControls";

const TRACK_ID = "services-track";

/**
 * Full-height horizontal carousel built on native CSS scroll-snap: touch swipe, trackpad and
 * keyboard (focus the track, then ←/→) work without a library. This is a server component;
 * only the wheel handling and dots in <ServicesCarouselControls> run in the browser.
 */
export function ServicesSection({ content }: { content: ServicesContent }) {
  const { kicker, items } = content;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      aria-roledescription="carousel"
      className="relative h-svh min-h-[640px] w-full overflow-hidden bg-black text-white"
    >
      <h2 id="services-heading" className="sr-only">
        Services
      </h2>
      <ServicesBackground />

      <div
        id={TRACK_ID}
        tabIndex={0}
        aria-label="Services — use the arrow keys to move between slides"
        className="no-scrollbar relative z-10 h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        <div className="relative flex h-full" style={{ width: `${items.length * 100}%` }}>
          {/* One continuous 3D curve spans every slide, so it travels as the user scrolls. */}
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <Image src="/art/services-curve.png" alt="" fill sizes="400vw" className="object-fill opacity-90" />
          </div>

          {items.map((service, index) => (
            <div
              key={service.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}: ${service.title}`}
              className="relative z-10 flex h-full shrink-0 snap-start flex-col px-5 pb-14 pt-10 sm:px-10 sm:pt-12 md:px-14 lg:px-16"
              style={{ width: `${100 / items.length}%` }}
            >
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">
                {kicker}
              </p>
              <h3 className="text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-5xl md:whitespace-nowrap md:text-[52px] lg:text-[56px]">
                {service.title}
              </h3>

              <div className="mt-6 flex flex-1 flex-col justify-center gap-6 md:flex-row md:items-center md:justify-start md:gap-10 lg:gap-12">
                <div className="relative aspect-[984/664] w-full max-w-[520px] shrink-0 overflow-hidden rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.5)] md:w-[46%] md:max-w-none">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(min-width: 768px) 46vw, 90vw"
                    className="object-cover"
                  />
                </div>

                <div className="max-w-[380px]">
                  <p className="text-[15px] leading-snug sm:text-base lg:text-[17px]">{service.description}</p>
                  <ul className="mt-4 space-y-2 md:mt-5">
                    {service.capabilities.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[14px] font-medium leading-snug">
                        <span aria-hidden="true">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={service.ctaHref}
                    className="mt-5 inline-flex items-center justify-center rounded-[3px] bg-white px-8 py-3 text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand-ink transition-colors hover:bg-brand hover:text-white md:mt-6"
                  >
                    {service.ctaText}
                    <span className="sr-only"> us about {service.title}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ServicesCarouselControls trackId={TRACK_ID} titles={items.map((item) => item.title)} />
    </section>
  );
}
