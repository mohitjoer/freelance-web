import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    notificationId: string;
    userId: string;
    type: 'proposal_received' | 'proposal_accepted' | 'proposal_rejected' | 'job_completed';
    title: string;
    message: string;
    link?: string;
    jobId?: string;
    read: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        notificationId: { type: String, required: true, unique: true },
        userId: { type: String, required: true, index: true },
        type: {
            type: String,
            enum: ['proposal_received', 'proposal_accepted', 'proposal_rejected', 'job_completed'],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String },
        jobId: { type: String },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
