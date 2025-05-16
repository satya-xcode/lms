/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
import { Button, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import SignOutButton from '@/components/SignOutButton';

export default async function Home() {
  const session: any = await getServerSession(authOptions);
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

      {session ? (
        <>
          <Typography variant="body1">
            You&apos;re logged in as: <strong>{session.user.email}</strong>
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {session.user.role === 'admin' && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                component={Link}
                href="/admin"
              >
                Go to Admin Dashboard
              </Button>
            )}
            {session.user.role === 'manager' && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                component={Link}
                href="/manager"
              >
                Go to Manager Portal
              </Button>
            )}
            {session.user.role === 'staff' && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                component={Link}
                href="/staff"
              >
                Go to Staff Portal
              </Button>
            )}
            <SignOutButton />
          </div>
        </>
      ) : (
        <>
          <Typography variant="body1">
            Please sign in to access your account
          </Typography>
          <Button
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            href="/login"
          >
            Login Now
          </Button>
        </>
      )}
    </Container>
  );
}