'use client'
import theme from '@/theme/theme'
import { Container, CssBaseline, ThemeProvider, Toolbar } from '@mui/material'
import React from 'react'
import Navbar from './Navbar'
import { SessionProvider } from 'next-auth/react'
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

function ContentProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SWRConfig value={{
                fetcher: fetcher,
                revalidateIfStale: true,
                revalidateOnFocus: true,
                revalidateOnReconnect: true,
                refreshInterval: 1000, // Revalidate every 2 seconds
            }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Navbar />
                    <Toolbar />
                    <Container maxWidth={false} sx={{ py: 2 }}>
                        {children}
                    </Container>
                </ThemeProvider>
            </SWRConfig>
        </SessionProvider>
    )
}

export default ContentProvider