import Image from "next/image";
import type { HeroContent } from "@/lib/content";
import { HandDrawnOval, HandDrawnUnderline, HandDrawnSquiggle } from "./HandDrawnMarks";
import { Statue3DViewer } from "./Statue3DViewer";

const noteText = "font-sans font-bold uppercase leading-tight text-black text-[10px] sm:text-xs md:text-[13px] lg:text-[15px]";
const pillarText =
  "font-sans font-black uppercase leading-[1.15] tracking-[-0.03em] text-black text-[15px] sm:text-xl md:text-2xl lg:text-[32px] xl:text-[38px]";

export function HeroSection({ hero }: { hero: HeroContent }) {
  const lastPillar = hero.pillars.length - 1;

  return (
    <section className="relative flex min-h-0 flex-1 flex-col" aria-labelledby="hero-heading">
      {/* The orange lettering below is artwork (warped type), so the real heading is text for SEO/screen readers. */}
      <h1 id="hero-heading" className="sr-only">
        {hero.headline}
      </h1>

      <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 sm:px-6 lg:px-10">
        <div className="relative z-10 w-full pt-1 sm:pt-2">
          <Image
            src="/art/bold-design.svg"
            alt=""
            width={1363}
            height={161}
            loading="eager"
            className="h-auto max-h-[18vh] w-full object-contain"
          />
        </div>

        {/* Middle zone: statue + annotations. Negative margins let the statue overlap both words. */}
        <div className="relative z-[3] -my-[6vh] flex w-full flex-1 items-center justify-center sm:-my-[10vh]">
          <div className="absolute left-0 top-[12%] z-[5] sm:left-6 md:left-[5%] lg:left-[8%] lg:top-[14%]">
            <p className={noteText}>{hero.leftNote.line1}</p>
            <p className="relative mt-0.5 inline-block">
              <span className={noteText}>{hero.leftNote.circledWord}</span>
              <HandDrawnOval />
            </p>
          </div>

          <ul className="absolute bottom-[16%] left-0 z-[5] sm:left-6 sm:bottom-[12%] md:left-[4%] lg:left-[6%]" aria-label="What we do">
            {hero.pillars.map((pillar, i) => (
              <li key={pillar} className={i === lastPillar ? "relative inline-block" : undefined}>
                <span className={pillarText}>{pillar} ·</span>
                {i === lastPillar && <HandDrawnUnderline />}
              </li>
            ))}
          </ul>

          <Statue3DViewer posterSrc={hero.statuePoster} alt={hero.statueAlt} />

          <div className="pointer-events-none absolute right-0 top-[40%] z-[2] sm:right-[8%] md:right-[12%] lg:right-[16%]">
            <Image
              src="/art/that.svg"
              alt=""
              width={294}
              height={92}
              loading="eager"
              className="h-auto w-[84px] sm:w-[140px] md:w-[190px] lg:w-[250px] xl:w-[294px]"
            />
          </div>

          <div className="absolute right-0 top-[12%] z-[5] sm:right-6 md:right-[5%] md:top-[18%] lg:right-[9%] lg:top-[14%]">
            <p className={noteText}>{hero.rightNote.line1}</p>
            <p className="relative mt-0.5 inline-block">
              <span className={noteText}>{hero.rightNote.underlinedPhrase}</span>
              <HandDrawnSquiggle />
            </p>
          </div>
        </div>

        <div className="relative z-[2] w-full max-w-[1240px] pb-1">
          <Image
            src="/art/performs.svg"
            alt=""
            width={1240}
            height={161}
            loading="eager"
            className="h-auto max-h-[18vh] w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
