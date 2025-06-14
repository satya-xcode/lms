/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth/authOptions.ts

import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
// import bcrypt from 'bcrypt';
import { connectToDB } from '@/lib/mongoose';
import User from '@/models/User';
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
                // const user = await User.findOne({ email: credentials.email });
                // if (!user || !user.password) throw new Error('Invalid credentials');
                // const isValid = credentials.password == user.password
                // if (!isValid) throw new Error('Invalid password');
                const user = await User.findOne({
                    email: credentials.email,
                    password: credentials.password // Direct comparison (INSECURE)
                });

                if (!user) throw new Error('Invalid credentials');

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    // manager: user.manager,
                    // leaveBalance: user.leaveBalance,
                    // monthlyLimits: user.monthlyLimits,
                    // currentMonth: user.currentMonth
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/login',
        // signOut: '/auth/signout',
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in
    },
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
        async jwt({ token, user }: { token: any; user: any }) {
            // Persist the role to the token right after sign in
            // console.log('token', token)
            // console.log('user', user)
            if (user) {
                token.role = user.role;
                token.id = user.id;
                // token.manager = user.manager;
                // token.leaveBalance = user.leaveBalance;
                // token.monthlyLimits = user.monthlyLimits;
                // token.currentMonth = user.currentMonth;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            // Send role to the client
            // console.log('session', session)
            if (token) {
                session.user.role = token.role;
                session.user.id = token.id;
                // session.user.manager = token.manager;
                // session.user.leaveBalance = token.leaveBalance;
                // session.user.monthlyLimits = token.monthlyLimits;
                // session.user.currentMonth = token.currentMonth;
            }
            return session;
        }
        // async session({ session }: { session: any }) {
        //     await connectToDB();
        //     const userInDb = await User.findOne({ email: session.user.email });
        //     if (userInDb) {
        //         session.user.role = userInDb.role;
        //         session.user.id = userInDb._id;
        //     }
        //     return session;
        // },
    },
    session: {
        strategy: 'jwt',
    }
};
