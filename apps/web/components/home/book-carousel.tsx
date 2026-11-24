"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Slide = { id: string; title: string; image_url: string | null };

/**
 * The covers on the home page: a strip that scrolls one cover at a time,
 * advancing on its own every few seconds. It stops while the pointer or focus
 * is on it, when the tab is hidden, and for anyone who prefers reduced motion;
 * the arrows and a swipe work regardless. Every cover links to the books page.
 */
export function BookCarousel({ slides, href }: { slides: Slide[]; href: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = (next: number) => {
    const el = track.current;
    if (!el || count === 0) return;
    const target = ((next % count) + count) % count;
    const child = el.children[target] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  // Keep the index in step with manual scrolling (swipe, scrollbar).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const left = el.scrollLeft + el.offsetLeft;
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      children.forEach((child, i) => {
        const distance = Math.abs(child.offsetLeft - left);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Advance on a timer unless something asks it to stop.
  useEffect(() => {
    if (count < 2 || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      goTo(index + 1);
    }, 4500);
    return () => window.clearInterval(timer);
    // goTo reads refs only; index is the dependency that matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, count]);

  if (count === 0) return null;

  return (
    <div
      className="relative min-w-0"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <ul
        ref={track}
        aria-label="Book covers"
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <li
            key={slide.id}
            className="w-[62vw] max-w-[260px] shrink-0 snap-start sm:w-[220px] lg:w-[250px]"
            aria-hidden={i !== index ? true : undefined}
          >
            <Link href={href} className="block" tabIndex={i === index ? 0 : -1}>
              {slide.image_url && (
                <Image
                  src={slide.image_url}
                  alt={`Cover of ${slide.title}`}
                  width={960}
                  height={1707}
                  sizes="(min-width: 1024px) 250px, (min-width: 640px) 220px, 62vw"
                  className="cover-shadow h-auto w-full"
                />
              )}
              <span className="sr-only">{slide.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {slides[index]?.title}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous book"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next book"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
