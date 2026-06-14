import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  source: 'WhatsApp' | 'Gmail' | 'Instagram' | 'Calendar';
  sender: string;
  content: string;
  aiSummary?: string;
  receivedAt: Date;
  status: 'Unread' | 'Action_Required' | 'Done';
}

const MessageSchema: Schema = new Schema({
  source: { 
    type: String, 
    required: true, 
    enum: ['WhatsApp', 'Gmail', 'Instagram', 'Calendar'] 
  },
  sender: { type: String, required: true },
  content: { type: String, required: true },
  aiSummary: { type: String },
  receivedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Unread', 'Action_Required', 'Done'],
    default: 'Unread' 
  }
});

export default mongoose.model<IMessage>('Message', MessageSchema);