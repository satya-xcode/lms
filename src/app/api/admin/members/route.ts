/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/admin/staff/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET() {
    await connectToDB();
    const session: any = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const staffMembers = await User.find({ role: { $in: ['staff', 'manager'] } })
            // .select('-password')
            .populate('manager', 'name email,password');

        return NextResponse.json({ data: staffMembers }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    await connectToDB();
    const session: any = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { name, fatherName, empId, punchId, email, mobile, role, department, manager, password } = await req.json();

        if (!name || !fatherName || !email || !mobile || !role || !department) {
            return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password if provided
        // const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const newStaff = new User({
            name,
            fatherName,
            empId,
            punchId,
            email,
            mobile,
            role,
            department,
            manager: manager || null,
            password: password,
            monthlyLimits: {
                halfDayLeaves: 2,
                fullDayLeaves: 1,
                gatePasses: 2,
                latePasses: 2
            }
        });

        await newStaff.save();

        // Return user without password
        const user = await User.findById(newStaff._id).select('-password');

        return NextResponse.json({ data: user, message: 'member created successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    await connectToDB()
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')
    const memberId = searchParams.get('memberId')

    const session: any = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== adminId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
        const deleted = await User.findByIdAndDelete(memberId)
        if (!deleted) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 })
        }
        return NextResponse.json({ message: 'Member deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.response.data.message || "error deleting member" }, { status: 500 })
    }
}
