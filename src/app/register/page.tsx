'use client';
import { redirect } from 'next/navigation';
import { Container } from '@mui/material';
import { useSession } from 'next-auth/react';
import LoadingProgress from '@/components/LoadingProgress';
import RegistrationForm from './components/RegistrationForm';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import Navbar from '@/components/shared/Navbar';
import theme from '@/theme/theme';

interface Manager {
    _id: string;
    name: string;
    email: string;
}

export default function RegisterPage() {
    const { data: managers, isLoading: managersLoading } = useSWR<Manager[]>('/api/managers', fetcher, {});
    // console.log('Managerrrr', managers)
    const session = useSession();


    if (session.status === 'loading' || managersLoading) {
        return <LoadingProgress />;
    }

    if (session.status === 'authenticated') {
        return redirect('/');
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="sm" sx={{ mt: theme.spacing(2) }}>
                <RegistrationForm managers={managers || []} />
            </Container>
        </>

    );
}