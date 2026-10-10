import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  brandName: string;
  contactText: string;
}

// Overlays the hero (absolute) so the hero's grid background runs behind it.
export function Navbar({ brandName, contactText }: NavbarProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-10 lg:px-14">
        {/* No prefetch: this is a one-page site, so prefetching "/" would re-download the current page. */}
        <Link href="/" prefetch={false} aria-label={`${brandName} home`} className="flex items-center">
          <Image
            src="/images/brand/upthrust-logo.svg"
            alt={brandName}
            width={157}
            height={32}
            loading="eager"
            className="h-6 w-auto sm:h-7"
          />
        </Link>

        <a
          href="#contact"
          className="font-anton text-2xl uppercase tracking-wide text-brand transition-opacity hover:opacity-80"
        >
          {contactText}
        </a>
      </div>
    </header>
  );
}
