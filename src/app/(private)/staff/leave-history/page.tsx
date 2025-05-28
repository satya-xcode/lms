/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests'
import { Box, Stack, Tab, Tabs } from '@mui/material'
import React from 'react'
import LeaveRequestList from '@/components/staff/LeaveRequestList'
import { useCurrentUser } from '@/hooks/useCurrentUser'

function LeaveRequesthistory() {

    const { user } = useCurrentUser();
    const [tabValue, setTabValue] = React.useState(0);
    // Fetch pending and approved requests
    const { data: pendingRequests } = useStaffLeaveRequests({
        staffId: user?.id,
        status: 'pending'
    });

    const { data: approvedRequests } = useStaffLeaveRequests({
        staffId: user?.id,
        status: 'approved'
    });

    const { data: rejectedRequests } = useStaffLeaveRequests({
        staffId: user?.id,
        status: 'rejected'
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };


    return (
        <Stack>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Pending Requests" />
                    <Tab label="Approved Requests" />
                    <Tab label="Rejected Requests" />
                </Tabs>
            </Box>

            <Box sx={{ pt: 3 }}>
                {tabValue === 0 && (
                    <LeaveRequestList requests={pendingRequests} status="pending" />
                )}
                {tabValue === 1 && (
                    <LeaveRequestList requests={approvedRequests} status="approved" />
                )}
                {tabValue === 2 && (
                    <LeaveRequestList requests={rejectedRequests} status="rejected" />
                )}
            </Box>
        </Stack>
    )
}

export default LeaveRequesthistory