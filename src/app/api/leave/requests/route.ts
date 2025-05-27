/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/leave/requests/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
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
        const staffId = searchParams.get('staffId');
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        if (staffId && status) {
            if (session?.user?.id == staffId && session?.user?.role == 'staff') {
                const query: any = { staff: staffId, status: status };
                if (type) query.type = type;

                const requests = await LeaveRequest.find(query)
                    .populate('staff', 'name email department')
                    .populate('manager', 'name email')
                    .sort({ createdAt: -1 });

                return NextResponse.json(
                    { data: requests, message: 'Fetched staff requests' },
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

        return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });

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

        const body = await req.json();
        const { type, reason, startDate, endDate, startTime, endTime } = body;

        if (!type || !reason) {
            return NextResponse.json({ error: 'Type and reason are required' }, { status: 400 });
        }

        // Get the current user to check limits
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if month has changed and reset limits if needed
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (user.currentMonth !== currentMonth) {
            user.currentMonth = currentMonth;
            user.monthlyLimits = {
                halfDayLeaves: 2,
                fullDayLeaves: 1,
                gatePasses: 2,
                latePasses: 2
            };
            await user.save();
        }

        // Check limits based on request type
        switch (type) {
            case 'half-day':
                if (user.monthlyLimits.halfDayLeaves <= 0) {
                    return NextResponse.json({ error: 'Monthly half-day leave limit reached' }, { status: 400 });
                }
                break;
            case 'full-day':
                if (user.monthlyLimits.fullDayLeaves <= 0) {
                    return NextResponse.json({ error: 'Monthly full-day leave limit reached' }, { status: 400 });
                }
                break;
            case 'gate-pass':
                if (user.monthlyLimits.gatePasses <= 0) {
                    return NextResponse.json({ error: 'Monthly gate pass limit reached' }, { status: 400 });
                }
                break;
            case 'late-pass':
                if (user.monthlyLimits.latePasses <= 0) {
                    return NextResponse.json({ error: 'Monthly late pass limit reached' }, { status: 400 });
                }
                break;
            default:
                return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
        }

        // Calculate total hours for time-based requests
        let totalHours: number | undefined;
        if (type === 'half-day' || type === 'gate-pass' || type === 'late-pass') {
            const start = startTime ? new Date(startTime) : new Date();
            const end = endTime ? new Date(endTime) : new Date();
            totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }

        // Create the leave request
        const leaveRequest = new LeaveRequest({
            staff: user._id,
            manager: user.manager,
            type,
            reason,
            startDate: type === 'full-day' ? new Date(startDate) : new Date(startTime),
            endDate: type === 'full-day' ? new Date(endDate) : new Date(endTime),
            totalHours,
        });

        await leaveRequest.save();

        // Update user limits
        switch (type) {
            case 'half-day':
                user.monthlyLimits.halfDayLeaves -= 1;
                break;
            case 'full-day':
                user.monthlyLimits.fullDayLeaves -= 1;
                break;
            case 'gate-pass':
                user.monthlyLimits.gatePasses -= 1;
                break;
            case 'late-pass':
                user.monthlyLimits.latePasses -= 1;
                break;
        }
        await user.save();

        return NextResponse.json({ message: 'Request submitted successfully' }, { status: 201 });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("Request creation failed:", err.message);
        return NextResponse.json(
            { error: 'Internal server error', details: err.message },
            { status: 500 }
        );
    }
}