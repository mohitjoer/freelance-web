// models/Room.ts
import { Schema, Document, Model, Types } from "mongoose";
import { chatConnection } from "@/chatmongo/chatdb";

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

// Must be registered on the CHAT connection. On the default singleton it would
// silently bind to the main database instead.
const Room: Model<IRoom> =
  (chatConnection.models.Room as Model<IRoom> | undefined) ??
  chatConnection.model<IRoom>("Room", roomSchema);

export type RoomDocument = Types.DocumentArray<IMessage> & { toObject: () => IMessage[] };
export default Room;
