import Link from "next/link";

import type { PlannerPost } from "@/lib/planner";
import { formatAudienceTime, formatTime } from "@/lib/planner-time";

import { Thumb } from "./media";
import { kindName, StatusBadge } from "./status";

/** One post in the week view: picture, time here and in New York, status, the start of the caption. */
export function PostCard({ post }: { post: PlannerPost }) {
  const at = new Date(post.scheduled_at);
  const kind = kindName(post.kind, post.media_urls.length);
  const summary = post.kind === "story" ? (post.promotes ?? "Story") : post.caption;
  return (
    <Link
      href={`/planner/${post.id}`}
      className={`group block rounded-lg border border-border bg-card p-2 no-underline transition-colors hover:border-primary/50 ${
        post.status === "cancelled" ? "opacity-60" : ""
      }`}
    >
      <Thumb url={post.media_urls[0] ?? ""} cover={post.cover_url} alt={`${kind} at ${formatTime(at)}`} />
      <div className="mt-2 space-y-1 px-0.5">
        <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-semibold tabular-nums">{formatTime(at)}</span>
          <span className="text-xs text-muted-foreground">{formatAudienceTime(at)}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {kind}
          {post.is_affiliate && <span className="ml-1.5 rounded-sm bg-secondary px-1 py-px font-semibold text-foreground">#ad</span>}
        </p>
        <StatusBadge status={post.status} className="text-xs" />
        <p className="line-clamp-2 text-sm leading-snug text-foreground/85 group-hover:text-foreground">{summary}</p>
      </div>
    </Link>
  );
}
