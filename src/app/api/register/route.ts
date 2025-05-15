/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectToDB } from '@/lib/mongoose';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { name, email, mobile, password } = await req.json();

        if (!email || !password || !name || !mobile) {
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });
        }

        await connectToDB();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            role: 'staff',
            provider: 'credentials',
        });

        await newUser.save();
        return NextResponse.json({ message: 'User registered' });
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
