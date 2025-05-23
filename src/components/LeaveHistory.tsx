'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip
} from '@mui/material';
import { format } from 'date-fns';

interface LeaveRequest {
    _id: string;
    reason: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    manager: {
        name: string;
    };
    createdAt: string;
}

interface LeaveHistoryProps {
    leaves: LeaveRequest[];
}

export default function LeaveHistory({ leaves }: LeaveHistoryProps) {
    if (leaves.length === 0) {
        return <Typography variant='body1' color='error'>No leave history found</Typography>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            default:
                return 'warning';
        }
    };

    return (
        <TableContainer component={Paper} sx={{
            maxHeight: '54vh'
        }} variant='outlined'>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Request Date</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Days</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Approved By</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {leaves.map((leave) => {
                        const start = new Date(leave.startDate);
                        const end = new Date(leave.endDate);
                        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                        return (
                            <TableRow key={leave._id}>
                                <TableCell>
                                    {format(new Date(leave.createdAt), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>{leave.reason}</TableCell>
                                <TableCell>
                                    {format(start, 'MMM dd')} - {format(end, 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>{days} day{days > 1 ? 's' : ''}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={leave.status}
                                        color={getStatusColor(leave.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {leave.status === 'approved' ? leave.manager.name : '-'}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}