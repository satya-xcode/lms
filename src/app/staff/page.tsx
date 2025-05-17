/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Typography, Card, CardContent, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useStaffLeaveRequests, useLeaveBalance } from '@/hooks/useApiRequest';
import { useRouter } from 'next/navigation';
import LoadingProgress from '@/components/LoadingProgress';
import AccessRestricted from '@/components/AccessRestricted';
// import { useLeaveMutations } from '@/hooks/useMutateApi';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveHistory from '@/components/LeaveHistory';

export default function DashboardPage() {
    const router = useRouter()
    const { status, data }: any = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/unauthorized');
        },
    })
    // console.log('Daaaaa', data)
    const { data: leaveRequests, isLoading: requestsLoading }: any = useStaffLeaveRequests(data?.user.id || '');
    const { data: leaveBalance, isLoading: balanceLoading }: any = useLeaveBalance(data?.user.id || '');
    // const { createLeaveRequest } = useLeaveMutations();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const hasTakenLeaveThisMonth = leaveRequests?.some((request: any) => {
        const requestDate = new Date(request.startDate);
        return (
            request.status === 'approved' &&
            requestDate.getMonth() === currentMonth &&
            requestDate.getFullYear() === currentYear
        );

    });

    if (status === 'loading') {
        return <LoadingProgress />
    }
    if (data?.user?.role !== 'staff') {
        return (
            <AccessRestricted />
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Staff Dashboard
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Leave Balance
                    </Typography>
                    {balanceLoading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <Typography>
                            {leaveBalance?.leaveBalance > 0 ?
                                `You have ${leaveBalance?.leaveBalance} leave(s) remaining this month` :
                                'You have no leaves remaining this month'}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {leaveBalance?.leaveBalance > 0 && !hasTakenLeaveThisMonth && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <LeaveRequestForm />
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Your Leave History
                    </Typography>
                    {requestsLoading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <LeaveHistory leaves={leaveRequests || []} />
                    )}
                </CardContent>
            </Card>
        </Box>

    );

}