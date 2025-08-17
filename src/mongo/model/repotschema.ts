// src/chatmongo/model/report.ts
import mongoose, { Schema, Document } from "mongoose";


export interface IReport extends Document {
    reportId: string; // unique identifier for the report
    reporterId: string; // who reported
    reportedId: string; // who was reported
    reason: string;
    jobId: string;  
    timestamp: Date;
}

const ReportSchema: Schema = new Schema({
    reportId:{ type: String, required: true, unique: true },
    reporterId: { type: String, required: true },
    reportedId: { type: String, required: true },
    reason: { type: String, required: true },
    jobId: { type: String, required: true , unique: true},  
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Report ||
  mongoose.model<IReport>("Report", ReportSchema);
