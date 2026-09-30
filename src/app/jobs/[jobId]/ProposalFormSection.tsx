'use client';

import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/input';
import { Panel, PanelHeader } from '@/components/ui/panel';
import type { Proposal } from './types';

interface ProposalFormSectionProps {
  existingProposal: Proposal | null;
  isSubmitting: boolean;
  successMessage: string;
  failureMessage: string;
  formRef: React.RefObject<HTMLFormElement | null>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}

export default function ProposalFormSection({
  existingProposal,
  isSubmitting,
  successMessage,
  failureMessage,
  formRef,
  onSubmit,
  onDelete,
}: ProposalFormSectionProps) {
  return (
    <Panel>
      <PanelHeader title={existingProposal ? "Your proposal" : "Apply"} />
      <p className="px-5 pt-4 text-sm text-muted-foreground">
        One proposal per job. You can edit or withdraw it at any time.
      </p>

      <form ref={formRef} onSubmit={onSubmit} className="space-y-4 px-5 py-4">
        {successMessage && (
          <p className="text-sm text-foreground" role="status">
            {successMessage}
          </p>
        )}
        {failureMessage && (
          <p className="text-sm text-destructive" role="alert">
            {failureMessage}
          </p>
        )}

        <Field label="Why you" htmlFor="message" hint="A few concrete sentences beat a cover letter.">
          <Textarea
            id="message"
            name="message"
            rows={5}
            required
            defaultValue={existingProposal?.message || ''}
            placeholder="What you've shipped that makes you the right fit for this brief."
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Your rate" htmlFor="proposedAmount">
            <Input
              id="proposedAmount"
              name="proposedAmount"
              type="number"
              min="1"
              step="0.01"
              inputMode="decimal"
              required
              defaultValue={existingProposal?.proposedAmount || ''}
              placeholder="0"
            />
          </Field>

          <Field label="Days" htmlFor="estimatedDays">
            <Input
              id="estimatedDays"
              name="estimatedDays"
              type="number"
              min="1"
              inputMode="numeric"
              required
              defaultValue={existingProposal?.estimatedDays || ''}
              placeholder="14"
            />
          </Field>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Sending…" : existingProposal ? "Update proposal" : "Send proposal"}
          </Button>
          {existingProposal && (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting…" : "Withdraw"}
            </Button>
          )}
        </div>
      </form>
    </Panel>
  );
}
