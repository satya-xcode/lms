
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import LeaveRequest from '@/models/LeaveRequest';
import { sendLeaveRequestEmail } from '@/lib/email';
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

        const staffId = searchParams.get('staffId');
        const status = searchParams.get('status')
        if (staffId && status) {
            if (session?.user?.id == staffId && session?.user?.role == 'staff') {
                const requests = await LeaveRequest.find({ staff: staffId, status: status })
                    .populate('staff', 'name email department')
                    .populate('manager', 'name email')
                    .sort({ createdAt: -1 });
                return NextResponse.json(
                    { data: requests, message: 'Fetched staff pending requests' },
                    { status: 200 }
                );
            } else {
                return NextResponse.json({ error: 'Unauthorized access to staff data' }, { status: 403 });
            }
        }

        const managerId = searchParams.get('managerId');
        if (managerId) {

            if (session?.user?.id == managerId && session?.user?.role == 'manager') {
                const requests = await LeaveRequest.find({ manager: managerId, status: 'pending' })
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


    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await connectToDB();
        const session: any = await getServerSession(authOptions);

        if (!session || session.user.role !== 'staff') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { reason, startDate, endDate } = await req.json();

        if (!reason || !startDate || !endDate) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const staff = await User.findById(session.user.id);

        if (!staff) {
            return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
        }



        const leaveRequest = new LeaveRequest({
            staff: staff._id,
            manager: staff.manager,
            reason,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });

        await leaveRequest.save();

        // Notify manager
        const manager = await User.findById(staff.manager);
        if (manager) {
            await sendLeaveRequestEmail({
                to: manager.email,
                staffName: staff.name,
                requestId: leaveRequest._id.toString(),
                reason,
                startDate: new Date(startDate).toLocaleDateString(),
                endDate: new Date(endDate).toLocaleDateString(),
            });
        }

        return NextResponse.json({ message: 'Leave submitted successfully' }, { status: 201 });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("Leave request creation failed:", err.message);
        return NextResponse.json(
            { error: 'Internal server error', details: err.message },
            { status: 500 }
        );
    }
}