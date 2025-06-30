import { Schema, model, models, Document } from 'mongoose';

interface IProposal extends Document {
  jobId: string;              // Job._id
  freelancerId: string;       // UserData.userId
  clientId: string;           // UserData.userId (from Job)
  message: string;
  proposedAmount: number;
  estimatedDays: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const proposalSchema = new Schema<IProposal>(
  {
    jobId: { type: String, required: true },
    freelancerId: { type: String, required: true },
    clientId: { type: String, required: true },

    message: { type: String, required: true },
    proposedAmount: { type: Number, required: true },
    estimatedDays: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Proposal = models.Proposal || model<IProposal>('Proposal', proposalSchema);
export default Proposal;
