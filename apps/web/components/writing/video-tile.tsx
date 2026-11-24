"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A vertical video in its own 9:16 frame. It shows the poster with a play
 * mark until pressed, then loads the video and plays it in place with the
 * browser's own controls, so nothing downloads for visitors who only read.
 */
export function VideoTile({
  src,
  poster,
  title,
}: {
  src: string;
  poster: string | null;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-[9/16] overflow-hidden rounded-[3px] bg-foreground cover-shadow">
        <video src={src} poster={poster ?? undefined} controls autoPlay playsInline preload="metadata" className="size-full object-contain" aria-label={title} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[3px] bg-foreground text-left cover-shadow"
    >
      {poster && (
        <Image
          src={poster}
          alt=""
          width={720}
          height={1280}
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/70 text-on-sky transition-colors group-hover:bg-primary"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>
    </button>
  );
}
