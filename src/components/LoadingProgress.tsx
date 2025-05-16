'use client'
import { Box, CircularProgress } from '@mui/material'
import React from 'react'

function LoadingProgress() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
    )
}

export default LoadingProgress