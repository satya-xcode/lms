/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
'use client'
import { Button, Container, Typography, Box, Stack, Skeleton, Card, CardContent, Avatar, Divider } from '@mui/material';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { useSession } from 'next-auth/react';
import { CheckCircleOutline, LoginOutlined } from '@mui/icons-material';
import theme from '@/theme/theme';

export default function HomePage() {
  const { data: session, status }: any = useSession();

  // Loading state with improved skeleton loading
  if (status === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card elevation={3}>
          <CardContent>
            <Stack spacing={3}>
              <Skeleton variant="rounded" width="60%" height={40} />
              <Skeleton variant="rounded" height={100} />
              <Stack spacing={2}>
                <Skeleton variant="rounded" height={56} />
                <Skeleton variant="rounded" height={56} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    )
  }

  // Unauthenticated state
  if (status === 'unauthenticated' || !session) {
    return (
      <Container maxWidth="sm" sx={{ mt: theme.spacing(2) }}>
        <Card elevation={3}>
          <CardContent sx={{ p: theme.spacing(4) }}>
            <Stack spacing={4} alignItems="center">
              <Avatar sx={{
                bgcolor: 'primary.main',
                width: 80,
                height: 80,
                mb: theme.spacing(2)
              }}>
                <CheckCircleOutline sx={{ fontSize: 40 }} />
              </Avatar>

              <Typography variant="h4" component="h1" textAlign="center" fontWeight="medium">
                Welcome to Tianyin LMS
              </Typography>

              <Typography variant="body1" color="text.secondary" textAlign="center">
                Access your profile and managing leaves by signing in to your account
              </Typography>

              <Box width="100%">
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  component={Link}
                  startIcon={<LoginOutlined />}
                  href="/login"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Authenticated state
  return (
    <Container maxWidth="sm" sx={{ mt: theme.spacing(2) }}>
      <Card elevation={3}>
        <CardContent sx={{ p: theme.spacing(4) }}>
          <Stack spacing={theme.spacing(2)}>
            <Box textAlign="center">
              <Avatar sx={{
                bgcolor: 'primary.main',
                width: 80,
                height: 80,
                mb: theme.spacing(4),
                margin: '0 auto'
              }}>
                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
              </Avatar>

              <Typography variant="h4" component="h1" fontWeight="medium">
                Welcome back!
              </Typography>

              <Typography variant="subtitle1" color="text.secondary">
                {session.user?.email}
              </Typography>
            </Box>

            <Divider />

            <Typography variant="h6" component="h2" fontWeight="medium">
              Quick Access
            </Typography>

            <Stack spacing={theme.spacing(2)}>
              {session.user?.role === 'admin' && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  component={Link}
                  href="/admin"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Admin Dashboard
                </Button>
              )}

              {session.user?.role === 'manager' && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  component={Link}
                  href="/manager"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Manager Portal
                </Button>
              )}

              {session.user?.role === 'staff' && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  component={Link}
                  href="/staff"
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Staff Portal
                </Button>
              )}
            </Stack>

            <Box pt={2}>
              <SignOutButton />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}