/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET(
    request: Request,
    { params }: { params: any }
) {
    const { id } = await params;
    await connectToDB();
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await User.findById(id)
            .select('-password -__v')
            .populate('manager', '_id name email');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify the requesting user has access to these details
        if (session.user.id !== id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({
            id: user._id,
            name: user.name,
            fatherName: user.fatherName,
            empId: user.empId,
            punchId: user.punchId,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            department: user.department,
            additionalLeave: user.additionalLeave,
            monthlyLimits: user.monthlyLimits,
            manager: user.manager,
            joinDate: user.joinDate,
            isActive: user.isActive
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}