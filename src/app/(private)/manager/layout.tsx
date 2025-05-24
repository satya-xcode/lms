/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import AccessRestricted from '@/components/AccessRestricted'
import ManagerAuthCheckingLoader from '@/components/loaders/ManagerAuthCheckingLoader'
import BackSection from '@/components/shared/BackSection'
import theme from '@/theme/theme'
import { Stack } from '@mui/material'
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
        <Stack spacing={theme.spacing(2)}>
            <BackSection title='Manager Dashboard' description='leave request notifications' />
            {children}
        </Stack>
    )
}

export default Layout