// components/LeaveDashboard.tsx
'use client';

import React from 'react';
import { Box, Card, CardContent, Divider, Grid, LinearProgress, Typography } from '@mui/material';

interface LeaveDashboardProps {
    userLimits: {
        halfDayLeaves: number;
        fullDayLeaves: number;
        gatePasses: number;
        latePasses: number;
    };
    totalLimits: {
        halfDayLeaves: number;
        fullDayLeaves: number;
        gatePasses: number;
        latePasses: number;
    };
}

const LeaveDashboard: React.FC<LeaveDashboardProps> = ({ userLimits, totalLimits }) => {
    const getProgressValue = (current: number, total: number) => {
        return ((total - current) / total) * 100;
    };

    const getStatusColor = (current: number) => {
        if (current === 0) return 'error';
        if (current <= totalLimits.halfDayLeaves / 2) return 'warning';
        return 'success';
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Monthly Leave Status
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Half Day Leaves
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                                <LinearProgress
                                    variant="determinate"
                                    value={getProgressValue(userLimits.halfDayLeaves, totalLimits.halfDayLeaves)}
                                    color={getStatusColor(userLimits.halfDayLeaves)}
                                />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                {userLimits.halfDayLeaves} / {totalLimits.halfDayLeaves}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Full Day Leaves
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                                <LinearProgress
                                    variant="determinate"
                                    value={getProgressValue(userLimits.fullDayLeaves, totalLimits.fullDayLeaves)}
                                    color={getStatusColor(userLimits.fullDayLeaves)}
                                />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                {userLimits.fullDayLeaves} / {totalLimits.fullDayLeaves}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Gate Passes
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                                <LinearProgress
                                    variant="determinate"
                                    value={getProgressValue(userLimits.gatePasses, totalLimits.gatePasses)}
                                    color={getStatusColor(userLimits.gatePasses)}
                                />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                {userLimits.gatePasses} / {totalLimits.gatePasses}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Late Passes
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Box width="100%" mr={1}>
                                <LinearProgress
                                    variant="determinate"
                                    value={getProgressValue(userLimits.latePasses, totalLimits.latePasses)}
                                    color={getStatusColor(userLimits.latePasses)}
                                />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                {userLimits.latePasses} / {totalLimits.latePasses}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default LeaveDashboard;