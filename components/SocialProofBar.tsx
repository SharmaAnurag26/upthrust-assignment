import Image from "next/image";
import type { SocialProofContent } from "@/lib/content";
import { ClientLogoItem } from "./BrandLogos";

export function SocialProofBar({ content }: { content: SocialProofContent }) {
  const { statNumber, statLabel, clients } = content;

  return (
    <section aria-label="Clients" className="relative z-20 w-full shrink-0 border-y border-black/[0.12]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-4 px-4 py-6 sm:px-10 lg:flex-row lg:items-center lg:gap-14 lg:px-14 lg:py-8">
        <div className="flex shrink-0 flex-col gap-1 border-black/[0.15] sm:flex-row sm:items-center sm:gap-3 lg:flex-col lg:items-start lg:gap-0.5 lg:border-r lg:pr-14">
          <p className="text-4xl font-black leading-none tracking-tight text-black sm:text-5xl">{statNumber}</p>
          <p className="mt-2 max-w-[170px] text-sm font-medium leading-snug text-black/80">{statLabel}</p>
        </div>

        {/* Logos scroll sideways on small screens instead of shrinking to illegible sizes. */}
        <ul className="no-scrollbar flex w-full flex-1 items-center justify-between gap-8 overflow-x-auto py-2 sm:gap-12 md:gap-14">
          {clients.map((client, index) => (
            <li key={`${client.name}-${index}`} className="relative flex shrink-0 items-center justify-center">
              {client.logo ? (
                <Image src={client.logo} alt={client.name} width={140} height={40} className="h-8 w-auto object-contain" />
              ) : (
                <>
                  <span className="sr-only">{client.name}</span>
                  <span aria-hidden="true">
                    <ClientLogoItem name={client.name} />
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
