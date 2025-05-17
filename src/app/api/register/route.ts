import { connectToDB } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

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
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
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