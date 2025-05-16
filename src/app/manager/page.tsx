'use client'
import AccessRestricted from '@/components/AccessRestricted';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter()
    const { status, data }: any = useSession({
        required: true,
        onUnauthenticated() {
            // You could redirect here if you prefer
            router.push('/unauthorized');
        },
    })

    if (status === 'loading') {
        return <CircularProgress />
    }
    if (data?.user?.role !== 'manager') {
        return (
            <AccessRestricted />
        )
    }
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant='h3'>Manager Dashboard</Typography>
        </Box>
    );

}