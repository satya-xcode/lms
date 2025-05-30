/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function PUT(req: Request) {
    await connectToDB();
    const session: any = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, mobile, department } = await req.json();

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { name, mobile, department },
            { new: true }
        ).select('-password');

        return NextResponse.json({ data: updatedUser }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to update profile', details: error.message },
            { status: 500 }
        );
    }
}