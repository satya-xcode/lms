/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/staff/page.tsx
'use client';

import React from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';

import LeaveRequestForm from '@/components/LeaveRequestForm';

import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests';
import { useSession } from 'next-auth/react';
import LeaveDashboard from '@/components/staff/LeaveDashboard';
import LeaveRequestList from '@/components/staff/LeaveRequestList';

const StaffDashboard = () => {
    const { data: session }: any = useSession();
    const [tabValue, setTabValue] = React.useState(0);
    // Fetch pending and approved requests
    const { data: pendingRequests } = useStaffLeaveRequests({
        staffId: session?.user?.id,
        status: 'pending'
    });

    const { data: approvedRequests } = useStaffLeaveRequests({
        staffId: session?.user?.id,
        status: 'approved'
    });

    const { data: rejectedRequests } = useStaffLeaveRequests({
        staffId: session?.user?.id,
        status: 'rejected'
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    console.log(
        "StaffData", session?.user
    )
    const userLimits = {
        halfDayLeaves: session?.user?.monthlyLimits?.halfDayLeaves || 2,
        fullDayLeaves: session?.user?.monthlyLimits?.fullDayLeaves || 1,
        gatePasses: session?.user?.monthlyLimits?.gatePasses || 2,
        latePasses: session?.user?.monthlyLimits?.latePasses || 2,
    };

    const totalLimits = {
        halfDayLeaves: 2,
        fullDayLeaves: 1,
        gatePasses: 2,
        latePasses: 2,
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <LeaveDashboard
                    userLimits={userLimits}
                    totalLimits={totalLimits}
                />
            </Box>

            <Box sx={{ mb: 4 }}>
                <LeaveRequestForm
                    onSubmit={async (values) => {
                        // You'll need to implement this using your API client
                        // This is just a placeholder
                        console.log('Submitting:', values);
                    }}
                    userLimits={userLimits}
                />
            </Box>

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
        </Container>
    );
};

export default StaffDashboard;