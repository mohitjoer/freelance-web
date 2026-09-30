'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Job } from './types';

interface JobHeaderProps {
  job: Job;
  currentUserId: string;
}

export default function JobHeader({ job, currentUserId }: JobHeaderProps) {
  const isOpen = job.status === 'open';

  return (
    <header className="border-b border-hairline bg-card">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/jobs/open"
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-ink"
        >
          <span aria-hidden="true">&larr;</span>
          All jobs
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {job.title}
              </h1>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  isOpen ? "bg-primary/10 text-primary" : "bg-surface-soft text-muted-foreground"
                }`}
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              <span className="rounded-full bg-surface-soft px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {job.category}
              </span>
            </div>

            {job.clientId !== currentUserId && job.client && (
              <Link
                href={`/profile/${job.clientId}`}
                className="mt-3.5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ink"
              >
                <Image
                  src={job.client.image}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 rounded-full object-cover"
                />
                {job.client.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
