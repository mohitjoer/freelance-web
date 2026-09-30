'use client';

import { ExternalLink } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";

interface JobResourcesProps {
  references?: string[];
  resources?: string[];
}

function LinkList({ label, urls }: { label: string; urls: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
      <ul className="divide-y divide-hairline border-y border-hairline">
        {urls.map((url) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 py-2.5 text-sm text-primary transition-colors hover:underline"
            >
              <span className="truncate">{url}</span>
              <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function JobResources({ references, resources }: JobResourcesProps) {
  const refs = references ?? [];
  const res = resources ?? [];
  if (refs.length === 0 && res.length === 0) return null;

  return (
    <Panel>
      <PanelHeader title="References" />
      <div className="space-y-6 px-5 py-4">
        {refs.length > 0 && <LinkList label="Briefs" urls={refs} />}
        {res.length > 0 && <LinkList label="Links" urls={res} />}
      </div>
    </Panel>
  );
}
