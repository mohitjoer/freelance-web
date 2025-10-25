export interface Freelancer {
  _id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  category: string;
  rating: number;
  location: string;
  availability: "available" | "busy" | "unavailable";
  completedJobs: number;
  bio?: string;
  profileImage?: string;
  hourlyRate?: number;
}

export interface SearchFilters {
  query: string;
  skills: string[];
  category: string;
  minRating: number;
  location: string;
  availability: "" | "available" | "busy" | "unavailable";
}

export interface FilterOptions {
  skills: string[];
  categories: string[];
  locations: string[];
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
