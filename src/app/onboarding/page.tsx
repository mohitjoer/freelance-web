'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Trash2 } from 'lucide-react';
import { useUser } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/input';
import { Page, PageHeader } from '@/components/PageShell';
import { hostOf } from '@/lib/format';

interface PortfolioItem {
  title: string;
  link: string;
}

const ROLES = [
  {
    id: 'freelancer',
    label: "I'm looking for work",
    blurb: 'Pitch on briefs, get hired, build a track record.',
    detail: 'You will add skills, experience level and portfolio work.',
  },
  {
    id: 'client',
    label: "I'm looking to hire",
    blurb: 'Post briefs, review proposals, hire freelancers.',
    detail: 'You will add company details freelancers can check.',
  },
] as const;

type Role = (typeof ROLES)[number]['id'];

const LEVELS = [
  { value: 'beginner', label: 'Beginner', hint: '0–2 years' },
  { value: 'intermediate', label: 'Intermediate', hint: '2–5 years' },
  { value: 'expert', label: 'Expert', hint: '5+ years' },
];

type Errors = Partial<Record<'firstName' | 'lastName' | 'bio' | 'skills' | 'companyWebsite', string>>;

export default function OnboardingPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<Role | ''>('');
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    skills: '',
    experienceLevel: 'intermediate',
    companyName: '',
    companyWebsite: '',
  });
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [draft, setDraft] = useState({ title: '', link: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const bioRef = useRef<HTMLTextAreaElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  // `useUser` resolves asynchronously, so the name captured at sign-up only
  // arrives after the first render. Seed it once, then leave the fields alone
  // so a half-typed name is never overwritten.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || !user) return;
    seeded.current = true;
    setForm((f) => ({
      ...f,
      firstName: f.firstName || user.firstName || '',
      lastName: f.lastName || user.lastName || '',
    }));
  }, [user]);

  const set = <K extends keyof typeof form>(key: K, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key as keyof Errors] ? { ...e, [key]: undefined } : e));
  };

  function validateStep1(): Errors {
    const next: Errors = {};
    if (!form.firstName.trim()) next.firstName = 'Required.';
    if (!form.lastName.trim()) next.lastName = 'Required.';
    if (!form.bio.trim()) next.bio = 'Say what you do — one concrete sentence is enough.';
    else if (form.bio.trim().length < 20) next.bio = 'A little more detail, please.';
    return next;
  }

  function validateStep2(): Errors {
    if (role !== 'freelancer') return {};
    const next: Errors = {};
    if (!parseSkills(form.skills).length) next.skills = 'Add at least one skill.';
    if (form.companyWebsite && !isUrl(form.companyWebsite)) {
      next.companyWebsite = 'Include the https:// prefix.';
    }
    return next;
  }

  function goToStep2() {
    const found = validateStep1();
    setErrors(found);
    if (Object.keys(found).length) return;
    setStep(2);
    requestAnimationFrame(() => bioRef.current?.focus());
  }

  const skills = parseSkills(form.skills);

  const submit = async () => {
    if (saving || !user || !role) return;

    const found = { ...validateStep1(), ...validateStep2() };
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) {
      // Whatever is missing may be on the other step; send them there.
      if (Object.keys(validateStep1()).length) setStep(1);
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userImage: user.imageUrl,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          role,
          bio: form.bio.trim(),
          skills: role === 'freelancer' ? skills : undefined,
          experienceLevel: role === 'freelancer' ? form.experienceLevel : undefined,
          portfolio: role === 'freelancer' ? portfolio : undefined,
          companyName: role === 'client' ? form.companyName.trim() : undefined,
          companyWebsite: role === 'client' ? form.companyWebsite.trim() : undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      // Re-registering is not an error — the goal is a working profile.
      if (data.success && data.message === 'Already registered') {
        router.replace('/dashboard');
        return;
      }
      if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed');

      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      setFormError(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong and nothing was saved. Try again.',
      );
      setSaving(false);
    }
  };

  if (!isLoaded) return <Page width="max-w-2xl"><PageHeader title="Set up your profile" /></Page>;

  if (!isSignedIn) {
    return (
      <Page width="max-w-2xl">
        <PageHeader
          title="Sign in to continue"
          body="Your profile is tied to your account, so we need you signed in first."
        />
        <Button asChild>
          <Link href="/sign-in?redirect=/onboarding">Sign in</Link>
        </Button>
      </Page>
    );
  }

  return (
    <Page width="max-w-2xl" back={{ href: '/', label: 'home' }}>
      <PageHeader
        title="Set up your profile"
        body="This is the first thing the other side of the marketplace sees."
      />

      {/* Step 1 picks the role; step 2 collects the fields. Both steps validate
          independently so nobody loses what they typed on a round trip. */}
      <ol className="mb-8 flex items-center gap-2 text-xs" aria-label="Progress">
        {(['Role', 'Details'] as const).map((label, i) => {
          const n = (i + 1) as 1 | 2;
          const done = n < step;
          const current = n === step;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[11px] font-medium ${
                  done || current ? 'bg-primary text-primary-foreground' : 'bg-surface-soft text-muted-foreground'
                }`}
                aria-hidden
              >
                {done ? <Check className="size-3" /> : n}
              </span>
              <span className={current ? 'font-medium text-ink' : 'text-muted-foreground'}>
                {label}
              </span>
              {i === 0 && <span className="h-px w-6 bg-hairline" aria-hidden />}
            </li>
          );
        })}
      </ol>

      {!role ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRole(r.id);
                setStep(2);
              }}
              className="group rounded-xl border border-hairline bg-card p-5 text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              <span className="block text-sm font-medium text-ink">{r.label}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{r.blurb}</span>
              <span className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                Continue <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <form
          className="space-y-8"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <button
            type="button"
            onClick={() => {
              setRole('');
              setStep(1);
            }}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-ink"
          >
            Change role
          </button>

          {step === 1 ? (
            <>
              <div className="grid gap-4 border-y border-hairline py-6 sm:grid-cols-2">
                <Field label="First name" htmlFor="firstName" error={errors.firstName}>
                  <Input
                    id="firstName"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    aria-invalid={!!errors.firstName}
                    required
                  />
                </Field>
                <Field label="Last name" htmlFor="lastName" error={errors.lastName}>
                  <Input
                    id="lastName"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    aria-invalid={!!errors.lastName}
                    required
                  />
                </Field>
              </div>

              <Field
                label="Bio"
                htmlFor="bio"
                error={errors.bio}
                hint={`${form.bio.trim().length}/500 — what you do, and what you want next.`}
              >
                <Textarea
                  id="bio"
                  ref={bioRef}
                  rows={5}
                  maxLength={500}
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  aria-invalid={!!errors.bio}
                  placeholder="Freelance product designer. Five years in fintech, now taking two design-system projects at a time."
                  required
                />
              </Field>

              <Button type="button" onClick={goToStep2}>
                Continue
              </Button>
            </>
          ) : (
            <>
              {role === 'freelancer' ? (
                <fieldset className="space-y-6 border-y border-hairline py-6">
                  <legend className="mb-4 text-sm font-semibold tracking-tight text-ink">Your work</legend>

                  <Field
                    label="Skills"
                    htmlFor="skills"
                    error={errors.skills}
                    hint="Comma separated. These are how clients find you."
                  >
                    <Input
                      id="skills"
                      ref={skillInputRef}
                      value={form.skills}
                      onChange={(e) => set('skills', e.target.value)}
                      aria-invalid={!!errors.skills}
                      placeholder="React, TypeScript, Design systems"
                      required
                    />
                  </Field>

                  {skills.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Parsed skills">
                      {skills.map((s) => (
                        <li
                          key={s}
                          className="rounded-md bg-surface-soft px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Field
                    label="Experience level"
                    htmlFor="experienceLevel"
                    hint={LEVELS.find((l) => l.value === form.experienceLevel)?.hint}
                  >
                    <Select
                      id="experienceLevel"
                      value={form.experienceLevel}
                      onChange={(e) => set('experienceLevel', e.target.value)}
                    >
                      {LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label} ({l.hint})
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <PortfolioEditor
                    items={portfolio}
                    draft={draft}
                    setDraft={setDraft}
                    onAdd={() => {
                      if (!draft.title.trim() || !draft.link.trim()) return;
                      setPortfolio((p) => [...p, { title: draft.title.trim(), link: draft.link.trim() }]);
                      setDraft({ title: '', link: '' });
                      skillInputRef.current?.focus();
                    }}
                    onRemove={(i) => setPortfolio((p) => p.filter((_, n) => n !== i))}
                  />
                </fieldset>
              ) : (
                <fieldset className="space-y-6 border-y border-hairline py-6">
                  <legend className="mb-4 text-sm font-semibold tracking-tight text-ink">Your company</legend>

                  <Field
                    label="Company name"
                    htmlFor="companyName"
                    hint="Optional. Freelancers use this to judge whether the brief is real."
                  >
                    <Input
                      id="companyName"
                      autoComplete="organization"
                      value={form.companyName}
                      onChange={(e) => set('companyName', e.target.value)}
                      placeholder="Acme Inc."
                    />
                  </Field>

                  <Field label="Company website" htmlFor="companyWebsite" error={errors.companyWebsite}>
                    <Input
                      id="companyWebsite"
                      type="url"
                      inputMode="url"
                      autoComplete="url"
                      value={form.companyWebsite}
                      onChange={(e) => set('companyWebsite', e.target.value)}
                      aria-invalid={!!errors.companyWebsite}
                      placeholder="https://acme.com"
                    />
                  </Field>
                </fieldset>
              )}

              {formError && (
                <p className="text-sm text-destructive" role="alert">
                  {formError}
                </p>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Creating your profile…' : 'Finish and go to dashboard'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  By continuing you accept the{' '}
                  <Link href="/terms" className="underline underline-offset-4 hover:text-ink">
                    terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </>
          )}
        </form>
      )}
    </Page>
  );
}

function PortfolioEditor({
  items,
  draft,
  setDraft,
  onAdd,
  onRemove,
}: {
  items: PortfolioItem[];
  draft: { title: string; link: string };
  setDraft: (d: { title: string; link: string }) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-ink">Portfolio</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Optional, but a profile with work on it gets replies.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <Input
          aria-label="Project title"
          placeholder="Project title"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            onAdd();
          }}
        />
        <Input
          aria-label="Project link"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={draft.link}
          onChange={(e) => setDraft({ ...draft, link: e.target.value })}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            onAdd();
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={!draft.title.trim() || !draft.link.trim()}
          onClick={onAdd}
        >
          Add
        </Button>
      </div>

      {items.length > 0 ? (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {items.map((item, i) => (
            <li key={`${item.title}-${item.link}`} className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0">
                <span className="block truncate text-sm text-ink">{item.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{hostOf(item.link)}</span>
              </span>
              <button
                type="button"
                aria-label={`Remove ${item.title}`}
                onClick={() => onRemove(i)}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing added yet.</p>
      )}
    </div>
  );
}

function parseSkills(raw: string): string[] {
  return [...new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))];
}

/** Accepts only absolute http(s) URLs — a bare "acme.com" is not a link. */
function isUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}