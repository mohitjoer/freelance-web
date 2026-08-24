'use client';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';

interface MarkCompletePopoverProps {
  jobId: string;
  markingComplete: boolean;
  onConfirm: (jobId: string) => void;
}

export default function MarkCompletePopover({ jobId, markingComplete, onConfirm }: MarkCompletePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
          disabled={markingComplete}
        >
          {markingComplete ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              Marking Complete...
            </>
          ) : (
            <>
              <CheckCircleOutlineIcon className="mr-2 h-4 w-4" />
              Mark Complete
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Mark Project Complete</h4>
          <p className="text-sm text-gray-600">
            Are you sure you want to mark this project as completed? This will notify the client for final approval.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onConfirm(jobId)}
              disabled={markingComplete}
            >
              Yes, Complete Project
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
