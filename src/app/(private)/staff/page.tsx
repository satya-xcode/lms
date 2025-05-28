/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/staff/page.tsx
'use client';

import React from 'react';
import { Box, Container } from '@mui/material';

import LeaveRequestForm from '@/components/LeaveRequestForm';

import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests';
import LeaveDashboard from '@/components/staff/LeaveDashboard';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const StaffDashboard = () => {
    // const { data: session }: any = useSession();
    const router = useRouter();
    const { createStaffLeaveRequest } = useStaffLeaveRequests({})
    const { user } = useCurrentUser();

    const userLimits = {
        halfDayLeaves: user?.monthlyLimits?.halfDayLeaves as number,
        fullDayLeaves: user?.monthlyLimits?.fullDayLeaves as number,
        gatePasses: user?.monthlyLimits?.gatePasses as number,
        latePasses: user?.monthlyLimits?.latePasses as number,
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

                        try {
                            // Transform the data based on type
                            // const requestData = {
                            //     type: values.type,
                            //     reason: values.reason,
                            //     ...(values.type === 'full-day'
                            //         ? {
                            //             startDate: values.startDate,
                            //             endDate: values.endDate
                            //         }
                            //         : {
                            //             startTime: values.startTime,
                            //             endTime: values.endTime
                            //         }
                            //     )
                            // };

                            // await axios.post('/api/leave/requests', requestData);
                            await createStaffLeaveRequest(values)
                            toast.success('Leave request submitted successfully!', { richColors: true });
                            router.refresh(); // Refresh the page to update the leave list
                        } catch (error: any) {
                            toast.error(error.response?.data?.error || 'Failed to submit leave request', { richColors: true });
                            console.error('Submission error:', error);
                        }



                    }}
                    userLimits={userLimits}
                />
            </Box>

        </Container>
    );
};

export default StaffDashboard;