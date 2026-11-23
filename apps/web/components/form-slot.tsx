import type { FormProvider } from "@workspace/lib/supabase/database.types";

/**
 * Where an embedded form appears (sections.form_provider / form_id). The Kit
 * form replaces this placeholder once its form id is set in the database.
 * `framed` draws its own box; inside the home page's sign-up box it is false.
 */
export function FormSlot({
  provider,
  formId,
  framed = true,
}: {
  provider: FormProvider;
  formId: string | null;
  framed?: boolean;
}) {
  return (
    <div
      data-form-provider={provider}
      data-form-id={formId ?? undefined}
      className={framed ? "rounded-[3px] border border-border bg-card px-8 py-10" : undefined}
    >
      <p className="font-serif text-2xl">Sign-up opens here shortly.</p>
    </div>
  );
}
