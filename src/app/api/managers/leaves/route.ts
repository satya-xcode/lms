/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/leave/requests/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import LeaveRequest from '@/models/LeaveRequest';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET(req: Request) {
    await connectToDB();
    const session: any = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const status = searchParams.get('status');
        const managerId = searchParams.get('managerId');
        if (managerId) {
            if (session?.user?.id == managerId && session?.user?.role == 'manager') {
                const requests = await LeaveRequest.find({ manager: managerId, status: status })
                    .populate('staff', 'name email department')
                    .populate('manager', 'name email')
                    .sort({ createdAt: -1 });

                return NextResponse.json(
                    { data: requests, message: 'Fetched manager pending requests' },
                    { status: 200 }
                );
            } else {
                return NextResponse.json({ error: 'Unauthorized access to manager data' }, { status: 403 });
            }
        }

        return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
