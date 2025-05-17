'use client'
import theme from '@/theme/theme'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import React from 'react'
import Navbar from './Navbar'
import { SessionProvider } from 'next-auth/react'

function ContentProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Navbar />
                <Container maxWidth={false} sx={{ py: 4 }}>
                    {children}
                </Container>
            </ThemeProvider>
        </SessionProvider>
    )
}

export default ContentProvider