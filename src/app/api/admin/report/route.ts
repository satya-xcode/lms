/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/auth/authOptions";
import { connectToDB } from "@/lib/mongoose";
import LeaveRequest from "@/models/LeaveRequest";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await connectToDB()
    const session: any = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        const query: any = {}

        if (startDate && endDate) {
            query.startDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        } else if (startDate) {
            query.startDate = { $gte: new Date(startDate) }
        } else if (endDate) {
            query.startDate = { $lte: new Date(endDate) }
        }

        const report = await LeaveRequest.find(query)
            .select('-password')
            .populate('manager', 'name email')
            .populate('staff', 'name email')
            .lean()

        // Convert dates to ISO strings
        const formattedReport = report.map(item => ({
            ...item,
            startDate: item.startDate?.toISOString(),
            endDate: item.endDate?.toISOString(),
            createdAt: item.createdAt?.toISOString(),
            updatedAt: item.updatedAt?.toISOString(),
        }))

        return NextResponse.json({ data: formattedReport }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
}