export interface Job {
  _id: string;
  jobId: string;
  clientId: string;
  title: string;
  status: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  createdAt: string;
  references?: string[];
  resources?: string[];
  client?: {
    name: string;
    image: string;
  };
}

export interface Proposal {
  proposalId: string;
  message: string;
  proposedAmount: number;
  estimatedDays: number;
}

// Module-scope formatter with fixed locale + timezone so SSR and client render identically
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

export const formatDate = (date: string | Date) => dateFormatter.format(new Date(date));
