/* eslint-disable @typescript-eslint/no-explicit-any */

import { redirect } from 'next/navigation';
import { Container } from '@mui/material';
import RegisterForm from './components/RegisterForm';
import { getSession } from 'next-auth/react';

export default async function RegisterPage() {

    const session: any = await getSession();
    if (session?.user) {
        return redirect('/');
    }

    return (
        <Container maxWidth="sm">
            <RegisterForm />
        </Container>
    );
}
