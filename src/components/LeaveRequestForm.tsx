/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
    TextField,
    Button,
    Stack,
    Typography,
    Alert
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { useLeaveMutations } from '@/hooks/useMutateApi';
import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests';

export default function LeaveRequestForm() {
    const [reason, setReason] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // const { createLeaveRequest } = useLeaveMutations();
    const { createStaffLeaveRequest } = useStaffLeaveRequests({})

    const handleSubmit = async () => {
        if (!reason || !startDate || !endDate) {
            setError('All fields are required');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess(false);

        try {
            await createStaffLeaveRequest({
                reason,
                startDate,
                endDate
            });
            setSuccess(true);
            setReason('');
            setStartDate(null);
            setEndDate(null);
        } catch (err: any) {
            setError(err.message || 'Failed to submit leave request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
                <Typography variant="h6">Request Leave</Typography>

                {error && (
                    <Alert severity="error">{error}</Alert>
                )}

                {success && (
                    <Alert severity="success">Leave request submitted successfully!</Alert>
                )}

                <TextField
                    label="Reason for Leave"
                    multiline
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                />

                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                />

                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                />

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
            </Stack>
        </LocalizationProvider>
    );
}