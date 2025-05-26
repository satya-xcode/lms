'use client'
import DashboardLayout from '@/components/DashboardLayout'
import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    )
}

export default Layout