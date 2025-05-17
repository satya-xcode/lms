/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
'use client'
import { Button, Container, Typography, Box } from '@mui/material';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { useSession } from 'next-auth/react';
import LoadingProgress from '@/components/LoadingProgress';

export default function Home() {
  const { data: session, status }: any = useSession();

  // Loading state with proper skeleton structure
  if (status === 'loading') {
    return (
      <LoadingProgress />
    )
  }

  // Error state (if session exists but is invalid)
  if (status === 'unauthenticated' || !session) {
    return (
      <Container maxWidth="sm" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: 3,
        textAlign: 'center'
      }}>
        <Typography variant="h4" component="h1">
          Welcome to Tianyin&apos;s LMS!
        </Typography>
        <Typography variant="body1">
          Please sign in to access your account
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          component={Link}
          href="/login"
          sx={{ mt: 2 }}
        >
          Login Now
        </Button>
      </Container>
    );
  }

  // Authenticated state
  return (
    <Container maxWidth="sm" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      gap: 3,
      textAlign: 'center'
    }}>
      <Typography variant="h4" component="h1">
        Welcome to Tianyin&apos;s LMS!
      </Typography>

      <Typography variant="body1">
        You&apos;re logged in as: <strong>{session.user?.email}</strong>
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        mt: 2
      }}>
        {session.user?.role === 'admin' && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            href="/admin"
            sx={{ py: 1.5 }}
          >
            Go to Admin Dashboard
          </Button>
        )}

        {session.user?.role === 'manager' && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            href="/manager"
            sx={{ py: 1.5 }}
          >
            Go to Manager Portal
          </Button>
        )}

        {session.user?.role === 'staff' && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            href="/staff"
            sx={{ py: 1.5 }}
          >
            Go to Staff Portal
          </Button>
        )}

        <SignOutButton />
      </Box>
    </Container>
  );
}