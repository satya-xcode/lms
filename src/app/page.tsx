/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
'use client'
import { Button, Container, Typography, Box, Stack, Skeleton, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status }: any = useSession();

  // Loading state with proper skeleton structure
  if (status === 'loading') {
    return (

      <Stack spacing={1} sx={{}}>
        <Container component={Card} maxWidth='sm' sx={{ margin: 'auto', p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
          <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
          <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
          <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
        </Container>
      </Stack>
    )
  }

  // Error state (if session exists but is invalid)
  if (status === 'unauthenticated' || !session) {
    return (
      <Card sx={{ maxWidth: 'sm', margin: 'auto' }}>
        <CardContent>
          <Stack spacing={4}>
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

          </Stack>
        </CardContent>
      </Card>

    );
  }

  // Authenticated state
  return (
    <Card sx={{ maxWidth: 'sm', margin: 'auto' }}>
      <CardContent>
        <Stack spacing={4}>
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
                sx={{}}
              >
                Go to Staff Portal
              </Button>
            )}

            <SignOutButton />
          </Box>

        </Stack>


      </CardContent>
    </Card>


  );
}