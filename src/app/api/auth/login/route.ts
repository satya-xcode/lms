import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
    await connectDB();

    try {
        const { email, password } = await request.json();
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        await createSession({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}