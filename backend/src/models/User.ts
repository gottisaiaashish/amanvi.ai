import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  fcmToken?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fcmToken: { type: String },
  preferences: {
    theme: { type: String, default: 'dark' },
    notifications: { type: Boolean, default: true },
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);