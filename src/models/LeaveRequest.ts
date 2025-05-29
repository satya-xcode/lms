// models/LeaveRequest.ts
import { Schema, model, models } from 'mongoose';

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';
export type LeaveRequestType = 'half-day' | 'full-day' | 'additional-leave' | 'gate-pass' | 'late-pass';

export interface ILeaveRequest {
    staff: Schema.Types.ObjectId;
    manager: Schema.Types.ObjectId;
    type: LeaveRequestType;
    reason: string;
    startDate: Date;
    endDate: Date;
    status: LeaveRequestStatus;
    createdAt: Date;
    totalHours?: number;
}

const leaveRequestSchema = new Schema<ILeaveRequest>({
    staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['half-day', 'full-day', 'additional-leave', 'gate-pass', 'late-pass'],
        required: true
    },
    reason: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    totalHours: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

export default models.LeaveRequest || model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);