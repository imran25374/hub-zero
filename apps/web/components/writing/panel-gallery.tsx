"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The square panels of a carousel post, one at a time: swipe or scroll on a
 * phone, the arrows anywhere, with a "3 / 9" counter. Nothing moves on its
 * own; a reader turns the panels like pages.
 */
export function PanelGallery({ panels, title }: { panels: string[]; title: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const count = panels.length;

  const goTo = (next: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.min(Math.max(next, 0), count - 1);
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  if (count === 0) return null;

  return (
    <div>
      <ul
        ref={track}
        aria-label={`Panels of ${title}`}
        className="flex aspect-square snap-x snap-mandatory overflow-x-auto rounded-[3px] cover-shadow [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {panels.map((panel, i) => (
          <li key={panel} className="size-full shrink-0 snap-start" aria-hidden={i !== index ? true : undefined}>
            <Image
              src={panel}
              alt={`${title}, panel ${i + 1} of ${count}`}
              width={1080}
              height={1080}
              sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 90vw"
              loading={i === 0 ? undefined : "lazy"}
              className="size-full object-cover"
            />
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <p aria-live="polite">
          {index + 1} / {count}
        </p>
        <div className="flex gap-2">
          <GalleryButton label="Previous panel" disabled={index === 0} onClick={() => goTo(index - 1)}>
            <path d="M15 6l-6 6 6 6" />
          </GalleryButton>
          <GalleryButton label="Next panel" disabled={index === count - 1} onClick={() => goTo(index + 1)}>
            <path d="M9 6l6 6-6 6" />
          </GalleryButton>
        </div>
      </div>
    </div>
  );
}

function GalleryButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}
