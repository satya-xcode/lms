/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { DashboardCard } from '@/components/manager/DashboardCard'
import { useMembersByAdmin } from '@/hooks/admin/useMembersByAdmin'
import { EventAvailable, Group } from '@mui/icons-material'
import { Grid } from '@mui/material'
import React, { useMemo } from 'react'

function AdminDashboard() {
    const { members } = useMembersByAdmin()

    const staffs = useMemo(() => {
        return members?.filter((item: any) => item.role === 'staff')
    }, [members])

    const managers = useMemo(() => {
        return members?.filter((item: any) => item.role === 'manager')
    }, [members])

    // console.log('Memebers', staffs)
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardCard
                    title="Total Staffs"
                    value={staffs?.length || 0}
                    icon={<Group />}
                    color="#1976d2"
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DashboardCard
                    title="Total Managers"
                    value={managers?.length || 0}
                    icon={<EventAvailable />}
                    color="#9c27b0"
                />
            </Grid>
        </Grid>

    )
}

export default AdminDashboard