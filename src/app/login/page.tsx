/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';
import LoginForm from './components/LoginForm';
import { redirect } from 'next/navigation';
import { Container } from '@mui/material';
import { authOptions } from '@/lib/auth/authOptions';

export default async function LoginPage() {
    const session: any = await getServerSession(authOptions);
    if (session) {
        // Optional: redirect based on role
        const role = session.user.role;
        if (role === 'admin') return redirect('/admin');
        if (role === 'manager') return redirect('/manager');
        if (role === 'staff') return redirect('/staff');

        // Fallback
        return redirect('/');
    }

    return (
        <Container maxWidth="sm">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </Container>
    );
}
