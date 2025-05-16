import LoginForm from './components/LoginForm';
import { redirect } from 'next/navigation';
import { Container } from '@mui/material';
import { getSession } from 'next-auth/react';

export default async function LoginPage() {
    const session = await getSession();

    if (session?.user) {
        return redirect('/');
    }

    return (
        <Container maxWidth="sm">
            <LoginForm />
        </Container>
    );
}
