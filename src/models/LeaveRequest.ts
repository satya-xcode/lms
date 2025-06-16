// models/LeaveRequest.ts
import { Schema, model, models } from 'mongoose';

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'submitted';
export type LeaveRequestType = 'half-day' | 'full-day' | 'additional-leave' | 'gate-pass' | 'late-pass' | 'gate-pass(Work)';

export interface ILeaveRequest {
    name: string;
    fatherName: string;
    empId: string;
    punchId: string;
    staff: Schema.Types.ObjectId;
    manager: Schema.Types.ObjectId;
    department: string;
    type: LeaveRequestType;
    reason: string;
    role: string;
    startDate: Date;
    endDate: Date;
    status: LeaveRequestStatus;
    createdAt: Date;
    totalHours?: number;
}

const leaveRequestSchema = new Schema<ILeaveRequest>({
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    empId: { type: String },
    punchId: { type: String },
    staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String },
    role: { type: String },
    type: {
        type: String,
        enum: ['half-day', 'full-day', 'additional-leave', 'gate-pass', 'late-pass', 'gate-pass(Work)'],
        required: true
    },
    reason: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'submitted'],
        default: 'pending'
    },
    totalHours: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

export default models.LeaveRequest || model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);