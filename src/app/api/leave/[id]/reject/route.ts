/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import LeaveRequest from '@/models/LeaveRequest';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function POST(req: NextRequest, { params }: { params: any }) {
    try {
        await connectToDB();

        const session: any = await getServerSession(authOptions);
        const userId = String(session?.user?.id);

        if (!session || !userId) {
            return NextResponse.json({ error: 'Unauthorized: No session' }, { status: 401 });
        }

        const leaveRequest = await LeaveRequest.findById(params.id);
        if (!leaveRequest) {
            return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
        }

        if (String(leaveRequest.manager) !== userId) {
            return NextResponse.json({ error: 'Forbidden: Not authorized to reject' }, { status: 403 });
        }

        leaveRequest.status = 'rejected';
        await leaveRequest.save();

        return NextResponse.json({ success: true, message: 'Leave request rejected' });
    } catch (error) {
        console.error('[LEAVE_REJECT_ERROR]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
