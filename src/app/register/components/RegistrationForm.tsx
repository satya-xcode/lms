/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Container,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Select,
    FormHelperText
} from '@mui/material';

interface Manager {
    _id: string;
    name: string;
}

interface RegistrationFormProps {
    managers: Manager[];
}


const RegistrationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Invalid mobile number')
        .required('Required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
            'Password must contain uppercase, lowercase, number and special character'
        )
        .required('Required'),
    department: Yup.string().required('Required'),
    managerId: Yup.string().nullable()
});

export default function RegistrationForm({ managers }: RegistrationFormProps) {
    const router = useRouter();

    const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error.includes('Email')) {
                    setErrors({ email: data.error });
                } else {
                    setErrors({ form: data.error });
                }
                return;
            }

            router.push('/login');
        } catch (error) {
            setErrors({ form: 'Registration failed. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    mobile: '',
                    password: '',
                    department: '',
                    managerId: ''
                }}
                validationSchema={RegistrationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h4" gutterBottom>
                                Staff Registration
                            </Typography>

                            {/* {errors.form && (
                                <Typography color="error" gutterBottom>
                                    {errors.form}
                                </Typography>
                            )} */}

                            <Field name="name">
                                {({ field, meta }: any) => (
                                    <TextField
                                        {...field}
                                        label="Full Name"
                                        fullWidth
                                        margin="normal"
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error}
                                    />
                                )}
                            </Field>

                            <Field name="email">
                                {({ field, meta }: any) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        margin="normal"
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error}
                                    />
                                )}
                            </Field>

                            <Field name="mobile">
                                {({ field, meta }: any) => (
                                    <TextField
                                        {...field}
                                        label="Mobile Number"
                                        fullWidth
                                        margin="normal"
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error}
                                    />
                                )}
                            </Field>

                            <Field name="password">
                                {({ field, meta }: any) => (
                                    <TextField
                                        {...field}
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        margin="normal"
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error}
                                    />
                                )}
                            </Field>

                            <Field name="department">
                                {({ field, meta }: any) => (
                                    <TextField
                                        {...field}
                                        label="Department"
                                        fullWidth
                                        margin="normal"
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error}
                                    />
                                )}
                            </Field>

                            <FormControl fullWidth margin="normal" error={!!errors?.managerId}>
                                <InputLabel>Manager (Optional)</InputLabel>
                                <Field
                                    name="managerId"
                                    as={Select}
                                    label="Manager (Optional)"
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {managers.map((manager) => (
                                        <MenuItem key={manager._id} value={manager._id}>
                                            {manager.name}
                                        </MenuItem>
                                    ))}
                                </Field>
                                <ErrorMessage name="managerId" component={FormHelperText} />
                            </FormControl>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}