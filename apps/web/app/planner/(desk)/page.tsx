import Link from "next/link";
import { Suspense } from "react";

import { ApproveWeek, quietButton } from "@/components/planner/forms";
import { PostCard } from "@/components/planner/post-card";
import { postsBetween, requireOwner, upcomingDraftCount, type PlannerPost } from "@/lib/planner";
import { addDays, dateKey, formatDayMonth, formatWeekday, parseWeek, sameDay, weekDays, weekStart } from "@/lib/planner-time";

export default function PlannerWeekPage({ searchParams }: PageProps<"/planner">) {
  return (
    <Suspense fallback={<WeekSkeleton />}>
      <Week searchParams={searchParams} />
    </Suspense>
  );
}

async function Week({ searchParams }: Pick<PageProps<"/planner">, "searchParams">) {
  const planner = await requireOwner();
  const { week } = await searchParams;
  const now = new Date();
  const start = parseWeek(week, now);
  const end = addDays(start, 7);
  const days = weekDays(start);

  if (!planner.hubId) {
    return (
      <div className="max-w-[36em] space-y-3">
        <h2 className="font-serif text-2xl">Signed in, but not linked to Hub Zero yet</h2>
        <p className="text-muted-foreground">
          {planner.email ?? "This sign-in"} works, but it doesn&apos;t own a hub yet. Run the owner-link query in Supabase, then reload this page.
        </p>
      </div>
    );
  }

  const [posts, waiting] = await Promise.all([postsBetween(planner, start, end), upcomingDraftCount(planner, now)]);
  const drafts = posts.filter((p) => p.status === "draft").length;
  const isThisWeek = sameDay(start, weekStart(now));
  const byDay = new Map<string, PlannerPost[]>();
  for (const post of posts) {
    const key = dateKey(new Date(post.scheduled_at));
    byDay.set(key, [...(byDay.get(key) ?? []), post]);
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-[1.75rem]">
            {formatDayMonth(start)} to {formatDayMonth(addDays(start, 6))}
          </h2>
          <p className="mt-1 text-muted-foreground">
            {posts.length === 0
              ? "Nothing planned this week."
              : `${posts.length} ${posts.length === 1 ? "post" : "posts"} this week${drafts ? `, ${drafts} waiting for your approval` : ""}.`}
            {waiting > drafts && ` ${waiting - drafts} more ${waiting - drafts === 1 ? "draft is" : "drafts are"} waiting in other weeks.`}
          </p>
        </div>
        <nav aria-label="Weeks" className="flex flex-wrap gap-2">
          <Link href={`/planner?week=${dateKey(addDays(start, -7))}`} className={quietButton}>
            Previous week
          </Link>
          {!isThisWeek && (
            <Link href="/planner" className={quietButton}>
              This week
            </Link>
          )}
          <Link href={`/planner?week=${dateKey(end)}`} className={quietButton}>
            Next week
          </Link>
        </nav>
      </div>

      {drafts > 0 && (
        <div className="rounded-lg border border-[#c08a2b]/35 bg-[#fbf3e3] px-4 py-3">
          <ApproveWeek from={start.toISOString()} to={end.toISOString()} drafts={drafts} />
        </div>
      )}

      <ol className="grid gap-x-3 gap-y-6 lg:grid-cols-7">
        {days.map((day) => {
          const list = byDay.get(dateKey(day)) ?? [];
          const today = sameDay(day, now);
          return (
            <li key={dateKey(day)} className="min-w-0" aria-label={`${formatWeekday(day)} ${formatDayMonth(day)}`}>
              <h3 className={`flex items-baseline gap-2 border-b pb-1.5 ${today ? "border-primary" : "border-border"}`}>
                <span className={`font-serif text-base font-bold ${today ? "text-primary" : ""}`}>{formatWeekday(day)}</span>
                <span className="text-sm text-muted-foreground">{formatDayMonth(day)}</span>
                {today && <span className="ml-auto text-xs font-semibold text-primary">Today</span>}
              </h3>
              {list.length === 0 ? (
                <p className="pt-3 text-sm text-muted-foreground/80">Nothing planned</p>
              ) : (
                <ul className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-3 lg:grid-cols-1">
                  {list.map((post) => (
                    <li key={post.id}>
                      <PostCard post={post} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function WeekSkeleton() {
  return (
    <div aria-busy className="space-y-7">
      <div className="h-9 w-64 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <div className="grid gap-3 lg:grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}
