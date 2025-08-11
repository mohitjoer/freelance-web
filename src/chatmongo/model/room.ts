// models/Room.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IMessage {
  senderId: string;
  role: string;
  message: string;
  timestamp?: Date;
}

export interface IRoom extends Document {
  roomId: string;
  messages: IMessage[];
}

const messageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const roomSchema = new Schema<IRoom>({
  roomId: { type: String, required: true, unique: true },
  messages: [messageSchema]
});

const Room: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>("Room", roomSchema);

export default Room;
