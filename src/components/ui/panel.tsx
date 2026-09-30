'use client';

import type { ReactNode } from "react";

/** The one surface treatment: white card, hairline border, 12px radius. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-hairline bg-card ${className}`}>{children}</section>
  );
}

export function PanelHeader({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
        {children}
      </div>
      {action}
    </div>
  );
}

/**
 * Stats as data, not decoration: a hairline-divided row of figures. No icon
 * tiles, no per-stat colours — colour carries meaning nowhere in this row.
 *
 * Columns follow the count, so a 3-stat row does not leave a dangling divider
 * and an empty cell in a 4-up grid.
 */
export function StatRow({ stats }: { stats: { label: string; value: string | number }[] }) {
  const cols =
    stats.length <= 2 ? "sm:grid-cols-2" : stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4";
  return (
    <dl className={`grid grid-cols-2 divide-hairline sm:divide-x ${cols}`}>
      {stats.map((s) => (
        <div key={s.label} className="px-5 py-4">
          <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {s.label}
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-ink">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly { id: T; label: string; count?: number }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div
      role="tablist"
      className="-mb-px flex gap-6 overflow-x-auto border-b border-hairline px-5"
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`-mb-px shrink-0 border-b-2 pb-3 pt-1 text-sm transition-colors ${
            value === t.id
              ? "border-primary font-medium text-ink"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="ml-1.5 tabular-nums text-muted-foreground">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="px-5 py-16 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
