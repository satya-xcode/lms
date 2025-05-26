/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import LeaveRequestForm from '@/components/LeaveRequestForm'
import { useStaffLeaveBalance } from '@/hooks/useStaffLeaveBalance';
import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests';
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'
import { useSession } from 'next-auth/react';
import React from 'react'

function LeaveFormSection() {
    const { data }: any = useSession()
    const { data: leaveBalance, isLoading: balanceLoading }: any = useStaffLeaveBalance({ staffId: data?.user?.id || '' });
    const { data: staffLeaves } = useStaffLeaveRequests({ staffId: data?.user.id || '' })
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const hasTakenLeaveThisMonth = staffLeaves?.some((request: any) => {
        const requestDate = new Date(request.startDate);
        return (
            request.status === 'approved' &&
            requestDate.getMonth() === currentMonth &&
            requestDate.getFullYear() === currentYear
        );

    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card sx={{}}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Leave Balance
                    </Typography>
                    {balanceLoading ? (
                        <Skeleton variant='rectangular' sx={{ borderRadius: 1 }} height={20} />
                    ) : (
                        <Typography variant='body1' color={leaveBalance > 0 ? 'success' : 'error'}>
                            {leaveBalance > 0 ?
                                `You have ${leaveBalance} free leave(s) remaining this month` :
                                'You have no free leaves remaining this month'}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {
                leaveBalance > 0 && !hasTakenLeaveThisMonth && (
                    <Card sx={{}}>
                        <CardContent>
                            <LeaveRequestForm />
                        </CardContent>
                    </Card>
                )
            }


            {
                leaveBalance <= 0 && (
                    <Card sx={{}}>
                        <CardContent>
                            <Typography variant='h6' color='success' fontWeight={'bold'}>Apply for additional leaves</Typography>
                            <LeaveRequestForm />
                        </CardContent>
                    </Card>
                )
            }

        </Box>
    )
}

export default LeaveFormSection