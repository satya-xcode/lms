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

} from '@mui/material';
import { useState } from 'react';

type RequestAction = {
    requestId: string;
    actionType: 'approve' | 'reject';
} | null;

export default function PendingLeaveRequests({ requests }: { requests: any }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const [actionState, setActionState] = useState<{
        currentAction: RequestAction;
        error: string | null;
        success: string | null;
    }>({ currentAction: null, error: null, success: null });

    const { approveLeaveRequest, rejectLeaveRequest, isLoading } = useManager({});


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

                            async function onApprovedHandler(_id: string) {
                                setLoadingId(_id);
                                try {
                                    await approveLeaveRequest(_id);
                                    setActionState({ currentAction: null, error: null, success: 'Leave approved successfully' });
                                } catch (err) {
                                    setActionState({ currentAction: null, error: 'Failed to approve leave', success: null });
                                } finally {
                                    setLoadingId(null);
                                }
                            }

                            async function onRejectedHandler(_id: any): Promise<void> {
                                setLoadingId(_id);
                                try {
                                    await rejectLeaveRequest(_id);
                                    setActionState({ currentAction: null, error: null, success: 'Leave rejected successfully' });
                                } catch (err) {
                                    setActionState({ currentAction: null, error: 'Failed to  leave', success: null });
                                } finally {
                                    setLoadingId(null);
                                }
                            }

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
                                            onClick={() => onApprovedHandler(request._id)}
                                            // disabled={isProcessing}
                                            loading={loadingId === request._id}
                                            startIcon={<CheckCircle sx={{ color: '#34C759' }} />}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            color="error"
                                            onClick={() => onRejectedHandler(request._id)}
                                            // disabled={isProcessing}
                                            sx={{ ml: 1 }}
                                            startIcon={<Cancel sx={{ color: '#FF3B3F' }} />}
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