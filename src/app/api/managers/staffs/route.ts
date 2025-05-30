/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/user/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET(request: Request
) {
    const { searchParams } = new URL(request.url);
    const managerId = searchParams.get('managerId');

    await connectToDB();
    const session: any = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        // Verify the requesting user has access to these details
        if (session.user.id !== managerId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        const user = await User.find({ manager: managerId })
            .select('-manager -password -__v')
        // .populate('manager', '_id name email');
        if (!user) {
            return NextResponse.json({ error: 'Staffs are not found' }, { status: 404 });
        }
        return NextResponse.json({ data: user, message: 'Staffs fetched successfully' });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}