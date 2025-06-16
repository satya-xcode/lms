// components/LeaveRequestForm.tsx
'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
import {
    Alert,
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
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LeaveRequestType } from '@/models/LeaveRequest';
import { leaveRequestSchemas } from '@/utils/leaveRequestSchema';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useStaffLeaves } from '@/hooks/staff/useStaffLeaves';
interface LeaveRequestFormProps {
    onSubmit: (values: unknown) => Promise<void>;
    userLimits: {
        halfDayLeaves: number;
        fullDayLeaves: number;
        gatePasses: number;
        latePasses: number;
    };
}

const StaffLeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onSubmit, userLimits }) => {
    const { user } = useCurrentUser()
    const { data: pendingRequests } = useStaffLeaves({
        staffId: user?.id,
        status: 'pending'
    });

    const [requestType, setRequestType] = useState<LeaveRequestType>('half-day');

    const initialValues = {
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
        const types: { value: LeaveRequestType; label: string; disabled: boolean, warningText: string }[] = [
            {
                value: 'half-day',
                label: `Half Day Leave (${userLimits.halfDayLeaves} remaining)`,
                disabled: userLimits.halfDayLeaves <= 0 || pendingRequests.some((request: { type: string; }) => request.type === 'half-day'),
                warningText: pendingRequests.some((request: { type: string; }) => request.type === 'half-day') ? 'You have a pending half-day leave request.' : '',
            },
            {
                value: 'full-day',
                label: `Full Day Leave (${userLimits.fullDayLeaves} remaining)`,
                disabled: userLimits.fullDayLeaves <= 0 || pendingRequests.some((request: { type: string; }) => request.type === 'full-day'),
                warningText: pendingRequests.some((request: { type: string; }) => request.type === 'full-day') ? 'You have a pending full-day leave request.' : '',
            },
            {
                value: 'additional-leave',
                label: `Additional Leave (No limits)`,
                disabled: pendingRequests.some((request: { type: string; }) => request.type === 'additional-leave'),
                warningText: pendingRequests.some((request: { type: string; }) => request.type === 'additional-leave') ? 'You have a pending additional-leave leave request.' : '',
            },
            {
                value: 'gate-pass',
                label: `Gate Pass (${userLimits.gatePasses} remaining)`,
                disabled: userLimits.gatePasses <= 0 || pendingRequests.some((request: { type: string; }) => request.type === 'gate-pass'),
                warningText: pendingRequests.some((request: { type: string; }) => request.type === 'gate-pass') ? 'You have a pending gate-pass leave request.' : '',
            },
            {
                value: 'late-pass',
                label: `Late Pass (${userLimits.latePasses} remaining)`,
                disabled: userLimits.latePasses <= 0 || pendingRequests.some((request: { type: string; }) => request.type === 'late-pass'),
                warningText: pendingRequests.some((request: { type: string; }) => request.type === 'late-pass') ? 'You have a pending late-pass leave request.' : '',
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
                                // await onSubmit(values);
                                await onSubmit({
                                    ...values,
                                    name: user?.name,
                                    fatherName: user?.fatherName,
                                    empId: user?.empId,
                                    punchId: user?.punchId,
                                    department: user?.department,
                                    role: user?.role,
                                    type: requestType // Ensure we use the current request type
                                });
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
                                                        <Stack>
                                                            <Typography variant='body1'>{type.label}</Typography>
                                                            <small style={{ color: 'red' }}>{type.warningText}</small>
                                                        </Stack>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {requestType === 'additional-leave' && (
                                            <Alert severity="info" sx={{ mt: 2 }}>
                                                Additional leaves require manager approval and have no monthly limits.
                                            </Alert>
                                        )}
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
                                    {(requestType === 'full-day' || requestType === 'additional-leave') && (
                                        <>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <DatePicker
                                                    label="Start Date"
                                                    value={values.startDate}
                                                    onChange={(date) => setFieldValue('startDate', date)}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: touched.startDate && Boolean(errors.startDate),
                                                            helperText: touched.startDate && String(errors.startDate),
                                                            required: true
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
                                                            error: touched.endDate && Boolean(errors.endDate),
                                                            helperText: touched.endDate && String(errors.endDate),
                                                            required: true
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
                                                            error: Boolean(touched.startTime) && Boolean(errors.startTime),
                                                            helperText: touched.startTime && !!errors.startTime,
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
                                                            error: touched?.endTime && Boolean(errors?.endTime),
                                                            helperText: touched?.endTime && String(errors.endTime),
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
                                                color={requestType === 'additional-leave' ? 'success' : 'primary'}
                                                disabled={isSubmitting}
                                                size="large"
                                            >
                                                {isSubmitting ? 'Submitting...' : (
                                                    <>
                                                        {requestType === 'additional-leave' ?
                                                            'Request Additional Leave' : 'Submit Request'}
                                                    </>
                                                )}
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

export default StaffLeaveRequestForm;