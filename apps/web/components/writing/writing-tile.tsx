import Image from "next/image";
import Link from "next/link";

import { mediaOf, type ProfileEntry } from "@/lib/hub";

const KIND_LABEL = { video: "Video essay", gallery: "Carousel", image: "Article" } as const;

/**
 * A piece of writing as a small tile on the home page: its picture at its
 * own shape (a wide article banner, a tall video frame, a square panel), the
 * kind of piece, and the title. Leads to the piece on the writing page.
 */
export function WritingTile({ entry, href }: { entry: ProfileEntry; href: string }) {
  const media = mediaOf(entry);
  const width = media === "video" ? 720 : media === "gallery" ? 1080 : (entry.image_width ?? 1200);
  const height = media === "video" ? 1280 : media === "gallery" ? 1080 : (entry.image_height ?? 627);
  return (
    <Link href={href} className="group flex flex-col gap-3 no-underline">
      {entry.image_url && (
        <Image
          src={entry.image_url}
          alt=""
          width={width}
          height={height}
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
          className="cover-shadow h-auto w-full rounded-[3px]"
        />
      )}
      <p className="mt-1 text-xs font-semibold tracking-[0.1em] text-primary uppercase">{KIND_LABEL[media]}</p>
      <h3 className="font-serif text-[1.1875rem] leading-snug text-foreground transition-colors group-hover:text-primary">
        {entry.title}
      </h3>
    </Link>
  );
}
