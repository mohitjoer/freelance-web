'use client';

import { useState } from 'react';
import { Flag } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ReportUserPopoverProps {
  reporterId?: string;
  reportedId: string;
  jobId: string;
  /** Whom the report is about, shown in the header */
  reportedLabel: 'freelancer' | 'client';
}

export default function ReportUserPopover({ reporterId, reportedId, jobId, reportedLabel }: ReportUserPopoverProps) {
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  const who = reportedLabel === 'freelancer' ? 'freelancer' : 'client';

  const handleReport = async () => {
    if (sending || !details.trim()) return;
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch('/api/user/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterId,
          reportedId,
          reason: details,
          details,
          jobId,
        }),
      });

      if (res.ok) {
        setStatus({ ok: true, text: 'Report sent to our team.' });
        setDetails('');
      } else {
        const body = await res.json().catch(() => null);
        setStatus({ ok: false, text: body?.message || 'Could not send the report.' });
      }
    } catch (error) {
      console.error('Report submission error:', error);
      setStatus({ ok: false, text: 'Server error. The report was not sent.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <Flag className="size-4" aria-hidden />
          <span className="sr-only">Report this {who}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <div className="space-y-4 p-5">
          <div>
            <h3 className="font-semibold text-ink">Report this {who}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Our team reviews every report. False reports may restrict the account.
            </p>
          </div>

          {status && (
            <p className={`text-sm ${status.ok ? 'text-ink' : 'text-destructive'}`} role="status">
              {status.text}
            </p>
          )}

          <Textarea
            aria-label={`Reason for reporting this ${who}`}
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="What happened?"
          />

          <Button
            onClick={handleReport}
            size="sm"
            className="w-full"
            disabled={!details.trim() || sending}
          >
            {sending ? 'Sending…' : 'Send report'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
