import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EditPost, ReviewButtons } from "@/components/planner/forms";
import { MediaPreview } from "@/components/planner/media";
import { kindName, StatusBadge, statusLine } from "@/components/planner/status";
import { findPost, isEditable, NEXT_STEPS, requireOwner } from "@/lib/planner";
import { dateKey, formatAudienceTime, formatDayMonth, formatFullDate, formatTime, toLocalInput, weekStart } from "@/lib/planner-time";

export default function PlannerPostPage({ params }: PageProps<"/planner/[id]">) {
  return (
    <Suspense fallback={<div aria-busy className="h-96 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />}>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({ params }: Pick<PageProps<"/planner/[id]">, "params">) {
  const planner = await requireOwner();
  const { id } = await params;
  const post = await findPost(planner, id);
  if (!post) notFound();

  const now = new Date();
  const at = new Date(post.scheduled_at);
  const week = weekStart(at);
  const kind = kindName(post.kind, post.media_urls.length);

  return (
    <div className="space-y-6">
      <Link href={`/planner?week=${dateKey(week)}`} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
        Back to the week of {formatDayMonth(week)}
      </Link>

      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="mx-auto w-full max-w-[420px] lg:mx-0">
          <MediaPreview kind={post.kind} urls={post.media_urls} cover={post.cover_url} />
        </div>

        <div className="min-w-0 space-y-7">
          <div>
            <h2 className="font-serif text-2xl leading-snug sm:text-[1.75rem]">
              {kind} on {formatFullDate(at)} at {formatTime(at)}
            </h2>
            <p className="mt-1 text-muted-foreground">{formatAudienceTime(at)} for the US audience.</p>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-card p-4">
            <StatusBadge status={post.status} />
            <p className="max-w-[38em] text-[0.95rem] leading-relaxed">{statusLine(post, now)}</p>
            {post.permalink && (
              <a href={post.permalink} target="_blank" rel="noreferrer" className="inline-block text-sm font-semibold text-primary underline underline-offset-4">
                Open it on Instagram
              </a>
            )}
            <ReviewButtons id={post.id} status={post.status} steps={NEXT_STEPS[post.status]} />
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm">
            {post.promotes && (
              <>
                <dt className="text-muted-foreground">Leads to</dt>
                <dd>{post.promotes}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Affiliate</dt>
            <dd>{post.is_affiliate ? "Yes, marked #ad" : "No"}</dd>
            <dt className="text-muted-foreground">AI label</dt>
            <dd>{post.is_ai_generated ? "Instagram shows “AI info”" : "No"}</dd>
          </dl>

          {isEditable(post.status) ? (
            <EditPost id={post.id} kind={post.kind} caption={post.caption} when={toLocalInput(post.scheduled_at)} />
          ) : (
            <div>
              <h3 className="text-sm font-semibold">Caption</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed whitespace-pre-line">{post.caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
