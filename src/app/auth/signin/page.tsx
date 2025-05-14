import { Box, Button, TextField, Typography } from '@mui/material';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import SignInForm from '@/components/Auth/SignInForm';

export default async function SignInPage() {
    const user = await getCurrentUser();
    if (user) redirect('/dashboard');

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Sign In
            </Typography>
            <SignInForm />
        </Box>
    );
}