import type { FormProvider } from "@workspace/lib/supabase/database.types";

/**
 * Where an embedded form appears (sections.form_provider / form_id). The Kit
 * form replaces this placeholder once its form id is set in the database.
 */
export function FormSlot({ provider, formId }: { provider: FormProvider; formId: string | null }) {
  return (
    <div
      data-form-provider={provider}
      data-form-id={formId ?? undefined}
      className="rounded-[3px] border border-border bg-card px-8 py-10"
    >
      <p className="font-serif text-2xl">Sign-up opens here shortly.</p>
    </div>
  );
}
