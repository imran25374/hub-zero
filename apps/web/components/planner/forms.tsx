"use client";

import { useActionState, useState } from "react";

import type { SocialPostKind, SocialPostStatus } from "@workspace/lib/supabase/database.types";

import { approveWeek, reviewPost, savePost, signIn, type ActionState } from "@/app/planner/actions";

const button =
  "inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60";
export const primaryButton = `${button} bg-primary text-primary-foreground hover:bg-horizon-glow`;
export const quietButton = `${button} border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary`;

function Result({ state }: { state: ActionState }) {
  return (
    <p aria-live="polite" className={`min-h-5 text-sm ${state.error ? "font-semibold text-[#9b3424]" : "text-muted-foreground"}`}>
      {state.error ?? state.done ?? ""}
    </p>
  );
}

const STEP_LABEL: Record<SocialPostStatus, Partial<Record<SocialPostStatus, string>>> = {
  draft: { approved: "Approve", cancelled: "Cancel post" },
  approved: { draft: "Back to draft", cancelled: "Cancel post" },
  failed: { approved: "Retry", cancelled: "Cancel post" },
  cancelled: { draft: "Restore as draft" },
  publishing: {},
  published: {},
};

/** The review buttons for one post: one form, the clicked button says where it goes. */
export function ReviewButtons({ id, status, steps }: { id: string; status: SocialPostStatus; steps: SocialPostStatus[] }) {
  const [state, action, pending] = useActionState(reviewPost, {});
  if (steps.length === 0) return null;
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="id" value={id} />
      <div className="flex flex-wrap gap-2">
        {steps.map((to) => (
          <button
            key={to}
            type="submit"
            name="to"
            value={to}
            disabled={pending}
            className={to === "approved" || status === "cancelled" ? primaryButton : quietButton}
          >
            {STEP_LABEL[status][to]}
          </button>
        ))}
      </div>
      <Result state={state} />
    </form>
  );
}

/** Caption and time, editable until Instagram has the post. */
export function EditPost({ id, kind, caption, when }: { id: string; kind: SocialPostKind; caption: string; when: string }) {
  const [state, action, pending] = useActionState(savePost, {});
  const [length, setLength] = useState(caption.length);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor="caption" className="block text-sm font-semibold">
          Caption
        </label>
        {kind === "story" && <p className="mt-0.5 text-sm text-muted-foreground">Instagram doesn&apos;t show captions on stories; this one is for your records.</p>}
        <textarea
          id="caption"
          name="caption"
          defaultValue={caption}
          rows={kind === "story" ? 3 : 10}
          maxLength={2200}
          onChange={(e) => setLength(e.currentTarget.value.length)}
          className="mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2 text-[0.95rem] leading-relaxed"
        />
        <p className={`text-right text-xs tabular-nums ${length > 2100 ? "text-[#9b3424]" : "text-muted-foreground"}`}>{length.toLocaleString("en-GB")} of 2,200</p>
      </div>
      <div>
        <label htmlFor="when" className="block text-sm font-semibold">
          Goes out at (Pakistan time)
        </label>
        <input id="when" name="when" type="datetime-local" defaultValue={when} required className="mt-1.5 rounded-md border border-input bg-card px-3 py-2 tabular-nums" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={quietButton}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        <Result state={state} />
      </div>
    </form>
  );
}

export function ApproveWeek({ from, to, drafts }: { from: string; to: string; drafts: number }) {
  const [state, action, pending] = useActionState(approveWeek, {});
  return (
    <form action={action} className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="to" value={to} />
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "Approving…" : drafts === 1 ? "Approve the draft" : `Approve all ${drafts} drafts`}
      </button>
      <Result state={state} />
    </form>
  );
}

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2" />
      </div>
      <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <Result state={state} />
    </form>
  );
}
