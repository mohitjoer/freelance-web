import { Schema, model, models, Document } from 'mongoose';

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
  role: 'freelancer' | 'client'; 
  bio?: string;

  // Freelancer fields
  skills?: string[];
  projects_done?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  portfolio?: IPortfolio[];

  // Client fields
  companyName?: string;
  companyWebsite?: string;

  // Shared activity fields
  jobsPosted?: string[]; // Only used by client
  jobsOngoing?: string[];
  jobsFinished?: string[];
  jobsTaken?: string[];  // Only used by freelancer
  jobsProposed?: string[]; // Only used by freelancer

  ratings?: number;
  reviews?: IReview[];

  wishlist?: { spotId: string }[];

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserData>(
  {
    userId: { type: String, required: true, unique: true }, // Clerk ID
    userImage: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },

    role: {
      type: String,
      enum: ['freelancer', 'client'],
      required: true,
    },

    bio: { type: String, maxlength: 500 },

    // Freelancer-only
    skills: [String],
    projects_done: { type: Number },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert'],
    },
    portfolio: [
      {
        title: String,
        link: String,
      },
    ],

    // Client-only
    companyName: { type: String },
    companyWebsite: { type: String },
    jobsPosted: [{ type: String }],
    jobsOngoing: [{ type: String }],
    jobsFinished: [{ type: String }],

    // freelancer-only
    jobsTaken: [{ type: String }],
    jobsProposed: [{ type: String }],

    ratings: { type: Number, default: 0 },

    reviews: [{ type: String , unique: true}],
  },
  {
    timestamps: true, 
  }
);

const UserData = models.UserData || model<IUserData>('UserData', userSchema);

export default UserData;
