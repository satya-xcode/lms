'use client'
import theme from '@/theme/theme'
import { ArrowBack } from '@mui/icons-material'
import { IconButton, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'

function BackSection({ title, description }: { title: string, description?: string | null }) {
    const router = useRouter()
    return (
        <Stack direction={'row'} spacing={theme.spacing(2)} alignItems={'center'}>
            <IconButton onClick={() => router.back()} color='default' sx={{ bgcolor: 'primary.light' }} aria-label="recipe">
                <ArrowBack />
            </IconButton>
            <Stack>
                <Typography variant='h5' color='primary' textTransform={'uppercase'} component={'h5'} fontWeight={"bold"}>{title}</Typography>
                {description ? <Typography variant='overline'>{description}</Typography> : null}
            </Stack>
        </Stack>
    )
}

export default BackSection