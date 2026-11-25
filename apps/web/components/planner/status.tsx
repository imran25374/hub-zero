import type { SocialPostKind, SocialPostStatus } from "@workspace/lib/supabase/database.types";

import { formatFullDate, formatTime } from "@/lib/planner-time";

const STATUS: Record<SocialPostStatus, { label: string; dot: string }> = {
  draft: { label: "Draft", dot: "bg-[#c08a2b]" },
  approved: { label: "Approved", dot: "bg-primary" },
  publishing: { label: "Publishing", dot: "bg-[#7d9a9e] animate-pulse motion-reduce:animate-none" },
  published: { label: "Published", dot: "bg-[#3d6b47]" },
  failed: { label: "Didn't go out", dot: "bg-[#b4432f]" },
  cancelled: { label: "Cancelled", dot: "bg-[#9aa0a8]" },
};

export function StatusBadge({ status, className = "" }: { status: SocialPostStatus; className?: string }) {
  const { label, dot } = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${className}`}>
      <span aria-hidden className={`size-2 shrink-0 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

const KIND: Record<SocialPostKind, string> = {
  image: "Post",
  carousel: "Carousel",
  reel: "Reel",
  story: "Story",
};

export function kindName(kind: SocialPostKind, items = 1): string {
  return kind === "carousel" ? `Carousel, ${items} slides` : KIND[kind];
}

/** One sentence on what happens next, for the post page. */
export function statusLine(post: { status: SocialPostStatus; scheduled_at: string; published_at: string | null; error: string | null }, now: Date): string {
  const at = new Date(post.scheduled_at);
  const when = `${formatFullDate(at)} at ${formatTime(at)}`;
  const past = at.getTime() <= now.getTime();
  switch (post.status) {
    case "draft":
      return past
        ? "Waiting for your approval. Its time has passed, so approving sends it within 15 minutes; change the time first if you'd rather wait."
        : `Waiting for your approval. Nothing goes out until you approve it; then it goes out ${when}.`;
    case "approved":
      return past ? "Approved. It goes out within the next 15 minutes." : `Approved. It goes out automatically ${when}, within 15 minutes of that time.`;
    case "publishing":
      return "Instagram is processing it. Videos can take a few minutes.";
    case "published":
      return post.published_at
        ? `Went out ${formatFullDate(new Date(post.published_at))} at ${formatTime(new Date(post.published_at))}.`
        : "Went out.";
    case "failed":
      return `Instagram refused it${post.error ? `: ${post.error}` : "."} Fix it if needed, then retry.`;
    case "cancelled":
      return "Cancelled. It won't go out. Restore it as a draft to use it again.";
  }
}
