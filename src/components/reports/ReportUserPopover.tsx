'use client';

import { useState } from 'react';
import ReportIcon from '@mui/icons-material/Report';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertTitle } from '@/components/ui/alert';

interface ReportUserPopoverProps {
  reporterId?: string;
  reportedId: string;
  jobId: string;
  /** Whom the report is about, shown in the header */
  reportedLabel: 'freelancer' | 'client';
}

export default function ReportUserPopover({ reporterId, reportedId, jobId, reportedLabel }: ReportUserPopoverProps) {
  const [reportDetails, setReportDetails] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleReport = async () => {
    if (!reportDetails.trim()) {
      alert('Please provide a reason for reporting.');
      return;
    }

    try {
      const res = await fetch('/api/user/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterId,
          reportedId,
          reason: reportDetails,
          details: reportDetails,
          jobId,
        }),
      });

      if (res.ok) {
        setSuccessMessage('Report submitted successfully!');
        setReportDetails('');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to submit report.');
      }
    } catch (error) {
      console.error('Report submission error:', error);
      alert('Server error occurred while submitting report.');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-colors"
        >
          <ReportIcon className="w-4 h-4 mr-2" />
          Report {reportedLabel === 'freelancer' ? 'User' : 'Client'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-white">
        <div className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Report {reportedLabel === 'freelancer' ? 'Freelancer' : 'Client'}
          </h4>

          {successMessage && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertTitle className="text-green-800">{successMessage}</AlertTitle>
            </Alert>
          )}

          <div className="mb-4">
            <label htmlFor="reportReason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for reporting *
            </label>
            <textarea
              id="reportReason"
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder={`Provide the reason and context for reporting this ${reportedLabel}...`}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleReport}
              className="bg-red-600 hover:bg-red-700 text-white flex-1"
              size="sm"
              disabled={!reportDetails.trim()}
            >
              Submit Report
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Reports are reviewed by our team and this job will be marked as Cancelled. False reports may result in account restrictions.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
