/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getSession, signIn } from 'next-auth/react';
import { Box, Button, Divider, Paper, TextField, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getRedirectPathByRole } from '@/utils/redirectByRole';
import { useRouter } from 'next/navigation';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required(),
    password: Yup.string().required(),
});

function LoginForm() {
    const router = useRouter();
    return (
        <Box mt={8} component={Paper} variant='elevation' p={4}>
            <Typography variant="h4" mb={2}>Login</Typography>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    const res = await signIn('credentials', {
                        redirect: false,
                        ...values,
                    });

                    if (res?.error) {
                        setErrors({ email: 'Invalid email or password' });
                    } else {

                        const session: any = await getSession();
                        const role = session?.user?.role;
                        router.replace(getRedirectPathByRole(role));

                    }
                    setSubmitting(false);
                }}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Field as={TextField} name="email" label="Email" fullWidth margin="normal"
                            error={!!errors.email && touched.email} helperText={touched.email && errors.email} />
                        <Field as={TextField} name="password" label="Password" type="password" fullWidth margin="normal"
                            error={!!errors.password && touched.password} helperText={touched.password && errors.password} />
                        <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>Login</Button>
                    </Form>
                )}
            </Formik>
            <Divider sx={{ my: 2 }}>or</Divider>
            <Button variant="outlined" fullWidth onClick={() => signIn('google')}>
                Sign in with Google
            </Button>
        </Box>
    )
}

export default LoginForm