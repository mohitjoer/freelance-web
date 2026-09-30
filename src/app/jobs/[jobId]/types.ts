import { formatDay } from "@/lib/format";

export interface Job {
  _id: string;
  jobId: string;
  clientId: string;
  title: string;
  status: string;
  description: string;
  category: string;
  budget: number;
  budgetType?: 'fixed' | 'hourly';
  budgetMax?: number | null;
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

export const formatDate = formatDay;
