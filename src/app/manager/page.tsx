/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import PendingLeaveRequests from '@/components/PendingLeaveRequests';
import { useManager } from '@/hooks/useManager';
import { Card, CardContent, Stack, Skeleton } from '@mui/material';
import { useSession } from 'next-auth/react';

export default function ManagerDashboard() {
    const { data }: any = useSession()
    const { data: pendingRequests, isLoading } = useManager({ managerId: data?.user?.id })

    return (
        <>

            <Card variant='outlined'>
                <CardContent>
                    {/* <Typography variant="h6" gutterBottom>
                        Pending Leave Requests
                    </Typography> */}
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
        </>
    );
}





















// 'use client'
// import AccessRestricted from '@/components/AccessRestricted';

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Box, CircularProgress, Typography } from '@mui/material';
// import { useSession } from 'next-auth/react';

// import { useRouter } from 'next/navigation';

// export default function DashboardPage() {
//     const router = useRouter()
//     const { status, data }: any = useSession({
//         required: true,
//         onUnauthenticated() {
//             // You could redirect here if you prefer
//             router.push('/unauthorized');
//         },
//     })

//     if (status === 'loading') {
//         return <CircularProgress />
//     }
//     if (data?.user?.role !== 'manager') {
//         return (
//             <AccessRestricted />
//         )
//     }
//     return (
//         <Box sx={{ p: 4 }}>
//             <Typography variant='h3'>Manager Dashboard</Typography>
//         </Box>
//     );

// }