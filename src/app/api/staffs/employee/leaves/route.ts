/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/staff/[staffId]/leave-requests/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';
import EmployeeLeaves from '@/models/EmployeeLeaves';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) {
        return new Response('Invalid staffId', { status: 400 })
    }

    await connectToDB();
    const session: any = await getServerSession(authOptions);

    if (!session || session.user.id !== staffId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const leaveRequests = await EmployeeLeaves.find({
            staff: staffId
        }).populate('staff', 'name email mobile');

        return NextResponse.json({ message: 'Employee leaves fetched successfully', data: leaveRequests }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch leave requests', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    await connectToDB();
    const session: any = await getServerSession(authOptions);
    if (session?.user?.id !== staffId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, fatherName, empId, punchId, department, leaveType, reason, startDate, endDate } = await request.json();

        const leaveRequest = new EmployeeLeaves({
            name: name,
            fatherName: fatherName,
            empId: empId || '',
            punchId: punchId,
            department,
            staff: staffId,
            leaveType,
            reason,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'submitted'
        });

        await leaveRequest.save();
        return NextResponse.json({ data: leaveRequest, message: 'Leave submitted successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to create leave request', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    await connectToDB()
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const staffId = searchParams.get('staffId')

    const session: any = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== staffId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
        const deleted = await EmployeeLeaves.findByIdAndDelete(employeeId)
        if (!deleted) {
            return NextResponse.json({ error: 'Leave not found' }, { status: 404 })
        }
        return NextResponse.json({ message: 'Leave deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.response.data.message || "error deleting staff" }, { status: 500 })
    }
}
