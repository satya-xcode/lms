
'use client'
import { Box, Stack, Tab, Tabs } from '@mui/material'
import React from 'react'
import LeaveRequestList from '@/components/staff/StaffLeaveRequestList'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import theme from '@/theme/theme'
import { useStaffLeaves } from '@/hooks/staff/useStaffLeaves'

function LeaveRequesthistory() {

    const { user } = useCurrentUser();
    const [tabValue, setTabValue] = React.useState(0);
    // Fetch pending and approved requests
    const { data: pendingRequests } = useStaffLeaves({
        staffId: user?.id,
        status: 'pending'
    });

    const { data: approvedRequests } = useStaffLeaves({
        staffId: user?.id,
        status: 'approved'
    });

    const { data: rejectedRequests } = useStaffLeaves({
        staffId: user?.id,
        status: 'rejected'
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };


    return (
        <Stack spacing={theme.spacing(2)}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Pending Requests" />
                    <Tab label="Approved Requests" />
                    <Tab label="Rejected Requests" />
                </Tabs>
            </Box>

            <Box sx={{}}>
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