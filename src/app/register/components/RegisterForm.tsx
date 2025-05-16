/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    mobile: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6).required('Required'),
});

function RegisterForm() {
    const router = useRouter()
    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" mb={4}>
                Please enter your credentials to continue
            </Typography>
            <Formik
                initialValues={{ name: '', mobile: '', email: '', password: '' }}
                validationSchema={RegisterSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                        const res = await fetch('/api/register', {
                            method: 'POST',
                            body: JSON.stringify(values),
                        });

                        if (!res.ok) {
                            const data = await res.json();
                            setErrors({ email: data.error || 'Registration failed' });
                        } else {
                            router.push('/login');
                        }
                    } catch (err) {
                        setErrors({ email: 'Something went wrong' });
                    } finally {
                        setSubmitting(false);
                    }

                }}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Field as={TextField} name="name" label="Name" fullWidth margin="normal"
                            error={!!errors.name && touched.name} helperText={touched.name && errors.name} />
                        <Field as={TextField} name="mobile" label="Mobile" fullWidth margin="normal"
                            error={!!errors.mobile && touched.mobile} helperText={touched.mobile && errors.mobile} />
                        <Field as={TextField} name="email" label="Email" fullWidth margin="normal"
                            error={!!errors.email && touched.email} helperText={touched.email && errors.email} />
                        <Field as={TextField} name="password" label="Password" type="password" fullWidth margin="normal"
                            error={!!errors.password && touched.password} helperText={touched.password && errors.password} />
                        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Paper>
    )
}

export default RegisterForm