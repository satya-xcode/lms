/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/staff/[staffId]/leave-requests/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';
import LeaveRequest from '@/models/LeaveRequest';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId')?.toString();
    const leaveType = searchParams.get('leaveType')?.toString();
    // console.log('Query parameters:', { staffId, leaveType });

    if (!staffId) {
        return new Response('Invalid staffId', { status: 400 });
    }

    await connectToDB();
    const session: any = await getServerSession(authOptions);

    if (!session || session.user.id !== staffId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check if leaveType exists and is not empty
        if (leaveType) {
            // console.log('Filtered leaveType query:', staffId, leaveType);
            const leaveRequests = await LeaveRequest.find({
                staff: staffId,
                type: leaveType,
                role: 'employee'
            }).populate('staff', 'name email mobile');

            return NextResponse.json({
                message: 'Employee work leaves fetched successfully',
                data: leaveRequests
            }, { status: 200 });
        }
        // Else case (leaveType is undefined, null, or empty string)
        else {
            // console.log('All leaveTypes query:', staffId);
            const leaveRequests = await LeaveRequest.find({
                staff: staffId,
                role: 'employee',
                type: { $ne: 'gate-pass(Work)' } // Exclude 'gate-pass(work)' type
            }).populate('staff', 'name email mobile');

            return NextResponse.json({
                message: 'Employee leaves fetched successfully',
                data: leaveRequests
            }, { status: 200 });
        }
    } catch (error: any) {
        console.error('Error fetching leave requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leave requests', details: error.message },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');
    const managerId = searchParams.get('managerId');
    // console.log(
    //     'POST request received with staffId:', staffId, 'and managerId:', managerId
    // )
    await connectToDB();
    const session: any = await getServerSession(authOptions);
    if (session?.user?.id !== staffId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, fatherName, empId, punchId, department, leaveType, reason, startDate, endDate } = await request.json();
        const res = await LeaveRequest.create({
            name: name,
            fatherName: fatherName,
            empId: empId,
            punchId: punchId,
            department: department,
            staff: staffId,
            manager: managerId,
            type: leaveType,
            role: 'employee',
            reason,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'submitted'
        })

        return NextResponse.json({ data: res, message: 'Leave submitted successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to create leave request' },
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
        const deleted = await LeaveRequest.findByIdAndDelete(employeeId)
        if (!deleted) {
            return NextResponse.json({ error: 'Leave not found' }, { status: 404 })
        }
        return NextResponse.json({ message: 'Leave deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.response.data.message || "error deleting staff" }, { status: 500 })
    }
}
