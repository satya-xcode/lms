/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import User from '@/models/User'
import { connectToDB } from '@/lib/mongoose'
import { authOptions } from '@/lib/auth/authOptions'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const managerId = searchParams.get('managerId')
    const page = parseInt(searchParams.get('page') || '0', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    // console.log('managerId', managerId, 'page', page, 'limit', limit)
    await connectToDB()
    const session: any = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== managerId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
        let total

        if (!page && !limit) {
            total = await User.countDocuments({ manager: managerId })
            return NextResponse.json({ total }, { status: 200 })
        }

        const users = await User.find({ manager: managerId })
            .select('-manager -password -__v')
            .skip(page * limit)
            .limit(limit)
        // console.log(
        //     `Total users: ${total}, users: ${users.length}, page: ${page}, limit`
        // )
        return NextResponse.json({
            data: users,
            total,
            page,
            message: 'Staffs fetched successfully',
        })
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const { name, email, mobile, password, department, managerId } = await req.json();

        // Validate required fields
        if (!email || !password || !name || !mobile || !department) {
            return NextResponse.json(
                { error: 'Name, email, mobile, password, and department are required' },
                { status: 400 }
            );
        }

        await connectToDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 400 }
            );
        }

        // Validate manager if provided
        let manager = null;
        if (managerId) {
            manager = await User.findById(managerId);
            if (!manager || manager.role !== 'manager') {
                return NextResponse.json(
                    { error: 'Invalid manager specified' },
                    { status: 400 }
                );
            }
        }

        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            name,
            email,
            mobile,
            password: password,
            role: 'staff',
            department,
            manager: managerId || null,
            leaveBalance: 1, // Initialize with 1 leave per month
            providers: ['credentials'],
            emailVerified: new Date() // Assuming email verification happens during registration
        });

        await newUser.save();

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    department: newUser.department
                }
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('Registration error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    await connectToDB()
    const { searchParams } = new URL(request.url)
    const managerId = searchParams.get('managerId')
    const staffId = searchParams.get('staffId')

    const session: any = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== managerId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
        const deleted = await User.findByIdAndDelete(staffId)
        if (!deleted) {
            return NextResponse.json({ error: 'Staff not found' }, { status: 404 })
        }
        return NextResponse.json({ message: 'Staff deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.response.data.message || "error deleting staff" }, { status: 500 })
    }
}

