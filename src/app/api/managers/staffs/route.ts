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

