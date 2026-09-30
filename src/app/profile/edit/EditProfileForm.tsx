'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/input';
import { Page, PageHeader, SidePanel } from '@/components/PageShell';

interface PortfolioItem {
  title: string;
  link: string;
}

interface ProfileForm {
  bio: string;
  firstName: string;
  lastName: string;
  skills: string;
  portfolio: PortfolioItem[];
  experienceLevel: string;
  companyName: string;
  companyWebsite: string;
}

interface EditProfileFormProps {
  initialRole: 'client' | 'freelancer';
  initialForm: ProfileForm;
}

const LEVELS = ['beginner', 'intermediate', 'expert'];

export default function EditProfileForm({ initialRole, initialForm }: EditProfileFormProps) {
  const router = useRouter();

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleUpdate = async () => {
    if (saving) return;
    setSaving(true);
    setStatus(null);

    const payload: Record<string, unknown> = {
      bio: form.bio,
      firstName: form.firstName,
      lastName: form.lastName,
    };

    if (role === "freelancer") {
      payload.skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
      payload.portfolio = form.portfolio;
      payload.experienceLevel = form.experienceLevel;
    } else {
      payload.companyName = form.companyName;
      payload.companyWebsite = form.companyWebsite;
    }

    try {
      const res = await fetch("/api/user/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success) {
        setStatus({ ok: true, text: "Profile updated." });
        router.push('/dashboard');
      } else {
        setStatus({ ok: false, text: result.message || "Could not save the profile." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ ok: false, text: "Server error. Your changes were not saved." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page aside={<SidePanel active="/profile/edit" />} back={{ href: "/setting", label: "Settings" }}>
      <PageHeader
        title="Edit profile"
        body="This is what the other side of the marketplace sees when they open your profile."
      />

      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
      >
        <div className="grid gap-4 border-y border-hairline py-6 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName">
            <Input id="firstName" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <Input id="lastName" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
          </Field>
        </div>

        <Field label="Bio" htmlFor="bio" hint="Up to 500 characters. A couple of concrete sentences, not a cover letter.">
          <Textarea id="bio" rows={5} value={form.bio} onChange={(e) => set('bio', e.target.value)} />
        </Field>

        {role === "freelancer" ? (
          <fieldset className="space-y-6 border-y border-hairline py-6">
            <legend className="mb-4 text-sm font-semibold tracking-tight text-ink">Freelance work</legend>

            <Field label="Skills" htmlFor="skills" hint="Comma separated.">
              <Input
                id="skills"
                value={form.skills}
                onChange={(e) => set('skills', e.target.value)}
                placeholder="React, TypeScript, Design systems"
              />
            </Field>

            <Field label="Experience level" htmlFor="experienceLevel">
              <Input
                id="experienceLevel"
                list="experience-levels"
                value={form.experienceLevel}
                onChange={(e) => set('experienceLevel', e.target.value)}
                placeholder="intermediate"
              />
              <datalist id="experience-levels">
                {LEVELS.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </Field>
          </fieldset>
        ) : (
          <fieldset className="space-y-6 border-y border-hairline py-6">
            <legend className="mb-4 text-sm font-semibold tracking-tight text-ink">Company</legend>

            <Field label="Company name" htmlFor="companyName">
              <Input
                id="companyName"
                value={form.companyName}
                onChange={(e) => set('companyName', e.target.value)}
              />
            </Field>

            <Field label="Company website" htmlFor="companyWebsite">
              <Input
                id="companyWebsite"
                type="url"
                value={form.companyWebsite}
                onChange={(e) => set('companyWebsite', e.target.value)}
                placeholder="https://"
              />
            </Field>
          </fieldset>
        )}

        {status && (
          <p className={`text-sm ${status.ok ? 'text-ink' : 'text-destructive'}`} role="status">
            {status.text}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/dashboard')}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={() => setRole(role === 'freelancer' ? 'client' : 'freelancer')}
            className="ml-auto text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Switch to {role === 'freelancer' ? 'client' : 'freelancer'} view
          </button>
        </div>
      </form>
    </Page>
  );
}
