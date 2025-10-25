import { Schema, model, models, Document } from "mongoose";

interface IReview {
  reviewerId: string;
  comment: string;
  rating: number;
  date: Date;
}

interface IPortfolio {
  title: string;
  link: string;
  description?: string;
}

interface IUserData extends Document {
  userId: string;
  userImage: string;
  firstName: string;
  lastName?: string;
  role: "freelancer" | "client";
  bio?: string;

  // Freelancer fields
  skills?: string[];
  category?: string; // ADD THIS - for filtering (e.g., "Development", "Design", "Writing")
  location?: string; // ADD THIS - for location filtering
  availability?: "available" | "busy" | "unavailable"; // ADD THIS - for availability filter
  hourlyRate?: number; // ADD THIS - for displaying hourly rate
  projects_done?: number;
  experienceLevel?: "beginner" | "intermediate" | "expert";
  portfolio?: IPortfolio[];

  // Client fields
  companyName?: string;
  companyWebsite?: string;

  // Shared activity fields
  jobsPosted?: string[];
  jobsInProgress?: string[];
  jobsFinished?: string[];
  jobsProposed?: string[];

  ratings?: number;
  reviews?: IReview[];

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserData>(
  {
    userId: { type: String, required: true, unique: true },
    userImage: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },

    role: {
      type: String,
      enum: ["freelancer", "client"],
      required: true,
    },

    bio: { type: String, maxlength: 500 },

    // Freelancer-only
    skills: [String],
    category: { type: String }, // NEW - for category filtering
    location: { type: String }, // NEW - for location filtering
    availability: {
      // NEW - for availability filtering
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    hourlyRate: { type: Number }, // NEW - for displaying rate
    projects_done: { type: Number, default: 0 },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
    },
    portfolio: [
      {
        title: String,
        link: String,
        description: String,
      },
    ],

    // Client-only
    companyName: { type: String },
    companyWebsite: { type: String },
    jobsPosted: [{ type: String }],

    // For both
    jobsInProgress: [{ type: String }],
    jobsFinished: [{ type: String }],

    // Freelancer-only
    jobsProposed: [{ type: String }],

    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ type: String, unique: true }],
  },
  {
    timestamps: true,
  }
);

// Add indexes for better search performance
userSchema.index({ role: 1, ratings: -1 });
userSchema.index({ skills: 1 });
userSchema.index({ location: 1 });
userSchema.index({ category: 1 });
userSchema.index({ availability: 1 });

const UserData = models.UserData || model<IUserData>("UserData", userSchema);

export default UserData;