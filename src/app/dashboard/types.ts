export interface PortfolioItem {
  title: string;
  link: string;
}

export interface Proposal {
    _id: string;
    proposalId: string;
    jobId: string;
    freelancerId: string;
    message: string;
    proposedAmount: number;
    estimatedDays: number;
    status: 'pending' | 'accepted' | 'completed';
    createdAt: string;
}

export interface FreelancerData {
  userId: string;
  name: string;
  role: string;
  image: string | null;
  projects_done: number;
  bio: string;
  skills: string[];
  portfolio: PortfolioItem[];
  experienceLevel: string;
  jobsInProgress: string[];
  jobsProposed: string[];
  jobsFinished: string[];
}
