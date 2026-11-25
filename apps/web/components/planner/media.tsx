import Image from "next/image";

import type { SocialPostKind } from "@workspace/lib/supabase/database.types";

const isVideo = (url: string) => /\.(mp4|mov|m4v)(\?|$)/i.test(url);

/** The shape Instagram shows: 9:16 for stories and reels, 4:5 for feed posts. */
export const aspectFor = (kind: SocialPostKind) => (kind === "story" || kind === "reel" ? "aspect-[9/16]" : "aspect-[4/5]");

/** A small preview for the week view: the first item (or the reel's cover), cropped to 4:5. */
export function Thumb({ url, cover, alt }: { url: string; cover: string | null; alt: string }) {
  const still = cover ?? (isVideo(url) ? null : url);
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
      {still ? (
        <Image src={still} alt={alt} fill unoptimized sizes="200px" className="object-cover" />
      ) : (
        <video src={url} muted playsInline preload="metadata" className="absolute inset-0 size-full object-cover" aria-label={alt} />
      )}
    </div>
  );
}

/** Every item at Instagram's shape; a carousel scrolls sideways. */
export function MediaPreview({ kind, urls, cover }: { kind: SocialPostKind; urls: string[]; cover: string | null }) {
  const aspect = aspectFor(kind);
  return (
    <div
      className={urls.length > 1 ? "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3" : ""}
      tabIndex={urls.length > 1 ? 0 : undefined}
      aria-label={urls.length > 1 ? `${urls.length} slides; scroll sideways to see them all` : undefined}
    >
      {urls.map((url, i) => (
        <figure
          key={url + i}
          className={`relative ${aspect} overflow-hidden rounded-lg bg-muted shadow-sm ${urls.length > 1 ? "w-[78%] shrink-0 snap-start" : "w-full"}`}
        >
          {isVideo(url) ? (
            <video src={url} poster={cover ?? undefined} controls playsInline preload="metadata" className="absolute inset-0 size-full object-cover" />
          ) : (
            <Image src={url} alt={urls.length > 1 ? `Slide ${i + 1}` : "The post's image"} fill unoptimized sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
          )}
          {urls.length > 1 && (
            <figcaption className="absolute top-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-semibold text-white">
              {i + 1} of {urls.length}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
