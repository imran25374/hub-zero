# Notes for Claude Code

- Package manager is pnpm (workspaces). Run commands from the repo root; use `pnpm --filter web <cmd>` for the app only.
- Next.js 16: read `apps/web/AGENTS.md` and the docs in `node_modules/next/dist/docs/` before writing Next.js code.
- Shared UI goes in `packages/ui` (`@workspace/ui`), shared non-UI code in `packages/lib` (`@workspace/lib`).
- Page content belongs in Supabase tables, not hard-coded in components.
- Never commit secrets. Only `.env.example` is tracked.
- Before committing: `pnpm lint && pnpm typecheck && pnpm build` must pass.
- Affiliate rules in README.md are non-negotiable on every page that shows affiliate links.
- Database changes: add a new timestamped file in `supabase/migrations/`; never edit an applied one. Update `packages/lib/src/supabase/database.types.ts` to match.
- Every table gets explicit grants and RLS policies in its migration. New Supabase projects grant nothing by default.
