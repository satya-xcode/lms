/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests'
import { Card, CardContent, Chip, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import React from 'react'
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

function LeaveRequesthistory() {
    const { data }: any = useSession()
    const [alignment, setAlignment] = React.useState('pending');

    const handleChange = (event: any, newAlignment: React.SetStateAction<string>) => {
        setAlignment(newAlignment);
    };
    const { data: staffLeaves, isLoading: requestsLoading } = useStaffLeaveRequests({ staffId: data?.user.id || '', status: alignment })
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
        <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography variant="h6" gutterBottom>
                        Your Leave History
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={alignment}
                        exclusive
                        size='small'
                        onChange={handleChange}
                        aria-label="Platform"
                    >
                        <ToggleButton color='warning' value="pending">Pending</ToggleButton>
                        <ToggleButton color='success' value="approved">Approved</ToggleButton>
                        <ToggleButton color='error' value="rejected">Rejected</ToggleButton>
                    </ToggleButtonGroup>

                </Stack>

                {requestsLoading ? (
                    <Stack spacing={1}>
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                    </Stack>
                ) : (

                    staffLeaves.length === 0) ?
                    <Typography variant='body1' color='error'>No leave history found</Typography>
                    :
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
                                {staffLeaves.map((leave: LeaveRequest) => {
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
                }
            </CardContent>
        </Card>
    )
}

export default LeaveRequesthistory