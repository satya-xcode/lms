/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Container } from '@mui/material';
import LoginForm from '../login/components/LoginForm';

export default function LoginPage() {
    const { data: session, status }: any = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            const role = session?.user?.role;
            if (role === 'admin') router.push('/admin');
            else if (role === 'manager') router.push('/manager');
            else if (role === 'staff') router.push('/staff');
            else router.push('/');
        }
    }, [session, status, router]);

    if (status === 'loading') return <div>Loading...</div>;

    return (
        <Container maxWidth="sm">
            <LoginForm />
        </Container>
    );
}
