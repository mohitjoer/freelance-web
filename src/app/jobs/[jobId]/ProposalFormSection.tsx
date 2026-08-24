'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertTitle } from "@/components/ui/alert";
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for This Job</h3>
      <p className="text-gray-600 text-sm mb-4">
        Submit your proposal to show interest in this project.
      </p>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {existingProposal ? 'Edit Proposal' : 'Make a Proposal'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            {existingProposal ? 'Edit your Proposal' : 'Submit your Proposal'}
          </h3>

          {successMessage && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertTitle className="text-green-800">{successMessage}</AlertTitle>
            </Alert>
          )}
          {failureMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>{failureMessage}</AlertTitle>
            </Alert>
          )}

          <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                defaultValue={existingProposal?.message || ''}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Explain why you're the best fit for this job..."
              />
            </div>

            <div>
              <label htmlFor="proposedAmount" className="block text-sm font-medium mb-1">
                Proposed Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="proposedAmount"
                name="proposedAmount"
                type="number"
                min="1"
                step="0.01"
                required
                defaultValue={existingProposal?.proposedAmount || ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your proposed amount"
              />
            </div>

            <div>
              <label htmlFor="estimatedDays" className="block text-sm font-medium mb-1">
                Estimated Days to Complete <span className="text-red-500">*</span>
              </label>
              <input
                id="estimatedDays"
                name="estimatedDays"
                type="number"
                min="1"
                required
                defaultValue={existingProposal?.estimatedDays || ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter estimated days"
              />
            </div>

            <div className='flex flex-row items-center justify-center gap-2 w-full'>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : (existingProposal ? 'Update Proposal' : 'Submit Proposal')}
              </Button>
              {existingProposal && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-red-600 border-red-500 hover:bg-red-50"
                  onClick={onDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </div>
          </form>

          <p className="text-xs text-gray-500 mt-3">
            You can only submit one proposal per job. You can edit or delete it anytime.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
