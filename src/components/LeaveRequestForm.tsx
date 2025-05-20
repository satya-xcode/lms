/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Button,
    Stack,
    Typography,
    Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
    reason: Yup.string()
        .required('Reason is required')
        .min(4, 'Reason must be at least 4 characters'),
    startDate: Yup.date()
        .required('Start date is required')
        .typeError('Please enter a valid date'),
    endDate: Yup.date()
        .required('End date is required')
        .min(
            Yup.ref('startDate'),
            'End date must be after start date'
        )
        .typeError('Please enter a valid date')
});

export default function LeaveRequestForm() {
    const { createStaffLeaveRequest } = useStaffLeaveRequests({});
    const [submitStatus, setSubmitStatus] = useState<{
        error?: string;
        success?: boolean;
    }>({});

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Formik
                initialValues={{
                    reason: '',
                    startDate: new Date,
                    endDate: new Date
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                    try {
                        await createStaffLeaveRequest({
                            reason: values.reason,
                            startDate: values.startDate,
                            endDate: values.endDate
                        });
                        setSubmitStatus({ success: true });
                        resetForm();
                    } catch (error: any) {
                        setSubmitStatus({
                            error: error.message || 'Failed to submit leave request'
                        });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <Typography variant="body1" color='textSecondary'>Request Leave</Typography>

                            {submitStatus.error && (
                                <Alert severity="error">{submitStatus.error}</Alert>
                            )}

                            {submitStatus.success && (
                                <Alert severity="success">
                                    Leave request submitted successfully!
                                </Alert>
                            )}

                            <Field
                                as={TextField}
                                name="reason"
                                label="Reason for Leave"
                                multiline
                                rows={4}
                                fullWidth
                                error={touched.reason && Boolean(errors.reason)}
                                helperText={touched.reason && errors.reason}
                            />

                            <DatePicker
                                label="Start Date"
                                value={values.startDate}
                                onChange={(newValue) => setFieldValue('startDate', newValue)}
                                slotProps={{
                                    textField: {
                                        error: touched.startDate && Boolean(errors.startDate),
                                        helperText: Boolean(touched.startDate) && Boolean(errors.startDate),
                                    },
                                }}
                            />

                            <DatePicker
                                label="End Date"
                                value={values.endDate}
                                onChange={(newValue) => setFieldValue('endDate', newValue)}
                                slotProps={{
                                    textField: {
                                        error: touched.endDate && Boolean(errors.endDate),
                                        helperText: Boolean(touched.endDate) && Boolean(errors.endDate),
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </LocalizationProvider>
    );
}
