import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  source: { 
    type: String, 
    required: true, 
    enum: ['WhatsApp', 'Gmail', 'Instagram', 'Calendar', 'System'] 
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

export default mongoose.model('Message', MessageSchema);
