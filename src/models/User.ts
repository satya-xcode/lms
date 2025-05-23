import { Schema, model, models } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password?: string;
    mobile: string;
    role: 'admin' | 'staff' | 'manager';
    manager?: Schema.Types.ObjectId;
    department: string;
    leaveBalance: number;
    emailVerified?: Date;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    mobile: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'staff', 'manager'],
        required: true
    },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    department: { type: String, required: true },
    leaveBalance: { type: Number, default: 1 },
    emailVerified: { type: Date }
});

export default models.User || model<IUser>('User', userSchema);