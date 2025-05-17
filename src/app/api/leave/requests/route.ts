/* eslint-disable prefer-const */
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
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let query: any = {};

        // Staff-specific requests
        const staffId = searchParams.get('staffId');
        console.log('StaffId', staffId)
        if (staffId) {
            if (session.user.id !== staffId && session.user.role !== 'admin') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
            query.staff = staffId;
        }

        // Manager's pending requests
        const managerId = searchParams.get('managerId');
        console.log('managerId', managerId)
        if (managerId) {
            if (session.user.id !== managerId && session.user.role !== 'admin') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }
            query.manager = managerId;
            query.status = 'pending';
        }

        console.log('QueryData', query)

        const requests = await LeaveRequest.find(query)
            .populate('staff', 'name email department')
            .populate('manager', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json(requests);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error' + error },
            { status: 500 }
        );
    }
}


export async function POST(req: Request) {
    await connectToDB();
    const session: any = await getServerSession(authOptions);

    if (!session || session.user.role !== 'staff') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reason, startDate, endDate } = await req.json();

    // Check leave balance
    const staff = await User.findById(session.user.id);
    if (staff.leaveBalance < 1) {
        return NextResponse.json({ error: 'No leave balance remaining' }, { status: 400 });
    }

    // Create leave request
    const leaveRequest = new LeaveRequest({
        staff: staff._id,
        manager: staff.manager,
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
    });

    await leaveRequest.save();

    // Send email notification
    const manager = await User.findById(staff.manager);
    await sendLeaveRequestEmail({
        to: manager.email,
        staffName: staff.name,
        requestId: leaveRequest._id.toString(),
        reason,
        startDate: new Date(startDate).toLocaleDateString(),
        endDate: new Date(endDate).toLocaleDateString()
    });

    return NextResponse.json({ success: true, leaveRequest });
}