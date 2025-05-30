/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import LeaveRequestForm from '@/components/staff/StaffLeaveRequestForm'
import { Box } from '@mui/material';
import React from 'react'
// import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LeaveRequestFormValues } from '@/utils/leaveRequestSchema';
import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests';
import { useCurrentUser } from '@/hooks/useCurrentUser';

function LeaveFormSection() {
    const { user } = useCurrentUser()

    const { createStaffLeaveRequest } = useStaffLeaveRequests({})
    const router = useRouter();

    // Handle form submission
    const handleSubmit = async (values: LeaveRequestFormValues) => {
        try {
            const res = await createStaffLeaveRequest(values)
            toast.success(res.message, { richColors: true });
            router.refresh(); // Refresh the page to update the leave list
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to submit leave request');
            console.error('Submission error:', error);
        }
    };

    // Get user limits from session data or use defaults
    const userLimits = {
        halfDayLeaves: user?.monthlyLimits?.halfDayLeaves as number,
        fullDayLeaves: user?.monthlyLimits?.fullDayLeaves as number,
        gatePasses: user?.monthlyLimits?.gatePasses as number,
        latePasses: user?.monthlyLimits?.latePasses as number,
    };

    return (
        <LeaveRequestForm
            onSubmit={handleSubmit}
            userLimits={userLimits}
        />
    )
}

export default LeaveFormSection