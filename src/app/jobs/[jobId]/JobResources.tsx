'use client';

import LinkIcon from '@mui/icons-material/Link';
import type { Job } from './types';

interface JobResourcesProps {
  references?: string[];
  resources?: string[];
}

export default function JobResources({ references, resources }: JobResourcesProps) {
  const hasReferences = Array.isArray(references) && references.length > 0;
  const hasResources = Array.isArray(resources) && resources.length > 0;

  if (!hasReferences && !hasResources) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <LinkIcon className="text-blue-600" />
        Additional Resources
      </h3>

      {hasReferences && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Reference Links</h4>
          <div className="space-y-2">
            {references!.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <LinkIcon className="text-blue-600 flex-shrink-0" style={{ fontSize: 16 }} />
                <span className="text-blue-600 hover:text-blue-800 text-sm break-all group-hover:underline">
                  {url}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {hasResources && (
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Resource Links</h4>
          <div className="space-y-2">
            {resources!.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <LinkIcon className="text-green-600 flex-shrink-0" style={{ fontSize: 16 }} />
                <span className="text-green-600 hover:text-green-800 text-sm break-all group-hover:underline">
                  {url}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
