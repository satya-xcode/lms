import { Schema, model, models } from 'mongoose';

export interface ILeaveRequest {
    staff: Schema.Types.ObjectId;
    manager: Schema.Types.ObjectId;
    reason: string;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}

const leaveRequestSchema = new Schema<ILeaveRequest>({
    staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

export default models.LeaveRequest || model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);