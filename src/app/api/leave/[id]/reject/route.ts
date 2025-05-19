/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import LeaveRequest from '@/models/LeaveRequest';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    await connectToDB();
    const session: any = await getServerSession(authOptions);

    const leaveRequest = await LeaveRequest.findById(params.id);

    if (!leaveRequest || !session || leaveRequest?.manager?.toString() !== String(session?.user?.id)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    leaveRequest.status = 'rejected';
    await leaveRequest.save();

    return NextResponse.json({ success: true, message: 'Leave reject okay' });
}