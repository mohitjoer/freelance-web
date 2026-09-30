# AGENTS.md

## Commands

Package manager is **Bun** (`bun.lock` is source of truth; CI uses `bun install --frozen-lockfile`).

```bash
bun run dev     # starts BOTH processes via concurrently:
                #   - Socket.IO server: server/server.ts (port 4000)
                #   - Next.js dev server (port 3000)
bun run build   # next build
bun run lint    # eslint .
```

There are no tests. Verification is: `bun run build` then `bun run lint` (CI order, both must pass).

## Environment

`.env.local` (required, app throws at import time without them):
- `MONGO_DB` — main database (users, jobs, proposals, reviews, reports)
- `MONGO_DB_CHAT` — separate chat database (rooms)
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`

Client-side socket URL uses `NEXT_PUBLIC_SOCKET_URL` (falls back to `http://localhost:4000`).

## Architecture

- Next.js App Router + React 19, TypeScript strict. Path alias `@/*` → `./src/*`.
- Two separate Mongo *databases*: `src/mongo/db.ts` (main) vs `src/chatmongo/chatdb.ts` (chat).
  Don't mix models across them. NOTE: both files currently use the default `mongoose` singleton
  rather than `mongoose.createConnection`, and both gate on `readyState >= 1` — whichever
  connects first wins and the other returns early. This is a known latent bug, not intended
  behaviour. Fix with `createConnection` before trusting DB isolation.
- Auth is **Better Auth** with the MongoDB adapter (`src/lib/auth.ts`, catch-all route `src/app/api/auth/[...all]/route.ts`). Use `getUserId()` from `src/lib/session.ts` for session checks in API routes/server components. Ignore stale Clerk references in `.github/workflows/build_check.yml` and docker-compose — auth was migrated to Better Auth.
- Real-time chat is a standalone Express-less Node http + Socket.IO server in `server/server.ts` (port 4000), not part of the Next.js process. Client connects in `src/app/room/[roomId]/page.tsx`.
- UI: shadcn/ui components live in `src/components/ui`; Tailwind v4.
- `WhiteSur-gtk-theme/` is a vendored third-party repo — never modify or include it in changes.

## Gotchas

- **Tailwind v4 ignores `tailwind.config.ts` unless `globals.css` has `@config "../../tailwind.config.ts"`.**
  That directive is load-bearing: without it the whole token set (`--ink`, `--canvas`, `--hairline`,
  `--primary`, `--surface-soft`, `--cat-*`) never generates a utility, so `text-ink` / `bg-canvas` /
  `border-hairline` silently no-op and the entire UI renders flat and unstyled. If colours ever
  "stop working" repo-wide, check that line first.
- Colour tokens defined as `hsl(var(--x))` (no `<alpha-value>`) still support `/opacity` modifiers —
  Tailwind emits a `color-mix(in oklab, ...)` fallback. Opacity works, but it is not the fast path.
- `@apply` inside `@layer utilities` cannot reference config-only utilities (e.g.
  `@apply border-hairline` throws `Cannot apply unknown utility class`). Use raw CSS in that case.
- `next.config.ts` whitelists remote image hosts (cloudinary, picsum). Add new image hosts there or `next/image` fails.
- The `chrome extension/` folder is a separate MV3 extension, not part of the Next.js build.
- Landing-page imagery is deliberately product-led (no stock photos). The old `picsum.photos`
  covers in `homecategories` / `homejobs` were removed — do not reintroduce them.
- Category tiles link via `/jobs/open?category=<Term>` (substring match, so "design" also matches
  "Web Design"), not `?search=`. The full filter set is `?search= &category= &min= &max=
  &budgetType= &sort= &page=`.
- **Never duplicate the open-jobs query.** `src/lib/jobs.ts#queryOpenJobs` is the single
  implementation; both the `/jobs/open` server component and `GET /api/jobs/open` call it.
  Filtering happens in Mongo, not in the component — `OpenJobsContent` is a thin URL-driven view.
- `budget` is split across three fields: `budget` (number), `budgetType` (`'fixed' | 'hourly'`,
  defaults to `'fixed'` so pre-existing rows need no migration) and optional `budgetMax`. Always
  render with `formatBudget()` from `src/lib/budget.ts`, never `$${job.budget}`.
- Budget filters compare against `budgetCeiling` (the top of an hourly range), so a `$25-40/hr`
  job matches a "up to $40" filter.
- `run bun scripts/check-budget.ts` after touching `src/lib/budget.ts` — it is the only
  self-check in the repo.

## Known tech debt (react-doctor score 100/100 as of react-doctor 0.9.12)

All items from the original list have been addressed:

- `src/app/jobs/[jobId]/JobDetails.tsx` → extracted ProposalFormSection + JobSidebar + JobHeader + JobResources + types.ts
- `src/app/dashboard/page.tsx` → single role-aware dashboard route (freelancer + client). The former
  `/dashboard/freelancer`, `/dashboard/client` and `/select` routes were removed; role is resolved
  server-side from the `UserData` doc and the matching dashboard is rendered inline.
- `src/components/freelancer comp/workingjob.tsx` → extracted MarkCompletePopover + ProposalCard
- `src/components/jobs id comp/viewproposal.tsx` → extracted ProposalCard
- `src/app/onboarding/page.tsx` → extracted FreelancerSection + ClientSection forms
- `src/app/jobs/edit/[jobId]/EditJobForm.tsx` → extracted LinkListEditor (deduplicated add-link blocks)
- Sequential awaits parallelized in jobs/[jobId]/page.tsx and jobs/edit/[jobId]/page.tsx (Promise.all)
- Locale formatters hoisted to module scope in OpenJobsContent.tsx + room/[roomId]/MessageList.tsx
- doctor.config.json ignores server/server.ts + chrome extension via `ignore.overrides` (correct schema:
  `{"ignore":{"overrides":[{"files":[...],"rules":["deslop/unused-file"]}]}}`; the previous per-rule
  file-list shape was invalid and silently ignored)

Remaining known issues:
- `no-nested-card-surface` (11) — cards inside cards on dashboard/job/room pages. Needs real
  hierarchy decisions per screen, not a mechanical pass.
- `duplicate-jsx-subtree` (12) + `no-high-complexity-react-function` (3) — de-duplicate
  `jobfinshed.tsx` / `completedjob.tsx` and split `ClientDashboard`, `viewproposal` `ProposalCard`.
- `no-uniform-feature-card-grid` (3), `no-excessive-card-surfaces` (2), `no-flat-page-type-scale`,
  `no-cramped-container-padding` (3) — subjective layout preferences.
