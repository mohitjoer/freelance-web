'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/input';
import { Page, PageHeader, SidePanel } from '@/components/PageShell';

export interface JobFormValues {
  title: string;
  description: string;
  category: string;
  budget: string;
  budgetType: 'fixed' | 'hourly';
  budgetMax: string;
  deadline: string;
  references: string[];
  resources: string[];
}

const EMPTY: JobFormValues = {
  title: '',
  description: '',
  category: '',
  budget: '',
  budgetType: 'fixed',
  budgetMax: '',
  deadline: '',
  references: [],
  resources: [],
};

const CATEGORIES = [
  'Development',
  'Design',
  'Writing',
  'Video',
  'Marketing',
  'Data & Analytics',
];

/** Both create and edit render this — one form, one place to change a rule. */
export default function JobForm({
  mode,
  jobId,
  initial,
}: {
  mode: 'create' | 'edit';
  jobId?: string;
  initial?: Partial<JobFormValues>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<JobFormValues>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    if (saving) return;
    if (!form.title || !form.description || !form.category || !form.budget || !form.deadline) {
      setError('Title, category, description, budget and deadline are all required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(mode === 'create' ? '/api/job/create' : `/api/job/edit/${jobId}`, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget: parseFloat(form.budget),
          budgetMax: form.budgetType === 'hourly' && form.budgetMax ? parseFloat(form.budgetMax) : null,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Request failed');

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error && err.message ? err.message : 'Server error.');
      setSaving(false);
    }
  };

  return (
    <Page aside={<SidePanel active="/jobs/create" />} back={{ href: '/dashboard', label: 'Dashboard' }}>
      <PageHeader
        title={mode === 'create' ? 'Post a job' : 'Edit job'}
        body="A stated budget and a real deadline get materially better proposals."
      />

      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="space-y-6 border-y border-hairline py-6">
          <Field label="Title" htmlFor="title">
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Landing page redesign in Figma"
              required
            />
          </Field>

          <Field label="Category" htmlFor="category">
            <Input
              id="category"
              list="job-categories"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              placeholder="Design"
              required
            />
            <datalist id="job-categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>

          <Field label="Description" htmlFor="description" hint="Scope, deliverables and what good looks like.">
            <Textarea
              id="description"
              rows={8}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </Field>
        </div>

        <fieldset className="space-y-4">
          <legend className="mb-4 text-sm font-semibold tracking-tight text-ink">Budget & deadline</legend>

          <div className="inline-flex rounded-lg border border-hairline bg-surface-soft p-1">
            {(['fixed', 'hourly'] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={form.budgetType === value}
                onClick={() => set('budgetType', value)}
                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  form.budgetType === value
                    ? 'bg-card text-ink shadow-xs'
                    : 'text-muted-foreground hover:text-ink'
                }`}
              >
                {value === 'fixed' ? 'Fixed price' : 'Hourly rate'}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={form.budgetType === 'hourly' ? 'Rate from (USD/hr)' : 'Budget (USD)'}
              htmlFor="budget"
            >
              <Input
                id="budget"
                type="number"
                min={0}
                inputMode="decimal"
                value={form.budget}
                onChange={(e) => set('budget', e.target.value)}
                placeholder={form.budgetType === 'hourly' ? '25' : '1000'}
                required
              />
            </Field>

            {form.budgetType === 'hourly' && (
              <Field label="Rate to (USD/hr)" htmlFor="budgetMax" hint="Leave blank for an open-ended rate.">
                <Input
                  id="budgetMax"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={form.budgetMax}
                  onChange={(e) => set('budgetMax', e.target.value)}
                  placeholder="40"
                />
              </Field>
            )}

            <Field label="Deadline" htmlFor="deadline">
              <Input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => set('deadline', e.target.value)}
                required
              />
            </Field>
          </div>
        </fieldset>

        <div className="grid gap-8 border-y border-hairline py-6 sm:grid-cols-2">
          <LinkListEditor
            title="Reference links"
            inputId="reference-link"
            items={form.references}
            onChange={(references) => set('references', references)}
          />
          <LinkListEditor
            title="Resource links"
            inputId="resource-link"
            items={form.resources}
            onChange={(resources) => set('resources', resources)}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : mode === 'create' ? 'Post job' : 'Save changes'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push('/dashboard')}>
            Cancel
          </Button>
        </div>
      </form>
    </Page>
  );
}

function LinkListEditor({
  title,
  inputId,
  items,
  onChange,
}: {
  title: string;
  inputId: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold tracking-tight text-ink">{title}</p>

      <div className="flex gap-2">
        <Input
          id={inputId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            if (draft.trim()) onChange([...items, draft.trim()]);
            setDraft('');
          }}
          placeholder="https://example.com"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!draft.trim()) return;
            onChange([...items, draft.trim()]);
            setDraft('');
          }}
        >
          Add
        </Button>
      </div>

      {items.length > 0 ? (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {items.map((item, i) => (
            <li key={item} className="flex items-center justify-between gap-3 py-2">
              <span className="truncate text-sm text-muted-foreground">{item}</span>
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onChange(items.filter((_, n) => n !== i))}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">None yet.</p>
      )}
    </div>
  );
}
