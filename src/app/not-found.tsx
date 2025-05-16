// app/not-found.tsx
'use client'
import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { ErrorOutline, Home, ArrowBack } from '@mui/icons-material';

// export const metadata = {
//     title: '404 - Not Found',
//     robots: 'noindex, nofollow'
// };
export default function NotFound() {
    return (
        <Container maxWidth="md" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            py: 8,
            gap: 3
        }}>
            {/* Error Icon */}
            <ErrorOutline color="error" sx={{ fontSize: 80 }} />

            {/* Title */}
            <Typography variant="h3" component="h1" fontWeight="bold">
                404 - Page Not Found
            </Typography>

            {/* Description */}
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<Home />}
                    component={Link}
                    href="/"
                    size="large"
                >
                    Go to Homepage
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => window.history.back()}
                    size="large"
                >
                    Go Back
                </Button>
            </Box>

            {/* Additional Help */}
            <Typography variant="caption" sx={{ mt: 4 }}>
                Need help? <Link href="/contact" style={{ color: 'inherit' }}>Contact support</Link>
            </Typography>
        </Container>
    );
}
