/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';
import { Types } from 'mongoose';
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    await connectToDB();
    const session: any = await getServerSession(authOptions);
    // console.log(
    //     'session', session
    // )
    // Await the params object before using its properties
    const { id } = await params;
    if (!session || (!Types.ObjectId.isValid(id) || session.user.id.toString() !== id && session.user.role !== 'admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const user = await User.findById(id).select('leaveBalance');
        // console.log('Leave', user)
        return NextResponse.json({ leaveBalance: user.leaveBalance });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}