
'use client';
import PendingLeaveRequests from '@/components/manager/PendingLeaveRequests';
import { useLeavesManageByManager } from '@/hooks/manager/useLeavesManageByManager';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardContent, Stack, Skeleton } from '@mui/material';

export default function ManagerDashboard() {
    const { user } = useCurrentUser()
    const { data: pendingRequests, isLoading } = useLeavesManageByManager({ managerId: user?.id, status: 'pending' })
    return (
        <Card variant='outlined'>
            <CardContent>
                {isLoading ? (
                    <Stack spacing={1}>
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                    </Stack>
                ) : (
                    <PendingLeaveRequests requests={pendingRequests || []} />
                )}
            </CardContent>
        </Card>

    );
}

