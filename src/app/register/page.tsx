/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from 'next/navigation';
import { Container } from '@mui/material';
import RegisterForm from './components/RegisterForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export default async function RegisterPage() {
    const session: any = await getServerSession(authOptions);

    if (session?.user) {
        return redirect('/');
    }

    return (
        <Container maxWidth="sm">
            <RegisterForm />
        </Container>
    );
}
