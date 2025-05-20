/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import { connectToDB } from '@/lib/mongoose';
import { authOptions } from '@/lib/auth/authOptions';
export async function GET(
    req: Request,
    { params }: { params: any }
) {
    await connectToDB();
    const session: any = await getServerSession(authOptions);
    const { id }: any = await params;
    try {
        if (id) {
            if (session?.user?.id == id && session?.user?.role == 'staff') {
                const user = await User.findById(id).select('leaveBalance');
                return NextResponse.json({ data: user?.leaveBalance, message: 'Staff leave balance fetched' });
            } else {
                return NextResponse.json({ error: 'Unauthorized access to staff data' }, { status: 403 });
            }
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}