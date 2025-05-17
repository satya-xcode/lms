/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import LeaveRequest from '@/models/LeaveRequest';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();
    const session: any = await getServerSession(authOptions);

    const leaveRequest = await LeaveRequest.findById(params.id).populate('staff');

    if (!leaveRequest || !session ||
        leaveRequest.manager.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update leave request status
    leaveRequest.status = 'approved';
    await leaveRequest.save();

    // Deduct leave balance
    await User.findByIdAndUpdate(leaveRequest.staff._id, {
        $inc: { leaveBalance: -1 }
    });

    return NextResponse.json({ success: true });
}