'use client'
import { BackHand, Lock } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

function AccessRestricted() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            p: 4,
            gap: 3
        }}>
            <Lock color="error" sx={{ fontSize: 80 }} />
            <Typography variant="h4" component="h1" color="error">
                Access Restricted
            </Typography>
            <Button component={Link} href='/' startIcon={<BackHand />}>Back to home</Button>
        </Box>
    )
}

export default AccessRestricted