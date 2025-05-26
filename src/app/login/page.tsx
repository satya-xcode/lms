/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import {
    Box,
    Button,
    Divider,
    Paper,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Alert,
    Container
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { LoginOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import LoadingProgress from '@/components/LoadingProgress';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import theme from '@/theme/theme';


const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
});

export default function LoginPage() {
    const router = useRouter()
    const session: any = useSession();
    // const searchParams = useSearchParams()
    // const callbackUrl = searchParams.get('callbackUrl') || '/'
    // // useEffect(() => {
    // //     if (session.status === 'authenticated') {
    // //         router.push('/');
    // //     }
    // // }, [session.status, router]);

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (session.status === 'loading') {
        return <LoadingProgress />;
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="sm" sx={{ mt: theme.spacing(2) }}>
                <Paper variant='outlined' sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" mb={4}>
                        Please enter your credentials to continue
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setError(null);
                            try {
                                const res = await signIn('credentials', {
                                    redirect: false,
                                    email: values.email,
                                    password: values.password
                                });

                                if (res?.error) {
                                    setError('Invalid email or password');
                                } else if (res?.ok) {
                                    router.push('/');
                                    // Remove callbackUrl from the redirect
                                    // router.push(callbackUrl === '/' ? `/${session?.data?.user?.role}` : callbackUrl)
                                }
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            } catch (err) {
                                setError('An unexpected error occurred');
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    name="email"
                                    label="Email Address"
                                    fullWidth
                                    margin="normal"
                                    error={touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    autoComplete="email"
                                    autoFocus
                                />

                                <Field
                                    as={TextField}
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    margin="normal"
                                    error={touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                    autoComplete="current-password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <Box sx={{ textAlign: 'right', mb: 2 }}>
                                    <Link href="/forgot-password" passHref>
                                        <Typography
                                            variant="body2"
                                            color="primary"
                                            sx={{ textDecoration: 'none', cursor: 'pointer' }}
                                        >
                                            Forgot password?
                                        </Typography>
                                    </Link>
                                </Box>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    startIcon={<LoginOutlined />}
                                    sx={{ mt: 1, py: 1.5 }}
                                >

                                    Sign In

                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <Divider sx={{ my: 3 }}>OR</Divider>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => signIn('google')}
                            startIcon={<GoogleIcon />}
                            sx={{ py: 1.5 }}
                        >
                            Continue with Google
                        </Button>
                        {/* <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => signIn('github', { callbackUrl })}
                    startIcon={<GitHubIcon />}
                    sx={{ py: 1.5 }}
                >
                    Continue with GitHub
                </Button> */}
                    </Box>

                    {/* <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" passHref>
                        <Typography
                            component="span"
                            color="primary"
                            sx={{ textDecoration: 'none', cursor: 'pointer' }}
                        >
                            Sign up
                        </Typography>
                    </Link>
                </Typography>
            </Box> */}
                </Paper>
            </Container>
        </>
    );
}

// Simple icons for demo purposes
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

// const GitHubIcon = () => (
//     <svg width="20" height="20" viewBox="0 0 24 24">
//         <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
//     </svg>
// );