'use client'

import { Card, CardContent, Typography, Box } from '@mui/material'
import { ReactNode } from 'react'

interface DashboardCardProps {
    title: string
    value: number | string
    icon?: ReactNode
    color?: string
}

export const DashboardCard = ({
    title,
    value,
    icon,
    color = '#1976d2',
}: DashboardCardProps) => {
    return (
        <Card sx={{ minWidth: 220, borderLeft: `5px solid ${color}` }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                    {icon && (
                        <Box
                            sx={{
                                bgcolor: `${color}22`,
                                color,
                                borderRadius: '50%',
                                p: 1.5,
                                display: 'flex',
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h6">{value}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}
