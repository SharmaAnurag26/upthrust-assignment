"use client";

import { useEffect, useState } from "react";

/**
 * The only client-side part of the services carousel: wheel → horizontal scroll and the
 * pagination dots. The slides themselves are server-rendered, so they cost no hydration work.
 * Vertical mouse-wheel input moves the slides until the last one, then is released so the
 * page keeps scrolling to the footer.
 */
export function ServicesCarouselControls({ trackId, titles }: { trackId: string; titles: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndex = titles.length - 1;

  useEffect(() => {
    const track = document.getElementById(trackId);
    if (!track) return;

    const onScroll = () => {
      const index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      setActiveIndex(Math.max(0, Math.min(maxIndex, index)));
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return; // already horizontal
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 5;
      const atEnd = track.scrollLeft >= maxScroll - 5;
      if ((event.deltaY > 0 && atEnd) || (event.deltaY < 0 && atStart)) return; // release to the page
      event.preventDefault(); // requires a non-passive listener
      track.scrollLeft += event.deltaY;
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("wheel", onWheel);
    };
  }, [trackId, maxIndex]);

  const scrollToIndex = (index: number) => {
    const track = document.getElementById(trackId);
    track?.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-1">
      {titles.map((title, idx) => (
        <button
          key={title}
          type="button"
          onClick={() => scrollToIndex(idx)}
          aria-label={`Show slide ${idx + 1}: ${title}`}
          aria-controls={trackId}
          aria-current={activeIndex === idx ? "true" : undefined}
          className="group flex h-6 min-w-6 items-center justify-center"
        >
          <span
            className={`block h-1.5 rounded-full transition-all ${
              activeIndex === idx ? "w-7 bg-brand" : "w-2 bg-white/40 group-hover:bg-white/70"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
