/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth';
import LoginForm from './components/LoginForm';
import { redirect } from 'next/navigation';
import { Container } from '@mui/material';
import { authOptions } from '@/lib/auth/authOptions';

export default async function LoginPage() {
    const session: any = await getServerSession(authOptions);

    if (session?.user) {
        return redirect('/');
    }

    return (
        <Container maxWidth="sm">
            <LoginForm />
        </Container>
    );
}
