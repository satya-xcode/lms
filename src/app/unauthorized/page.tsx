// app/unauthorized/page.tsx
import { Button, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: '403 - Unauthorized Access',
    robots: 'noindex, nofollow' // Prevent search indexing
};
export default function UnauthorizedPage() {
    return (
        <Container maxWidth="sm" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            gap: 3
        }}>
            {/* Error Icon */}
            <Typography variant="h1" color="error" sx={{ fontSize: '4rem' }}>
                403
            </Typography>

            {/* Title */}
            <Typography variant="h4" fontWeight="bold">
                Access Denied
            </Typography>

            {/* Description */}
            <Typography variant="body1" color="text.secondary">
                You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
            </Typography>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    component={Link}
                    href="/"
                >
                    Go Home
                </Button>

                <Button
                    variant="contained"
                    component={Link}
                    href="/login"
                >
                    Sign In
                </Button>
            </div>
        </Container>
    );
}