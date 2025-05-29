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

// export async function POST(req: Request) {
//     try {
//         await connectToDB();
//         const session: any = await getServerSession(authOptions);

//         if (!session || session.user.role !== 'staff') {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const body = await req.json();
//         const { type, reason, startDate, endDate, startTime, endTime } = body;

//         if (!type || !reason) {
//             return NextResponse.json({ error: 'Type and reason are required' }, { status: 400 });
//         }
//         console.log('ParamsData', { type, reason, startDate, endDate, startTime, endTime })
//         // Get the current user to check limits
//         const user = await User.findById(session.user.id);
//         if (!user) {
//             return NextResponse.json({ error: 'User not found' }, { status: 404 });
//         }

//         // Check if month has changed and reset limits if needed
//         const currentMonth = new Date().toISOString().slice(0, 7);
//         if (user.currentMonth !== currentMonth) {
//             user.currentMonth = currentMonth;
//             user.additionalLeave= 0;
//             user.monthlyLimits = {
//                 halfDayLeaves: 2,
//                 fullDayLeaves: 1,
//                 gatePasses: 2,
//                 latePasses: 2
//             };
//             await user.save();
//         }

//         // Check limits based on request type
//         switch (type) {
//             case 'half-day':
//                 if (user.monthlyLimits.halfDayLeaves <= 0) {
//                     return NextResponse.json({ error: 'Monthly half-day leave limit reached' }, { status: 400 });
//                 }
//                 break;
//             case 'full-day':
//                 if (user.monthlyLimits.fullDayLeaves <= 0) {
//                     return NextResponse.json({ error: 'Monthly full-day leave limit reached' }, { status: 400 });
//                 }
//                 break;
//             case 'additional-leave':
//                 // No limit for additional leaves
//                 break;
//             case 'gate-pass':
//                 if (user.monthlyLimits.gatePasses <= 0) {
//                     return NextResponse.json({ error: 'Monthly gate pass limit reached' }, { status: 400 });
//                 }
//                 break;
//             case 'late-pass':
//                 if (user.monthlyLimits.latePasses <= 0) {
//                     return NextResponse.json({ error: 'Monthly late pass limit reached' }, { status: 400 });
//                 }
//                 break;
//             default:
//                 return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
//         }


//         // Calculate total hours for time-based requests
//         let totalHours: number | undefined;
//         if (type === 'half-day' || type === 'gate-pass' || type === 'late-pass') {
//             const start = startTime ? new Date(startTime) : new Date();
//             const end = endTime ? new Date(endTime) : new Date();
//             totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
//         }

//         // Create the leave request
//         const leaveRequest = new LeaveRequest({
//             staff: user._id,
//             manager: user.manager,
//             type,
//             reason,
//             startDate: type === 'full-day' || type === 'additional-leave' ? new Date(startDate) : new Date(startTime),
//             endDate: type === 'full-day' || type === 'additional-leave' ? new Date(endDate) : new Date(endTime),
//             totalHours,
//         });

//         await leaveRequest.save();


//         // Update user limits with proper constraints
//         switch (type) {
//             case 'half-day':
//                 user.monthlyLimits.halfDayLeaves = Math.max(0, user.monthlyLimits.halfDayLeaves - 1);
//                 user.monthlyLimits.fullDayLeaves = 0; // Reset full-day leaves
//                 break;
//             case 'full-day':
//                 user.monthlyLimits.fullDayLeaves = Math.max(0, user.monthlyLimits.fullDayLeaves - 1);
//                 user.monthlyLimits.halfDayLeaves = 0; // Reset half-day leaves
//                 break;
//             case 'additional-leave':
//                 const startDate: any = new Date(user.startDate);
//                 const endDate: any = new Date(user.endDate);
//                 const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
//                 user.additionalLeave+= Number(totalDays);
//                 break;
//             case 'gate-pass':
//                 user.monthlyLimits.gatePasses = Math.max(0, user.monthlyLimits.gatePasses - 1);
//                 break;
//             case 'late-pass':
//                 user.monthlyLimits.latePasses = Math.max(0, user.monthlyLimits.latePasses - 1);
//                 break;
//         }


//         await user.save();

//         return NextResponse.json({ message: 'Request submitted successfully' }, { status: 201 });

//     } catch (error: unknown) {
//         const err = error as Error;
//         console.error("Request creation failed:", err.message);
//         return NextResponse.json(
//             { error: 'Internal server error', details: err.message },
//             { status: 500 }
//         );
//     }
// }


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
            user.additionalLeave = 0; // Reset additional leaves counter
            user.monthlyLimits = {
                halfDayLeaves: 2,
                fullDayLeaves: 1,
                gatePasses: 2,
                latePasses: 2
            };
            await user.save();
        }
        // Validate request parameters based on type
        if (type === 'full-day' || type === 'additional-leave') {
            if (!startDate || !endDate) {
                return NextResponse.json(
                    { error: 'Start and end dates are required for this leave type' },
                    { status: 400 }
                );
            }
        } else {
            if (!startTime || !endTime) {
                return NextResponse.json(
                    { error: 'Start and end times are required for this leave type' },
                    { status: 400 }
                );
            }
        }

        // Check limits based on request type
        switch (type) {
            case 'half-day':
                if (user.monthlyLimits.halfDayLeaves <= 0) {
                    return NextResponse.json(
                        { error: 'Monthly half-day leave limit reached' },
                        { status: 400 }
                    );
                }
                break;
            case 'full-day':
                if (user.monthlyLimits.fullDayLeaves <= 0) {
                    return NextResponse.json(
                        { error: 'Monthly full-day leave limit reached' },
                        { status: 400 }
                    );
                }
                break;
            case 'gate-pass':
                if (user.monthlyLimits.gatePasses <= 0) {
                    return NextResponse.json(
                        { error: 'Monthly gate pass limit reached' },
                        { status: 400 }
                    );
                }
                break;
            case 'late-pass':
                if (user.monthlyLimits.latePasses <= 0) {
                    return NextResponse.json(
                        { error: 'Monthly late pass limit reached' },
                        { status: 400 }
                    );
                }
                break;
            case 'additional-leave':
                // No limit checks for additional leaves
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid request type' },
                    { status: 400 }
                );
        }

        // Calculate dates and duration
        const start = type === 'full-day' || type === 'additional-leave'
            ? new Date(startDate)
            : new Date(startTime);
        const end = type === 'full-day' || type === 'additional-leave'
            ? new Date(endDate)
            : new Date(endTime);

        // Validate date range
        if (start > end) {
            return NextResponse.json(
                { error: 'End date/time must be after start date/time' },
                { status: 400 }
            );
        }

        // Calculate total hours/days
        let totalHours: number | undefined;
        if (type === 'full-day' || type === 'additional-leave') {
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            totalHours = days * 24;
        } else {
            totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

            // Validate durations
            if (type === 'half-day' && (totalHours < 3.5 || totalHours > 4.5)) {
                return NextResponse.json(
                    { error: 'Half-day leave must be approximately 4 hours' },
                    { status: 400 }
                );
            }
            if (type === 'gate-pass' && (totalHours < 1 / 60 || totalHours > 2)) {
                return NextResponse.json(
                    { error: 'Gate pass must be between 1 minute and 2 hours' },
                    { status: 400 }
                );
            }
            if (type === 'late-pass' && (totalHours < 1 / 60 || totalHours > 0.5)) {
                return NextResponse.json(
                    { error: 'Late pass must be between 1 and 30 minutes' },
                    { status: 400 }
                );
            }
        }

        // Create the leave request
        const leaveRequest = new LeaveRequest({
            staff: user._id,
            manager: user.manager,
            type,
            reason,
            startDate: start,
            endDate: end,
            totalHours,
            status: 'pending'
        });

        await leaveRequest.save();

        // // Update user limits
        // switch (type) {
        //     case 'half-day':
        //         user.monthlyLimits.halfDayLeaves = Math.max(0, user.monthlyLimits.halfDayLeaves - 1);
        //         user.monthlyLimits.fullDayLeaves = 0;
        //         break;
        //     case 'full-day':
        //         user.monthlyLimits.fullDayLeaves = Math.max(0, user.monthlyLimits.fullDayLeaves - 1);
        //         user.monthlyLimits.halfDayLeaves = 0;
        //         break;
        //     case 'additional-leave':
        //         // Track but don't limit additional leaves
        //         user.additionalLeave = (user.additionalLeave || 0) + 1;
        //         break;
        //     case 'gate-pass':
        //         user.monthlyLimits.gatePasses = Math.max(0, user.monthlyLimits.gatePasses - 1);
        //         break;
        //     case 'late-pass':
        //         user.monthlyLimits.latePasses = Math.max(0, user.monthlyLimits.latePasses - 1);
        //         break;
        // }

        // await user.save();

        return NextResponse.json({
            message: 'Request submitted successfully',
            data: {
                leaveRequest,
                remainingLimits: user.monthlyLimits,
                additionalLeave: user.additionalLeave
            }
        }, { status: 201 });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("Request creation failed:", err.message);
        return NextResponse.json(
            { error: 'Internal server error', details: err.message },
            { status: 500 }
        );
    }
}