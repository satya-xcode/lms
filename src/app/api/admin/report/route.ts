/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/auth/authOptions";
import { connectToDB } from "@/lib/mongoose";
import LeaveRequest from "@/models/LeaveRequest";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDB();
    const session: any = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const report = await LeaveRequest.find({})
            .select('-password')
            .populate('manager', 'name email').populate('staff', 'name email');

        return NextResponse.json({ data: report }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
