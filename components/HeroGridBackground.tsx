import Image from "next/image";

// Architectural grid + CAD blueprint behind the hero. Pure decoration, hidden from assistive tech.
export function HeroGridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="architectural-grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(0,0,0,0.065)" strokeWidth="1" />
            <path d="M -5 0 L 5 0 M 0 -5 L 0 5 M 115 0 L 125 0 M 120 -5 L 120 5" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#architectural-grid)" />
      </svg>

      {/* Rasterised from a 1.7 MB SVG to a 120 KB PNG; next/image serves it as AVIF/WebP. */}
      <div className="absolute bottom-0 right-0 w-[300px] opacity-[0.32] sm:w-[580px] lg:w-[780px] xl:w-[860px]">
        <Image
          src="/art/blueprint-cad.png"
          alt=""
          width={1726}
          height={1357}
          loading="eager"
          sizes="(min-width: 1280px) 860px, (min-width: 1024px) 780px, (min-width: 640px) 580px, 300px"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
