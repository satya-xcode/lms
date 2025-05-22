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

} from '@mui/material';
import { useState } from 'react';
import { toast } from 'sonner';

type LoadingState = {
    requestId: string;
    actionType: 'approve' | 'reject';
} | null;

export default function PendingLeaveRequests({ requests }: { requests: any }) {
    const [loadingState, setLoadingState] = useState<LoadingState>(null);

    const { approveLeaveRequest, rejectLeaveRequest, isLoading } = useManager({});

    async function handleAction(_id: string, actionType: 'approve' | 'reject') {
        setLoadingState({ requestId: _id, actionType });

        try {
            if (actionType === 'approve') {
                await approveLeaveRequest(_id);
                const res: any = await approveLeaveRequest(_id);
                toast.success(res.message, { richColors: true })

            } else {
                const res: any = await rejectLeaveRequest(_id);
                toast.success(res.message, { richColors: true })

            }
        } catch (err: any) {
            toast.error(err?.message || 'Something went wrong', { richColors: true })

        } finally {
            setLoadingState(null);
        }
    }

    if (requests.length === 0) {
        return <Typography color='error' variant='body2'>No pending leave requests</Typography>;
    }



    return (
        <>

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
                            const isApproving = loadingState?.requestId === request._id &&
                                loadingState?.actionType === 'approve';
                            const isRejecting = loadingState?.requestId === request._id &&
                                loadingState?.actionType === 'reject';

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
                                            disabled={isApproving || isRejecting}
                                            loading={isApproving}
                                            startIcon={<CheckCircle sx={{ color: '#34C759' }} />}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            color="error"
                                            onClick={() => handleAction(request._id, 'reject')}
                                            disabled={isApproving || isRejecting}
                                            sx={{ ml: 1 }}
                                            loading={isRejecting}
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