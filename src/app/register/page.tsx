/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from '@mui/material';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import RegisterForm from './components/RegisterForm';
import { authOptions } from '@/lib/auth/authOptions';


export default async function RegisterPage() {
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
            <RegisterForm />
        </Container>
    );
}
