/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    IconButton,
    Stack,
    Card,
    CardContent
} from '@mui/material';
import { useStaffsByManagers } from '@/hooks/manager/useStaffsByManagers';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ArrowBackIosNew } from '@mui/icons-material';
import theme from '@/theme/theme';

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
        .min(6, 'Password must be at least 8 characters')
        // .matches(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        //     'Password must contain uppercase, lowercase, number and special character'
        // )
        .required('Required'),
    department: Yup.string().required('Required')
});

export default function RegistrationForm() {
    const { user } = useCurrentUser()
    const { addStaff } = useStaffsByManagers({})
    const router = useRouter();

    const handleSubmit = async (values: any, { setSubmitting, setErrors, resetForm }: any) => {
        try {
            await addStaff({ ...values, managerId: user?.id })
            resetForm()
            router.back()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: any) {
            setErrors({ form: 'Registration failed. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Card>
                <CardContent>

                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            mobile: '',
                            password: '',
                            department: ''
                        }}
                        validationSchema={RegistrationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <Box sx={{}}>
                                    <Stack direction={'row'} alignItems={'center'} spacing={theme.spacing(2)}>
                                        <IconButton onClick={() => router.back()}>
                                            <ArrowBackIosNew />
                                        </IconButton>
                                        <Typography variant="h4" gutterBottom>
                                            Add Staff
                                        </Typography>
                                    </Stack>


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

                </CardContent>
            </Card>
        </Container>
    );
}