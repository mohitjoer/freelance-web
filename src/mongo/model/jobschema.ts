import { Schema, model, models, Document } from 'mongoose';

interface IJob extends Document {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: Date;

  clientId: string;             // UserData.userId (client)
  freelancerId?: string;        // UserData.userId (freelancer, assigned later)

  status: 'open' | 'in-progress' | 'completed' | 'cancelled';

  proposals: string[];          // Proposal._id references
  acceptedProposalId?: string;  // When client accepts one

  // Optional tracking fields
  startedAt?: Date;
  finishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },

    clientId: { type: String, required: true },
    freelancerId: { type: String }, // Populated once job is accepted

    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },

    proposals: [{ type: String }], // Array of proposal IDs
    acceptedProposalId: { type: String }, // ID of the accepted proposal

    startedAt: { type: Date },
    finishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Job = models.Job || model<IJob>('Job', jobSchema);

export default Job;
