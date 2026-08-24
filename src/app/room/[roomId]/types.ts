export interface Message {
  _id?: string;
  senderId: string;
  senderName?: string;
  role: string;
  message: string;
  timestamp: string | Date;
  socketId?: string;
}

export type ChatMessageEvent = Message & { _id?: string };
