import Image from 'next/image';
import Link from 'next/link';
import { Star, ExternalLink, Briefcase } from 'lucide-react';
import { formatDay, formatMonthYear, hostOf } from '@/lib/format';
import { formatBudget } from '@/lib/budget';
import { Page, SidePanel } from '@/components/PageShell';
import { Panel, PanelHeader, StatRow } from '@/components/ui/panel';

export interface IPortfolio {
  title: string;
  link: string;
  description?: string;
}

export interface IUser {
  userId: string;
  userImage: string;
  firstName: string;
  lastName?: string;
  role: 'freelancer' | 'client';
  bio?: string;
  skills?: string[];
  projects_done?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  portfolio?: IPortfolio[];
  companyName?: string;
  companyWebsite?: string;
  jobsPosted?: string[];
  jobsInProgress?: string[];
  jobsFinished?: string[];
  jobsProposed?: string[];
  ratings?: number;
  reviews?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  jobId: string;
  title: string;
  category: string;
  status: string;
  budget?: number;
  budgetType?: 'fixed' | 'hourly';
  budgetMax?: number;
  finishedAt?: string;
  counterpartId?: string;
  counterpartName: string;
}

/**
 * Cover band. Deterministic from the user's id, so a profile keeps the same
 * cover across renders and devices, and no upload/storage path is needed.
 *
 * The tint is built from `--primary` and rotated with `hue-rotate` rather than
 * hardcoded hsl(), so it stays legible in both themes. Rotation is kept to a
 * narrow band on purpose: a wide sweep would leave the brand palette.
 */
function CoverBanner({ seed }: { seed: string }) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const rotation = [-24, -12, 0, 12, 24][hash % 5];

  return (
    <div className="relative h-28 overflow-hidden bg-surface-soft sm:h-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(120% 100% at 12% 0%, hsl(var(--primary) / 0.28), transparent 62%), radial-gradient(90% 90% at 88% 8%, hsl(var(--cat-data) / 0.22), transparent 58%)',
          filter: `hue-rotate(${rotation}deg)`,
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" />
      {/* Fades the cover into the panel below so the two read as one surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
      />
    </div>
  );
}

/**
 * Filled stars carry the rating; empty ones are hairlines. Amber is reserved
 * for this one meaning across the app, so a star never reads as decoration.
 */
function RatingStars({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden
            className={`size-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-hairline-strong'}`}
          />
        ))}
      </span>
      <span className="text-sm font-medium tabular-nums text-ink">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-sm text-muted-foreground">({count})</span>}
    </div>
  );
}

export default function ProfileView({ user, projects }: { user: IUser; projects: Project[] }) {

  const fullName = `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`;
  const isFreelancer = user.role === 'freelancer';
  const reviewCount = user.reviews?.length ?? 0;
  const hasRating = typeof user.ratings === 'number' && user.ratings > 0;

  const completedCount = projects.filter((p) => p.status === 'completed').length;

  // Both roles get a 3-stat row: the two "completed" counters on the freelancer
  // side measure the same thing, so only one is shown.
  const stats = isFreelancer
    ? [
        { label: 'Projects done', value: user.projects_done ?? 0 },
        { label: 'Proposals sent', value: user.jobsProposed?.length ?? 0 },
        { label: 'Active', value: user.jobsInProgress?.length ?? 0 },
      ]
    : [
        { label: 'Jobs posted', value: user.jobsPosted?.length ?? 0 },
        { label: 'Active', value: user.jobsInProgress?.length ?? 0 },
        { label: 'Finished', value: user.jobsFinished?.length ?? 0 },
      ];

  return (
    <Page aside={<SidePanel active="/dashboard" />} back={{ href: "/jobs/open", label: "open jobs" }}>
      {/* Cover, then the identity pulled up over it. The overlap is what makes
          this read as a profile rather than a report. */}
      <Panel className="mb-6 overflow-hidden">
        <CoverBanner seed={user.userId} />

        {/* `relative` is load-bearing. The cover's bottom fade is absolutely
            positioned, and a positioned box paints above in-flow content, so
            without this the white gradient covers the top of the avatar. */}
        <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5">
            <Image
              src={user.userImage || '/default-avatar.png'}
              alt={fullName}
              width={112}
              height={112}
              className="size-24 shrink-0 rounded-full border-4 border-card object-cover sm:size-28"
            />

            <div className="min-w-0 flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight text-ink">{fullName}</h1>
                <span className="rounded-full bg-surface-soft px-2.5 py-1 text-xs font-medium text-ink">
                  {isFreelancer ? 'Freelancer' : 'Client'}
                </span>
              </div>

              {/* Provenance: the facts a visitor uses to judge credibility. */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {hasRating && <RatingStars rating={user.ratings!} count={reviewCount} />}
                {isFreelancer && user.experienceLevel && (
                  <span className="capitalize">{user.experienceLevel}</span>
                )}
                {!isFreelancer && user.companyName && (
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="size-4" aria-hidden />
                    {user.companyName}
                    {user.companyWebsite && (
                      <Link
                        href={user.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${user.companyName} website`}
                        className="text-ink transition-colors hover:text-primary"
                      >
                        <ExternalLink className="size-3.5" aria-hidden />
                      </Link>
                    )}
                  </span>
                )}
                <span>Member since {formatMonthYear(user.createdAt)}</span>
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground measure">
              {user.bio}
            </p>
          )}
        </div>

        <StatRow stats={stats} />
      </Panel>

      <div className="space-y-6">
        {projects.length > 0 && (
          <Panel>
            <PanelHeader
              title="Projects"
              action={
                completedCount > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {completedCount} completed
                    {projects.length > completedCount &&
                      ` · ${projects.length - completedCount} active`}
                  </p>
                ) : undefined
              }
            />
            <ul className="divide-y divide-hairline">
              {projects.map((p) => (
                <li key={p.jobId}>
                  <Link
                    href={`/jobs/${p.jobId}`}
                    className="group flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-surface-soft"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-ink transition-colors group-hover:text-primary">
                        {p.title}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          p.status === 'completed'
                            ? 'bg-surface-soft text-muted-foreground'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {p.status === 'completed' ? 'Completed' : 'In progress'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="capitalize">{p.category}</span>
                      <span aria-hidden>·</span>
                      <span className="tabular-nums">{formatBudget(p)}</span>
                      {p.finishedAt && (
                        <>
                          <span aria-hidden>·</span>
                          <span>{formatDay(p.finishedAt)}</span>
                        </>
                      )}
                      {p.counterpartId && (
                        <>
                          <span aria-hidden>·</span>
                          <span>
                            {isFreelancer ? 'for' : 'with'}{' '}
                            <span className="text-ink">{p.counterpartName}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {isFreelancer && user.skills && user.skills.length > 0 && (
          <Panel>
            <PanelHeader title="Skills" />
            <ul className="flex flex-wrap gap-2 px-5 py-4">
              {user.skills.map((skill: string) => (
                <li
                  key={skill}
                  className="rounded-md bg-surface-soft px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {isFreelancer && user.portfolio && user.portfolio.length > 0 && (
          /* Deliberately not a <Panel>: the tiles carry their own hairline, and
             a bordered grid inside a panel both nests surfaces and leaks its
             background into any empty cell when the count is odd. */
          <section>
            <h2 className="mb-3 text-sm font-semibold tracking-tight text-ink">Portfolio</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {user.portfolio.map((item: IPortfolio) => (
                <li key={`${item.title}-${item.link}`}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-xl border border-hairline bg-card p-5 transition-colors hover:bg-surface-soft"
                  >
                    <span className="text-sm font-medium text-ink transition-colors group-hover:text-primary">
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs text-muted-foreground">
                      {hostOf(item.link)}
                      <ExternalLink
                        className="size-3.5 transition-colors group-hover:text-primary"
                        aria-hidden
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Panel>
          <PanelHeader title="Reputation" />
          <div className="px-5 py-4">
            {hasRating ? (
              <>
                <RatingStars rating={user.ratings!} count={reviewCount} />
                <p className="mt-2.5 text-sm text-muted-foreground">
                  {reviewCount > 0
                    ? 'Written reviews are not published on profiles yet.'
                    : 'Rated from completed projects. Written reviews are not published yet.'}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isFreelancer
                  ? 'Complete your first project to earn a rating.'
                  : 'Ratings from completed projects will appear here.'}
              </p>
            )}
          </div>
        </Panel>
      </div>
    </Page>
  );
}
