'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button, Container, Typography, Box, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function HomePage() {
  // const { data: session, status }: any = useSession();
  const { isAuthenticated, isUnAuthenticated, isLoading, user } = useCurrentUser()
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to role-specific route after login
      console.log('user', user?.role)
      router.push(`/${user?.role}`);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Welcome to Our Application
            </Typography>

            {isUnAuthenticated ? (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Please sign in to access your dashboard
                </Typography>
                <Button
                  component={Link}
                  href="/login"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Sign In
                </Button>
              </Box>
            ) : (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1">
                  Redirecting you to your dashboard...
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </>

  );
}


