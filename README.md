# Hub Zero

Imran Syed Naqvi's landing page at imransyednaqvi.com, and the first LinkHub page.
Everything built here carries forward into the LinkHub product in Stage 4.

Status: Stage 2 scaffold. The site shows a placeholder until mid-December 2026.

## Stack

| Part | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Monorepo | pnpm workspaces, Turborepo |
| Data, auth, storage | Supabase (project `linkhub-prod`, Mumbai) |
| Analytics | PostHog |
| Hosting | Vercel |

## Layout

```
apps/
  web/            Next.js app: the public site (imransyednaqvi.com)
packages/
  ui/             @workspace/ui: shadcn/ui components, Tailwind theme, cn() helper
  lib/            @workspace/lib: environment config; Supabase client and analytics helpers go here
```

Content lives in Supabase tables, not in code, so it can change without a redeploy.
Those tables become the LinkHub data model.

## Getting started

Requirements: Node.js 20.9 or later (22 LTS recommended) and pnpm.
Enable pnpm once with `corepack enable`, or install it with `npm install -g pnpm`.

```bash
pnpm install
cp .env.example apps/web/.env.local   # then fill in the values
pnpm dev                              # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run the site locally |
| `pnpm build` | Production build of every package |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript checks across the workspace |

## Environment variables

Names are listed in `.env.example`. Local values go in `apps/web/.env.local`, which git ignores.
Production values go in the Vercel project settings. Never commit real keys.

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: safe in the browser.
- `SUPABASE_SECRET_KEY`: server only. It bypasses row-level security. Used by the `/go` redirect to record clicks.
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`: safe in the browser.

## Database

The schema lives in `supabase/migrations/`, one timestamped SQL file per change.
Never edit a migration that has been applied; add a new one.
Until the Supabase CLI is linked, apply a migration by pasting it into
Supabase dashboard > SQL Editor and running it. Once the CLI is linked, record those
as already applied so it does not run them twice:
`pnpm dlx supabase migration repair --status applied <timestamp>`.

| Table | Holds | Public API (publishable key) |
| --- | --- | --- |
| `hubs` | One identity: hero card fields | Read published rows |
| `sections` | Venture tiles and their pages | Read published rows of published hubs |
| `links` | Links inside a section | Read published rows in visible sections |
| `profile_entries` | A professional record: header lines, achievements, expertise, experience (nested via `parent_id`), education, training, awards, exposure, publications, thesis, projects, interests, languages, documents | Read published rows in visible sections |
| `analytics_events` | One row per link click | None |

The home page is a long scroll. `sections.home_display` sets how each section appears there:
`inline` (in full: Hero Split shows `excerpt` and a `cta_label`/`cta_href` link, Magazine Grid its
cards, a section with a form its sign-up box), `tile`, or `hidden`. A Hero Split section with
profile entries is a profile page: headline from `description`, summary from `body`, then the entries
in a fixed order. Entry bodies are plain text: blank lines for paragraphs, `- ` for bullets, `### ` for sub-headings.
`sections.nav_label` is the menu name when the title is long.

Content is written with the secret key (dashboard now, admin page in Stage 3).
Content loads live in `supabase/content/`; they are one-off data scripts, not migrations.
Images are in the public Storage bucket `hub-media`; the originals stay out of git in `/content/`.
Public PDFs (a CV, a thesis) go in the bucket `hub-documents` (PDF only, 25 MB).

### Click tracking

Every outbound link points at `/go/<link id>`. The route redirects at once and then records
the click with `record_click()` (secret key, server only). The database counts at most 10
clicks a minute per visitor; visitors are identified only by a keyed hash of IP address,
browser and date, kept for an hour. Crawlers are redirected but not counted.
Vercel preview deployments redirect without recording, so reviews don't touch the analytics.
The database itself rejects affiliate links not marked `#ad` or `(paid link)`, `javascript:` URLs,
Amazon links in profile entries (they belong in `links`), and layouts outside the five launch archetypes.

The typed client is in `packages/lib`:

```ts
import { createPublicClient } from "@workspace/lib/supabase/client";

const supabase = createPublicClient();
const { data: hub } = await supabase
  .from("hubs")
  .select("display_name, sections(slug, title, links(title, url))")
  .eq("username", "imran")
  .single();
```

Types in `packages/lib/src/supabase/database.types.ts` must match the migrations.

## Adding shadcn/ui components

Run from the repo root. Components land in `packages/ui/src/components` and are imported
as `@workspace/ui/components/<name>`.

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

## Deploying

Vercel project settings: Root Directory `apps/web`, framework Next.js, install and build
commands left on auto-detect. Vercel Pro is required from launch day, because the site carries
affiliate revenue and Hobby is for non-commercial use only.

## Compliance rules for this site

- Footer on every page: "As an Amazon Associate I earn from qualifying purchases."
- Every affiliate link is marked `#ad` or `(paid link)`.
- Amazon Associates links appear only on this site and in social posts, never in emails, e-books or PDFs.
