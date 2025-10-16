import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ProfileFields {
  bio?: string;
  skills?: string[];
  portfolio?: any[];
  experienceLevel?: string;
  companyName?: string;
  companyWebsite?: string;
}

export function calculateProfileCompletion(user: ProfileFields): { percentage: number; missingFields: string[] } {
  const fields = [
    { key: 'bio', label: 'Bio' },
    { key: 'skills', label: 'Skills' },
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'experienceLevel', label: 'Experience Level' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'companyWebsite', label: 'Company Website' },
  ];

  const filledFields = fields.filter(field => {
    const value = user[field.key as keyof ProfileFields];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value && value.toString().trim() !== '';
  });

  const percentage = Math.round((filledFields.length / fields.length) * 100);
  const missingFields = fields.filter(field => !filledFields.includes(field)).map(f => f.label);

  return { percentage, missingFields };
}
