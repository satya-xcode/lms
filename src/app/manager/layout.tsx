/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import AccessRestricted from '@/components/AccessRestricted'
import ManagerAuthCheckingLoader from '@/components/loaders/ManagerAuthCheckingLoader'
import { ArrowBack, More } from '@mui/icons-material'
import { Card, CardContent, CardHeader, Container, IconButton } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    const { status, data }: any = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/unauthorized');
        },
    })



    if (status === 'loading') {
        return <ManagerAuthCheckingLoader />
    }
    if (data?.user?.role !== 'manager') {
        return (
            <AccessRestricted />
        )
    }


    return (
        <Container maxWidth='lg'>
            <Card variant='outlined'>
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
                    title="Manager Dashboard"

                    subheader="leave request notifications"
                />
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </Container>

    )
}

export default Layout