/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import LeaveRequest from '@/models/LeaveRequest';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function POST(req: Request, { params }: { params: any }) {
    await connectToDB();

    const { id, requestType } = await params;
    const session: any = await getServerSession(authOptions);

    if (!requestType) {
        return NextResponse.json({ error: 'request type not found' }, { status: 404 });
    }
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
        const user = await User.findById(leaveRequest.staff._id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        switch (requestType) {
            case 'half-day':
                user.monthlyLimits.halfDayLeaves = Math.max(0, user.monthlyLimits.halfDayLeaves - 1);
                user.monthlyLimits.fullDayLeaves = 0;
                break;
            case 'full-day':
                user.monthlyLimits.fullDayLeaves = Math.max(0, user.monthlyLimits.fullDayLeaves - 1);
                user.monthlyLimits.halfDayLeaves = 0;
                break;
            case 'additional-leave':
                user.additionalLeave = (user.additionalLeave || 0) + 1;
                break;
            case 'gate-pass':
                user.monthlyLimits.gatePasses = Math.max(0, user.monthlyLimits.gatePasses - 1);
                break;
            case 'late-pass':
                user.monthlyLimits.latePasses = Math.max(0, user.monthlyLimits.latePasses - 1);
                break;
            default:
                return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
        }

        await user.save();


        return NextResponse.json({ success: true, message: 'Leave approved successfully' });

    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json(
            { error: 'Internal server error', details: err.message },
            { status: 500 }
        );
    }
}
