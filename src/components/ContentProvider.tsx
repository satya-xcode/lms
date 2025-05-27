'use client'
import theme from '@/theme/theme'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import React from 'react'
// import Navbar from './Navbar'
import { SessionProvider } from 'next-auth/react'
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Toaster } from 'sonner';
function ContentProvider({ children }: { children: React.ReactNode }) {

    return (
        <SessionProvider>
            <SWRConfig value={{
                fetcher: fetcher,
                revalidateIfStale: true,
                revalidateOnFocus: true,
                revalidateOnReconnect: true,
                refreshInterval: 1000
            }}>
                <ThemeProvider theme={theme}>
                    <Box sx={{ bgcolor: 'primary.main', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                        <CssBaseline />
                        {/* <Navbar /> */}
                        {/* <Box
                            sx={{
                                flex: 1,
                                bgcolor: 'transparent',
                                marginX: 1.5,
                                marginBottom: 1.5,
                                borderRadius: 1.5,
                                overflow: 'hidden', // This clips the scrollbar correctly
                            }}
                        > */}
                        <Box
                            sx={{
                                height: '100%',
                                width: '100%',
                                bgcolor: '#E0F2F1',
                                overflowX: 'auto',
                                // padding: theme.spacing(2),
                                // scrollbarGutter: 'stable',
                                // '&::-webkit-scrollbar': {
                                //     width: '8px',
                                // },
                                // '&::-webkit-scrollbar-thumb': {
                                //     backgroundColor: 'rgba(0,0,0,0.2)',
                                //     borderRadius: '16px',
                                // },
                            }}
                        >
                            {children}
                        </Box>
                    </Box>
                    {/* </Box> */}
                    <Toaster expand position='top-center' />
                </ThemeProvider>
            </SWRConfig>
        </SessionProvider >
    )
}

export default ContentProvider