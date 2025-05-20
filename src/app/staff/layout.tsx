/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import AccessRestricted from '@/components/AccessRestricted'
import StaffDashboardSkeleton from '@/components/loaders/StaffAuthCheckingLoader'
import { ArrowBack, More } from '@mui/icons-material'
import { Card, CardContent, CardHeader, Container, Grid, IconButton } from '@mui/material'
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
        <Container maxWidth='xl'>
            <Card>
                <CardHeader
                    avatar={
                        <IconButton onClick={() => router.back()} color='default' sx={{ bgcolor: 'primary.light' }} aria-label="recipe">
                            <ArrowBack />
                        </IconButton>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <More />
                        </IconButton>
                    }
                    title="Staff Dashboard"

                    subheader="leave request notifications"
                />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            {LeaveFormSection}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            {LeaveRequestHistory}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>


    )
}

export default Layout