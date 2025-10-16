import { Schema, model, models, Document } from 'mongoose';

interface IReview extends Document {
  reviewerId: string;     // UserData.userId (who is giving the review)
  revieweeId: string;     // UserData.userId (who is being reviewed)
  jobId: string;          // Job._id
  rating: number;         // 1 to 5
  comment: string;        // Feedback text
  revieweeRole: 'freelancer' | 'client'; // Role of the reviewee
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewerId: { type: String, required: true },
    revieweeId: { type: String, required: true },
    jobId: { type: String, required: true },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    revieweeRole: {
      type: String,
      enum: ['freelancer', 'client'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Unique index to prevent duplicate reviews for the same job and parties
reviewSchema.index({ jobId: 1, reviewerId: 1, revieweeId: 1 }, { unique: true });

const Review = models.Review || model<IReview>('Review', reviewSchema);
export default Review;
