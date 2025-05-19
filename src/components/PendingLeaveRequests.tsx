/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useManager } from '@/hooks/useManager';
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
    CircularProgress
} from '@mui/material';

import { useState } from 'react';

export default function PendingLeaveRequests({ requests }: { requests: any }) {
    const [actionState, setActionState] = useState<{
        loading: boolean;
        error: string | null;
        success: string | null;
    }>({ loading: false, error: null, success: null });

    const { approveLeaveRequest, rejectLeaveRequest, isLoading } = useManager({});

    const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
        setActionState({ loading: true, error: null, success: null });

        try {
            if (action === 'approve') {
                await approveLeaveRequest(requestId);
            } else {
                await rejectLeaveRequest(requestId);
            }
            setActionState({ loading: false, error: null, success: `Leave request ${action}d successfully` });
        } catch (err: any) {
            setActionState({ loading: false, error: err.message, success: null });
        }
    };

    if (requests.length === 0) {
        return <Typography>No pending leave requests</Typography>;
    }

    return (
        <>
            {actionState.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {actionState.error}
                </Alert>
            )}
            {actionState.success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {actionState.success}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Staff Name</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request: any) => (
                            <TableRow key={request._id}>
                                <TableCell>{request.staff.name}</TableCell>
                                <TableCell>{request.staff.department}</TableCell>
                                <TableCell>{request.reason}</TableCell>
                                <TableCell>
                                    {new Date(request.startDate).toLocaleDateString()} - {' '}
                                    {new Date(request.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        color="success"
                                        onClick={() => handleAction(request._id, 'approve')}
                                        disabled={isLoading}
                                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => handleAction(request._id, 'reject')}
                                        disabled={isLoading}
                                        sx={{ ml: 1 }}
                                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                                    >
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}