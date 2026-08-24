# AGENTS.md

## Commands

Package manager is **Bun** (`bun.lock` is source of truth; CI uses `bun install --frozen-lockfile`).

```bash
bun run dev     # starts BOTH processes via concurrently:
                #   - Socket.IO server: server/server.ts (port 4000)
                #   - Next.js dev server (port 3000)
bun run build   # next build
bun run lint    # next lint
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
- Two separate Mongo connections: `src/mongo/db.ts` (main) vs `src/chatmongo/chatdb.ts` (chat). Don't mix models across them.
- Auth is **Better Auth** with the MongoDB adapter (`src/lib/auth.ts`, catch-all route `src/app/api/auth/[...all]/route.ts`). Use `getUserId()` from `src/lib/session.ts` for session checks in API routes/server components. Ignore stale Clerk references in `.github/workflows/build_check.yml` and docker-compose — auth was migrated to Better Auth.
- Real-time chat is a standalone Express-less Node http + Socket.IO server in `server/server.ts` (port 4000), not part of the Next.js process. Client connects in `src/app/room/[roomId]/page.tsx`.
- UI: shadcn/ui components live in `src/components/ui`; Tailwind v4.
- `WhiteSur-gtk-theme/` is a vendored third-party repo — never modify or include it in changes.

## Gotchas

- `next.config.ts` whitelists remote image hosts (cloudinary, picsum). Add new image hosts there or `next/image` fails.
- The `chrome extension/` folder is a separate MV3 extension, not part of the Next.js build.

## Known tech debt (react-doctor score 100/100 as of react-doctor 0.9.12)

All items from the original list have been addressed:

- `src/app/jobs/[jobId]/JobDetails.tsx` → extracted ProposalFormSection + JobSidebar + JobHeader + JobResources + types.ts
- `src/app/dashboard/freelancer/FreelancerDashboard.tsx` → extracted DashboardSidebar + StatsCards + types.ts
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
- `bun run lint` is broken: Next.js 16 removed `next lint`; the script needs migration to ESLint CLI.
  Direct `bunx eslint` also fails: eslint-config-next is incompatible with installed ESLint 10.
