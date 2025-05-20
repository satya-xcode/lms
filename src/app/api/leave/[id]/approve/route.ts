/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import LeaveRequest from '@/models/LeaveRequest';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();

    const { id } = await params;
    const session: any = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const leaveRequest = await LeaveRequest.findById(id).populate('staff');
        if (!leaveRequest || !leaveRequest.staff) {
            return NextResponse.json({ error: 'Leave request not found or missing staff reference' }, { status: 404 });
        }
        if (String(leaveRequest.manager._id) !== String(session?.user?.id)) {
            return NextResponse.json({ error: 'You are not authorized to approve this request' }, { status: 403 });
        }

        // Update leave request status
        leaveRequest.status = 'approved';
        await leaveRequest.save();

        // Deduct leave balance
        await User.findByIdAndUpdate(leaveRequest.staff._id, {
            $inc: { leaveBalance: -1 }
        });

        return NextResponse.json({ success: true, message: 'Leave approved successfully' });

    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json(
            { error: 'Internal server error', details: err.message },
            { status: 500 }
        );
    }
}
