/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/admin/page.tsx
'use client';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import StaffManagement from '@/components/admin/StaffManagement';

import { useSession } from 'next-auth/react';
import React from 'react';
import LeaveRequestsOverview from '@/components/admin/LeaveRequestsOverview';

const AdminDashboard = () => {
    const { data: session }: any = useSession();
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!session || session.user.role !== 'admin') {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">Unauthorized Access</Typography>
                    <Typography>You don&apos;t have permission to view this page.</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Staff Management" />
                    <Tab label="Leave Requests" />
                    <Tab label="Reports" />
                </Tabs>
            </Box>

            {tabValue === 0 && <StaffManagement />}
            {tabValue === 1 && <LeaveRequestsOverview />}
            {tabValue === 2 && (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6">Reports (Coming Soon)</Typography>
                </Box>
            )}
        </Container>
    );
};

export default AdminDashboard;