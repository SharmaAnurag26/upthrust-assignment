export function ZomatoLogo({ className = "h-5" }: { className?: string }) {
  return (
    <span className={`font-black tracking-tight text-xl md:text-2xl lowercase select-none text-black ${className}`}>
      zomato
    </span>
  );
}

export function BoschLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 select-none text-black ${className}`}>
      <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0" fill="currentColor">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.8" fill="none" />
        <rect x="14" y="5" width="4" height="22" rx="1.5" />
        <rect x="5" y="14" width="22" height="4" rx="1.5" />
      </svg>
      <span className="font-black text-lg md:text-xl tracking-wider uppercase text-black">
        BOSCH
      </span>
    </div>
  );
}

export function LorealLogo({ className = "h-5" }: { className?: string }) {
  return (
    <span className={`font-medium tracking-[0.22em] text-lg md:text-xl uppercase select-none text-black font-serif ${className}`}>
      L&apos;ORÉAL
    </span>
  );
}

export function VegaLogo({ className = "h-5" }: { className?: string }) {
  return (
    <span className={`font-black tracking-[0.16em] text-lg md:text-xl uppercase select-none text-black ${className}`}>
      VEGA
    </span>
  );
}

export function DellLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`flex items-center select-none font-black text-xl md:text-2xl text-black ${className}`}>
      <span>D</span>
      <span className="inline-block transform -rotate-[22deg] origin-center -mx-[1px] translate-y-[-1px]">
        E
      </span>
      <span>LL</span>
    </div>
  );
}

/** Typographic stand-ins for client logos, matched by client name from the CMS. */
export function ClientLogoItem({ name }: { name: string }) {
  const key = name.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");
  switch (key) {
    case "zomato":
      return <ZomatoLogo />;
    case "bosch":
      return <BoschLogo />;
    case "loreal":
      return <LorealLogo />;
    case "vega":
      return <VegaLogo />;
    case "dell":
      return <DellLogo />;
    default:
      return <span className="text-lg font-bold uppercase text-black">{name}</span>;
  }
}
