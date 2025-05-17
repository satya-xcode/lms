/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET() {
    await connectToDB();
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    try {
        const managers = await User.find({ role: 'manager' })
            .select('_id name email')
            .lean();
        // console.log('ManagersFromBKND', managers)
        return NextResponse.json(managers);
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}