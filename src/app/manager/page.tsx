/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import AccessRestricted from '@/components/AccessRestricted';
import LoadingProgress from '@/components/LoadingProgress';
import PendingLeaveRequests from '@/components/PendingLeaveRequests';
import { useManager } from '@/hooks/useManager';

import { Typography, Card, CardContent, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ManagerDashboard() {
    const router = useRouter()
    const { status, data }: any = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/unauthorized');
        },
    })

    const { data: pendingRequests, isLoading } = useManager({ managerId: data?.user?.id })


    if (status === 'loading') {
        return <LoadingProgress />
    }
    if (data?.user?.role !== 'manager') {
        return (
            <AccessRestricted />
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manager Dashboard
            </Typography>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Pending Leave Requests
                    </Typography>
                    {isLoading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <PendingLeaveRequests requests={pendingRequests || []} />
                    )}
                </CardContent>
            </Card>
        </Box>
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