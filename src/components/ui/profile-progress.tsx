'use client';

import { calculateProfileCompletion } from '@/lib/utils';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileProgressProps {
  user: {
    bio?: string;
    skills?: string[];
    portfolio?: any[];
    experienceLevel?: string;
    companyName?: string;
    companyWebsite?: string;
  };
  showSuggestions?: boolean;
}

export default function ProfileProgress({ user, showSuggestions = true }: ProfileProgressProps) {
  const { percentage, missingFields } = calculateProfileCompletion(user);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressText = (percentage: number) => {
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 50) return 'Almost there!';
    return 'Let\'s complete your profile!';
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Profile Completion</h3>
        <span className="text-sm text-gray-600">{percentage}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
        {getProgressText(percentage)}
      </p>

      {showSuggestions && missingFields.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suggestions to complete:
          </p>
          <ul className="space-y-1">
            {missingFields.map((field, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                Add your {field.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {percentage === 100 && (
        <div className="flex items-center text-sm text-green-600 mt-3">
          <CheckCircle className="w-4 h-4 mr-2" />
          Profile is complete!
        </div>
      )}
    </div>
  );
}
