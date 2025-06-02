/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/staff/page.tsx
'use client';
import React from 'react';
import { Stack } from '@mui/material';
import LeaveRequestForm from '@/components/staff/StaffLeaveRequestForm';
import StaffLeaveDashboard from '@/components/staff/StaffLeaveDashboard';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import theme from '@/theme/theme';
import { useStaffLeaves } from '@/hooks/staff/useStaffLeaves';

const StaffDashboard = () => {
    // const { data: session }: any = useSession();
    const router = useRouter();
    const { createStaffLeaveRequest } = useStaffLeaves({})
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
        <Stack spacing={theme.spacing(2)}>
            <StaffLeaveDashboard
                userLimits={userLimits}
                totalLimits={totalLimits}
            />
            <LeaveRequestForm
                onSubmit={async (values) => {
                    try {
                        const res = await createStaffLeaveRequest(values)
                        toast.success(res.message, { richColors: true });
                        router.refresh(); // Refresh the page to update the leave list
                    } catch (error: any) {
                        toast.error(error.response?.data?.error || 'Failed to submit leave request', { richColors: true });
                        console.error('Submission error:', error);
                    }
                }}
                userLimits={userLimits}
            />
        </Stack>
    );
};

export default StaffDashboard;