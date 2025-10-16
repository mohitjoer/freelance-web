import { Schema, model, models, Document } from 'mongoose';

interface IReview extends Document {
  reviewerId: string;     // UserData.userId (client)
  freelancerId: string;   // UserData.userId (freelancer)
  jobId: string;          // Job._id
  rating: number;         // 1 to 5
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewerId: { type: String, required: true },   // Must be client
    freelancerId: { type: String, required: true }, // Reviewed freelancer
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);


reviewSchema.index({ jobId: 1, freelancerId: 1 }, { unique: true });

const Review = models.Review || model<IReview>('Review', reviewSchema);
export default Review;
