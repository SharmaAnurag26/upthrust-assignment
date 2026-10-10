import Image from "next/image";

// Decorative hand-drawn marks from the design. Empty alt + aria-hidden: purely visual.
// The underline/squiggle are tiny pre-rasterised 3x PNGs (~5 KB), so they skip the optimiser.

export function HandDrawnOval() {
  return (
    <span className="pointer-events-none absolute -inset-x-3 -inset-y-2 flex items-center justify-center" aria-hidden="true">
      <Image src="/art/hand-drawn-oval.svg" alt="" width={108} height={47} loading="eager" className="h-full w-full scale-110 object-fill" />
    </span>
  );
}

export function HandDrawnUnderline() {
  return (
    <span className="pointer-events-none absolute -bottom-2 left-0 h-[18px] w-full" aria-hidden="true">
      <Image src="/art/hand-drawn-underline.png" alt="" width={124} height={20} loading="eager" unoptimized className="h-full w-full object-fill" />
    </span>
  );
}

export function HandDrawnSquiggle() {
  return (
    <span className="pointer-events-none absolute -bottom-2 left-0 h-[10px] w-full" aria-hidden="true">
      <Image src="/art/hand-drawn-squiggle.png" alt="" width={172} height={9} loading="eager" unoptimized className="h-full w-full object-fill" />
    </span>
  );
}
