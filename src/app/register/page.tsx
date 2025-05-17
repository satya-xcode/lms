'use client'
import { redirect } from 'next/navigation';
import { Container } from '@mui/material';
import RegisterForm from './components/RegisterForm';
import { useSession } from 'next-auth/react';
import LoadingProgress from '@/components/LoadingProgress';

export default function RegisterPage() {
    const session = useSession();

    if (session.status === 'loading') {
        return <LoadingProgress />
    }

    if (session.status === 'authenticated') {
        return redirect('/');
    }

    return (
        <Container maxWidth="sm">
            <RegisterForm />
        </Container>
    );
}
