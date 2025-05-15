/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth/authOptions.ts

import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { connectToDB } from '@/lib/mongoose';
import { User } from '@/models/User';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials: any) {
                await connectToDB();
                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.password) throw new Error('Invalid credentials');
                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error('Invalid password');

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }: { user: any; account: any }) {
            if (account.provider === 'google') {
                await connectToDB();
                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        provider: 'google',
                        role: 'staff',
                    });
                }
            }
            return true;
        },
        async session({ session }: { session: any }) {
            await connectToDB();
            const userInDb = await User.findOne({ email: session.user.email });
            if (userInDb) {
                session.user.role = userInDb.role;
                session.user.id = userInDb._id;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
};
