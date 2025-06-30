import { Schema, model, models, Document } from 'mongoose';

interface IMilestone {
  title: string;
  amount: number;
  isPaid: boolean;
}

interface IContract extends Document {
  jobId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;

  agreedAmount: number;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled';

  milestones?: IMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

const contractSchema = new Schema<IContract>(
  {
    jobId: { type: String, required: true },
    proposalId: { type: String, required: true },
    clientId: { type: String, required: true },
    freelancerId: { type: String, required: true },

    agreedAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },

    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },

    milestones: [
      {
        title: String,
        amount: Number,
        isPaid: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Contract = models.Contract || model<IContract>('Contract', contractSchema);
export default Contract;
