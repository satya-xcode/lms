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

type RequestAction = {
    requestId: string;
    actionType: 'approve' | 'reject';
} | null;

export default function PendingLeaveRequests({ requests }: { requests: any }) {
    const [actionState, setActionState] = useState<{
        currentAction: RequestAction;
        error: string | null;
        success: string | null;
    }>({ currentAction: null, error: null, success: null });

    const { approveLeaveRequest, rejectLeaveRequest } = useManager({});

    const handleAction = async (requestId: string, actionType: 'approve' | 'reject') => {
        setActionState({
            currentAction: { requestId, actionType },
            error: null,
            success: null
        });

        try {
            if (actionType === 'approve') {
                await approveLeaveRequest(requestId);
            } else {
                await rejectLeaveRequest(requestId);
            }
            setActionState({
                currentAction: null,
                error: null,
                success: `Leave request ${actionType}d successfully`
            });
        } catch (err: any) {
            setActionState({
                currentAction: null,
                error: err.message || `Failed to ${actionType} leave request`,
                success: null
            });
        }
    };

    if (requests.length === 0) {
        return <Typography color='error' variant='body2'>No pending leave requests</Typography>;
    }

    return (
        <>
            {actionState.error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionState(prev => ({ ...prev, error: null }))}>
                    {actionState.error}
                </Alert>
            )}
            {actionState.success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setActionState(prev => ({ ...prev, success: null }))}>
                    {actionState.success}
                </Alert>
            )}

            <TableContainer component={Paper} variant='outlined'>
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
                        {requests.map((request: any) => {
                            const isProcessing = actionState.currentAction?.requestId === request._id;
                            const processingAction = actionState.currentAction?.actionType;

                            return (
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
                                            disabled={isProcessing}
                                            startIcon={
                                                isProcessing && processingAction === 'approve' ?
                                                    <CircularProgress size={20} /> : null
                                            }
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            color="error"
                                            onClick={() => handleAction(request._id, 'reject')}
                                            disabled={isProcessing}
                                            sx={{ ml: 1 }}
                                            startIcon={
                                                isProcessing && processingAction === 'reject' ?
                                                    <CircularProgress size={20} /> : null
                                            }
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
        </>
    );
}