/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useManager } from '@/hooks/useManager';
import { Cancel, CheckCircle } from '@mui/icons-material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Chip,
    Box
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'sonner';
import { format, formatDistance, formatDuration, intervalToDuration } from 'date-fns';

type LoadingState = {
    requestId: string;
    actionType: 'approve' | 'reject';
} | null;

const getLeaveTypeDetails = (request: any) => {
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);

    switch (request.type) {
        case 'half-day':
            return {
                label: 'Half Day',
                color: 'primary',
                duration: `${format(startDate, 'hh:mm a')} - ${format(endDate, 'hh:mm a')}`,
                details: `Total: ${formatDistance(startDate, endDate)}`
            };
        case 'full-day':
            return {
                label: 'Full Day',
                color: 'secondary',
                duration: format(startDate, 'PP'),
                details: request.startDate === request.endDate
                    ? '1 day'
                    : `${formatDistance(startDate, endDate)} (${format(startDate, 'PP')} - ${format(endDate, 'PP')})`
            };
        case 'additional-leave':
            return {
                label: 'Additional Leave',
                color: 'success',
                duration: `${format(startDate, 'PP')} - ${format(endDate, 'PP')}`,
                details: `Total: ${formatDistance(startDate, endDate)}`,
            };
        case 'gate-pass':
            const gatePassDuration = intervalToDuration({ start: startDate, end: endDate });
            return {
                label: 'Gate Pass',
                color: 'info',
                duration: `${format(startDate, 'hh:mm a')} - ${format(endDate, 'hh:mm a')}`,
                details: `Duration: ${gatePassDuration.hours}h`
            };
        case 'late-pass':
            const latePassDuration = intervalToDuration({ start: startDate, end: endDate });
            return {
                label: 'Late Pass',
                color: 'warning',
                duration: `${format(startDate, 'hh:mm a')} - ${format(endDate, 'hh:mm a')}`,
                details: `Late by: ${latePassDuration.minutes}m`
            };
        default:
            return {
                label: request.type,
                color: 'default',
                duration: `${format(startDate, 'PP')} - ${format(endDate, 'PP')}`,
                details: ''
            };
    }
};

export default function PendingLeaveRequests({ requests }: { requests: any }) {
    const [loadingState, setLoadingState] = useState<LoadingState>(null);
    const { approveLeaveRequest, rejectLeaveRequest } = useManager({});

    async function handleAction(_id: string, actionType: 'approve' | 'reject', requestType: string) {
        setLoadingState({ requestId: _id, actionType });
        try {
            if (actionType === 'approve') {
                const res: any = await approveLeaveRequest(_id, requestType);
                toast.success(res.message, { richColors: true });
            } else {
                const res: any = await rejectLeaveRequest(_id);
                toast.success(res.message, { richColors: true });
            }
        } catch (err: any) {
            toast.error(err?.message || 'Something went wrong', { richColors: true });
        } finally {
            setLoadingState(null);
        }
    }

    if (requests.length === 0) {
        return <Alert severity="info">No pending leave requests</Alert>;
    }

    return (
        <TableContainer component={Paper} variant='outlined'>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Staff</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Date/Time</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {requests.map((request: any) => {
                        const { label, color, duration, details } = getLeaveTypeDetails(request);
                        const isApproving = loadingState?.requestId === request._id &&
                            loadingState?.actionType === 'approve';
                        const isRejecting = loadingState?.requestId === request._id &&
                            loadingState?.actionType === 'reject';
                        return (
                            <TableRow key={request._id}>
                                <TableCell>
                                    <Box>
                                        <Typography fontWeight="medium">{request.staff.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {request.staff.department}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip label={label} color={color} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Typography noWrap sx={{ maxWidth: 200 }}>
                                        {request.reason}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {duration}

                                </TableCell>
                                <TableCell>
                                    {details}
                                    {/* {request.totalHours} */}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        onClick={() => handleAction(request?._id, 'approve', request?.type)}
                                        disabled={isApproving || isRejecting}
                                        startIcon={isApproving ? <CircularProgress size={16} /> : <CheckCircle />}
                                        size="small"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleAction(request._id, 'reject', request.type)}
                                        disabled={isApproving || isRejecting}
                                        sx={{ ml: 1 }}
                                        startIcon={isRejecting ? <CircularProgress size={16} /> : <Cancel />}
                                        size="small"
                                    >
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}