// models/User.ts
import { Schema, model, models } from 'mongoose';

export interface IUser {
    name: string;
    fatherName: string;
    empId?: string;
    punchId: string;
    email: string;
    password?: string;
    mobile: string;
    role: 'admin' | 'staff' | 'manager';
    manager?: Schema.Types.ObjectId;
    department: string;
    joinDate: Date;
    isActive: boolean;
    leaveBalance: number;
    additionalLeave: number;
    monthlyLimits: {
        halfDayLeaves: number;
        fullDayLeaves: number;
        gatePasses: number;
        latePasses: number;
    };
    currentMonth: string;
    emailVerified?: Date;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: true },
    mobile: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'staff', 'manager'],
        required: true,
        default: 'staff'
    },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    department: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    leaveBalance: { type: Number, default: 1 },
    additionalLeave: { type: Number, default: 0 },
    monthlyLimits: {
        halfDayLeaves: { type: Number, default: 2 },
        fullDayLeaves: { type: Number, default: 1 },
        gatePasses: { type: Number, default: 2 },
        latePasses: { type: Number, default: 2 }
    },
    currentMonth: { type: String, default: () => new Date().toISOString().slice(0, 7) },
    emailVerified: { type: Date }
});

export default models.User || model<IUser>('User', userSchema);
