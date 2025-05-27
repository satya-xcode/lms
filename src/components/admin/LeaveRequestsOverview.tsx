/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/LeaveRequestsOverview.tsx
'use client';
import React from 'react';
import {

    Card,
    CardContent,
    Chip,
    Divider,

    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import { format } from 'date-fns';
import { toast } from 'sonner';

const LeaveRequestsOverview = () => {
    const { data: session }: any = useSession();
    const [leaveRequests, setLeaveRequests] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const { data } = await axios.get('/api/leave/requests?status=all');
                setLeaveRequests(data.data);
            } catch (error: any) {
                console.error(error);
                toast.error('Failed to fetch leave requests');
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.role === 'admin') {
            fetchLeaveRequests();
        }
    }, [session]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'warning';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'half-day': return 'Half Day';
            case 'full-day': return 'Full Day';
            case 'gate-pass': return 'Gate Pass';
            case 'late-pass': return 'Late Pass';
            default: return type;
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    All Leave Requests
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Staff</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Dates</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Manager</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : leaveRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No leave requests found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leaveRequests.map((request) => (
                                    <TableRow key={request._id}>
                                        <TableCell>
                                            {request.staff?.name || 'Unknown'}
                                            <Typography variant="body2" color="textSecondary">
                                                {request.staff?.department || ''}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={getTypeLabel(request.type)} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(request.startDate), 'MMM dd, yyyy')}
                                            {request.type !== 'full-day' && (
                                                <>
                                                    <br />
                                                    {format(new Date(request.startDate), 'hh:mm a')} -{' '}
                                                    {format(new Date(request.endDate), 'hh:mm a')}
                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography noWrap sx={{ maxWidth: 200 }}>
                                                {request.reason}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.status}
                                                color={getStatusColor(request.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {request.manager?.name || 'None'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default LeaveRequestsOverview;