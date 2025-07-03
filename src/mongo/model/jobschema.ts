import { Schema, model, models, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IJob extends Document {
  jobId: string;
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

  references?: string[];       
  resources?: string[];         

  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    jobId: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
  

    clientId: { type: String, required: true },
    freelancerId: { type: String }, 

    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },

    references: [{ type: String }],
    resources: [{ type: String }], 

    proposals: [{ type: String }], 
    acceptedProposalId: { type: String }, 


    deadline: { type: Date, required: true },
    startedAt: { type: Date },
    finishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Job = models.Job || model<IJob>('Job', jobSchema);

export default Job;
