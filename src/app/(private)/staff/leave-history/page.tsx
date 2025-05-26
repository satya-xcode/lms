/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import LeaveHistory from '@/components/LeaveHistory'
import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests'
import { Card, CardContent, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import React from 'react'

function LeaveRequesthistory() {
    const { data }: any = useSession()
    const [alignment, setAlignment] = React.useState('pending');

    const handleChange = (event: any, newAlignment: React.SetStateAction<string>) => {
        setAlignment(newAlignment);
    };
    const { data: staffLeaves, isLoading: requestsLoading } = useStaffLeaveRequests({ staffId: data?.user.id || '', status: alignment })
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
                    <LeaveHistory leaves={staffLeaves || []} />
                )}
            </CardContent>
        </Card>
    )
}

export default LeaveRequesthistory