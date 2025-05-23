/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import AccessRestricted from '@/components/AccessRestricted'
import StaffDashboardSkeleton from '@/components/loaders/StaffAuthCheckingLoader'
import theme from '@/theme/theme'
import { ArrowBack } from '@mui/icons-material'
import { Grid, IconButton, Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

function Layout({ LeaveFormSection, LeaveRequestHistory }: { children: React.ReactNode, LeaveFormSection: React.ReactNode, LeaveRequestHistory: React.ReactNode }) {
    const router = useRouter()
    const { status, data }: any = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/unauthorized');
        },
    })

    if (status === 'loading') {
        return <StaffDashboardSkeleton />
    }
    if (data?.user?.role !== 'staff') {
        return (
            <AccessRestricted />
        )
    }

    return (
        <Stack spacing={theme.spacing(2)}>
            <Stack direction={'row'} spacing={theme.spacing(2)} alignItems={'center'}>
                <IconButton onClick={() => router.back()} color='default' sx={{ bgcolor: 'primary.light' }} aria-label="recipe">
                    <ArrowBack />
                </IconButton>
                <Stack>
                    <Typography variant='h6' fontWeight={"bold"}>Staff Dashboard</Typography>
                    <Typography variant='body1'>leave request notifications</Typography>
                </Stack>
            </Stack>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    {LeaveFormSection}
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    {LeaveRequestHistory}
                </Grid>
            </Grid>

        </Stack>






    )
}

export default Layout