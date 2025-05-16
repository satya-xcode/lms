'use client'
import AccessRestricted from '@/components/AccessRestricted';
import LoadingProgress from '@/components/LoadingProgress';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter()
    const { status, data }: any = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/unauthorized');
        },
    })

    if (status === 'loading') {
        return <LoadingProgress />
    }
    if (data?.user?.role !== 'staff') {
        return (
            <AccessRestricted />
        )
    }
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant='h3'>Staff Dashboard</Typography>
        </Box>
    );

}