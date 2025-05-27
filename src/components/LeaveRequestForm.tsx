// components/LeaveRequestForm.tsx
'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LeaveRequestType } from '@/models/LeaveRequest';
import { LeaveRequestFormValues, leaveRequestSchemas } from '@/utils/leaveRequestSchema';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
interface LeaveRequestFormProps {
    onSubmit: (values: LeaveRequestFormValues) => Promise<void>;
    userLimits: {
        halfDayLeaves: number;
        fullDayLeaves: number;
        gatePasses: number;
        latePasses: number;
    };
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onSubmit, userLimits }) => {
    const [requestType, setRequestType] = useState<LeaveRequestType>('half-day');

    const initialValues: LeaveRequestFormValues = {
        type: 'half-day',
        reason: '',
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), // Default to 4 hours later
    };

    const getValidationSchema = () => {
        return leaveRequestSchemas[requestType];
    };

    const getAvailableTypes = () => {
        const types: { value: LeaveRequestType; label: string; disabled: boolean }[] = [
            {
                value: 'half-day',
                label: `Half Day Leave (${userLimits.halfDayLeaves} remaining)`,
                disabled: userLimits.halfDayLeaves <= 0
            },
            {
                value: 'full-day',
                label: `Full Day Leave (${userLimits.fullDayLeaves} remaining)`,
                disabled: userLimits.fullDayLeaves <= 0
            },
            {
                value: 'gate-pass',
                label: `Gate Pass (${userLimits.gatePasses} remaining)`,
                disabled: userLimits.gatePasses <= 0
            },
            {
                value: 'late-pass',
                label: `Late Pass (${userLimits.latePasses} remaining)`,
                disabled: userLimits.latePasses <= 0
            },
        ];
        return types;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        New Leave Request
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Formik
                        initialValues={initialValues}
                        validationSchema={getValidationSchema()}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                await onSubmit(values);
                                resetForm();
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
                            <Form>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="request-type-label">Request Type</InputLabel>
                                            <Select
                                                labelId="request-type-label"
                                                id="type"
                                                name="type"
                                                value={requestType}
                                                onChange={(e) => {
                                                    const newType = e.target.value as LeaveRequestType;
                                                    setRequestType(newType);
                                                    setFieldValue('type', newType);
                                                }}
                                                label="Request Type"
                                            >
                                                {getAvailableTypes().map((type) => (
                                                    <MenuItem
                                                        key={type.value}
                                                        value={type.value}
                                                        disabled={type.disabled}
                                                    >
                                                        {type.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Field
                                            as={TextField}
                                            name="reason"
                                            label="Reason"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            error={touched.reason && !!errors.reason}
                                            helperText={<ErrorMessage name="reason" />}
                                        />
                                    </Grid>

                                    {requestType === 'full-day' && (
                                        <>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={values.startDate}
                                                    onChange={(date) => setFieldValue('startDate', date)}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: touched.startDate && !!errors.startDate,
                                                            helperText: touched.startDate && errors.startDate,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <DatePicker
                                                    label="End Date"
                                                    value={values.endDate}
                                                    onChange={(date) => setFieldValue('endDate', date)}
                                                    minDate={values.startDate}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: touched.endDate && !!errors.endDate,
                                                            helperText: touched.endDate && errors.endDate,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}

                                    {(requestType === 'half-day' || requestType === 'gate-pass' || requestType === 'late-pass') && (
                                        <>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <DateTimePicker
                                                    label="Start Time"
                                                    value={values.startTime}
                                                    onChange={(date) => setFieldValue('startTime', date)}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: touched.startTime && !!errors.startTime,
                                                            helperText: touched.startTime && errors.startTime,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <DateTimePicker
                                                    label="End Time"
                                                    value={values.endTime}
                                                    onChange={(date) => setFieldValue('endTime', date)}
                                                    minDateTime={values.startTime}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: touched.endTime && !!errors.endTime,
                                                            helperText: touched.endTime && errors.endTime,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}

                                    <Grid size={{ xs: 12 }}>
                                        <Box display="flex" justifyContent="flex-end">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
};

export default LeaveRequestForm;