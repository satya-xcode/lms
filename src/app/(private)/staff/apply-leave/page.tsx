/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import LeaveRequestForm from '@/components/LeaveRequestForm'
import { Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import React from 'react'
// import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LeaveRequestFormValues } from '@/utils/leaveRequestSchema';
import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests';

function LeaveFormSection() {
    const { data }: any = useSession()
    const { createStaffLeaveRequest } = useStaffLeaveRequests({})
    const router = useRouter();

    // Handle form submission
    const handleSubmit = async (values: LeaveRequestFormValues) => {
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
            toast.success('Leave request submitted successfully!');
            router.refresh(); // Refresh the page to update the leave list
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to submit leave request');
            console.error('Submission error:', error);
        }
    };

    // Get user limits from session data or use defaults
    const userLimits = {
        halfDayLeaves: data?.user?.monthlyLimits?.halfDayLeaves || 2,
        fullDayLeaves: data?.user?.monthlyLimits?.fullDayLeaves || 1,
        gatePasses: data?.user?.monthlyLimits?.gatePasses || 2,
        latePasses: data?.user?.monthlyLimits?.latePasses || 2,
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LeaveRequestForm
                onSubmit={handleSubmit}
                userLimits={userLimits}
            />
        </Box>
    )
}

export default LeaveFormSection