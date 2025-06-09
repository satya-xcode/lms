// models/EmployeeLeaves.ts
import { Schema, model, models } from 'mongoose';
export interface IEmployeeLeaves {
    name: string;
    fatherName: string;
    empId: string;
    punchId: string;
    department: string;
    staff: Schema.Types.ObjectId;
    leaveType: string;
    reason: string;
    startDate: Date;
    endDate: Date;
    status: string
}

const employeeLeavesSchema = new Schema<IEmployeeLeaves>({
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    empId: { type: String },
    punchId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: {
        type: String,
        required: true
    },
    reason: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String }
}, { timestamps: true });

export default models.EmployeeLeaves || model<IEmployeeLeaves>('EmployeeLeaves', employeeLeavesSchema);