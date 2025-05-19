/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Typography, Card, CardContent, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
// import { useLeaveBalance } from '@/hooks/useApiRequest';
import { useRouter } from 'next/navigation';
import LoadingProgress from '@/components/LoadingProgress';
import AccessRestricted from '@/components/AccessRestricted';
// import { useLeaveMutations } from '@/hooks/useMutateApi';
import LeaveRequestForm from '@/components/LeaveRequestForm';
import LeaveHistory from '@/components/LeaveHistory';
import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests';
import { useStaffLeaveBalance } from '@/hooks/useStaffLeaveBalance';

export default function DashboardPage() {
    const router = useRouter()
    const { status, data }: any = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/unauthorized');
        },
    })
    // console.log('Daaaaa', data)


    const { data: staffLeaves, isLoading: requestsLoading } = useStaffLeaveRequests({ staffId: data?.user.id || '' })
    // const { data: leaveRequests, isLoading: requestsLoading }: any = useStaffLeaveRequests(data?.user.id || '');
    const { data: leaveBalance, isLoading: balanceLoading }: any = useStaffLeaveBalance({ staffId: data?.user?.id || '' });

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const hasTakenLeaveThisMonth = staffLeaves?.some((request: any) => {
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
                        <Typography color='info'>
                            {leaveBalance > 0 ?
                                `You have ${leaveBalance} free leave(s) remaining this month` :
                                'You have no free leaves remaining this month'}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {
                leaveBalance > 0 && !hasTakenLeaveThisMonth && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>

                            <LeaveRequestForm />
                        </CardContent>
                    </Card>
                )
            }


            {
                leaveBalance <= 0 && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant='h3' color='success' fontWeight={'bold'}>Apply for additional leaves</Typography>
                            <LeaveRequestForm />
                        </CardContent>
                    </Card>
                )
            }



            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Your Leave History
                    </Typography>
                    {requestsLoading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <LeaveHistory leaves={staffLeaves || []} />
                    )}
                </CardContent>
            </Card>
        </Box>

    );

}