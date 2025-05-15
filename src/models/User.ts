import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    mobile: string;
    password: string;
    role: 'admin' | 'manager' | 'staff';
    provider?: string;
}

const UserSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String },
    role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
    provider: { type: String },
});

export const User = models.User || mongoose.model<IUser>('User', UserSchema);
