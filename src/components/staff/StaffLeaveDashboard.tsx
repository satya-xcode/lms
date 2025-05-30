'use client';
import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    LinearProgress,
    Typography,
    Chip,
    Avatar,
    useTheme,
    Button,
    Stack,
    Drawer,
    IconButton
} from '@mui/material';
import {
    AccessTime as HalfDayIcon,
    Event as FullDayIcon,
    ExitToApp as GatePassIcon,
    Schedule as LatePassIcon,
    Notifications,
    Close
} from '@mui/icons-material';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import LeaveRequestList from './StaffLeaveRequestList';
import { useStaffLeaveRequests } from '@/hooks/useStaffLeaveRequests';

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

const StaffLeaveDashboard: React.FC<LeaveDashboardProps> = ({ userLimits, totalLimits }) => {
    const theme = useTheme();
    const { user } = useCurrentUser()
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Get current month name
    // console.log('AdditionalLeave', user?.additionalLeave)
    // const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    // const currentYear = new Date().getFullYear();

    const leaveTypes = [
        {
            id: 'half-day',
            label: 'Half Day Leaves',
            icon: <HalfDayIcon />,
            current: userLimits.halfDayLeaves,
            total: totalLimits.halfDayLeaves,
            color: theme.palette.primary.main
        },
        {
            id: 'full-day',
            label: 'Full Day Leaves',
            icon: <FullDayIcon />,
            current: userLimits.fullDayLeaves,
            total: totalLimits.fullDayLeaves,
            color: theme.palette.secondary.main
        },
        {
            id: 'gate-pass',
            label: 'Gate Passes',
            icon: <GatePassIcon />,
            current: userLimits.gatePasses,
            total: totalLimits.gatePasses,
            color: theme.palette.info.main
        },
        {
            id: 'late-pass',
            label: 'Late Passes',
            icon: <LatePassIcon />,
            current: userLimits.latePasses,
            total: totalLimits.latePasses,
            color: theme.palette.warning.main
        }
    ];

    const getProgressValue = (current: number, total: number) => {
        return ((total - current) / total) * 100;
    };

    const getStatusColor = (current: number, total: number) => {
        if (current === 0) return 'error';
        if (current <= total / 2) return 'warning';
        return 'success';
    };

    const getRemainingText = (current: number) => {
        return current === 1 ? `${current} remaining` : `${current} remaining`;
    };
    const { data: pendingRequests } = useStaffLeaveRequests({
        staffId: user?.id,
        status: 'pending'
    });

    return (
        <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" >
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        Leave Balance Overview
                    </Typography>

                    {/* <Badge
                        badgeContent={
                            <CalendarIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                        }
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Chip
                            label={`${currentMonth} ${currentYear}`}
                            variant="outlined"
                            sx={{
                                backgroundColor: theme.palette.grey[50],
                                borderColor: theme.palette.divider,
                                fontWeight: 'medium'
                            }}
                        />
                    </Badge> */}
                    <Stack direction={'row'} alignItems={'center'} gap={theme.spacing(2)}>
                        <Button startIcon={<Notifications />} onClick={() => setDrawerOpen(true)}>Your Raised Requests</Button>
                        <Typography color='warning' fontWeight={'bold'}>
                            {pendingRequests?.length || 0}
                        </Typography>
                    </Stack>


                </Box>

                <Divider sx={{}} />

                <Grid container spacing={3}>
                    {leaveTypes.map((type) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={type.id}>
                            <Box
                                boxShadow={1}
                                sx={{
                                    p: 2,
                                    borderRadius: 1,
                                    backgroundColor: theme.palette.background.paper,
                                    height: '100%',
                                    // borderLeft: `4px solid ${type.color}`
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={1.5}>
                                    <Avatar sx={{
                                        bgcolor: `${type.color}20`,
                                        color: type.color,
                                        width: 36,
                                        height: 36,
                                        mr: 1.5
                                    }}>
                                        {type.icon}
                                    </Avatar>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        {type.label}
                                    </Typography>
                                </Box>

                                <LinearProgress
                                    variant="determinate"
                                    value={getProgressValue(type.current, type.total)}
                                    color={getStatusColor(type.current, type.total)}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        mb: 1.5,
                                        backgroundColor: theme.palette.grey[200]
                                    }}
                                />

                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        {type.total - type.current} of {type.total} available
                                    </Typography>
                                    <Chip
                                        label={getRemainingText(type.current)}
                                        size="small"
                                        color={getStatusColor(type.current, type.total)}
                                        variant="outlined"
                                        sx={{ fontWeight: 'medium' }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Drawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    anchor="right"
                    sx={{ width: 350 }}
                >
                    <Stack width={350} sx={{ bgcolor: 'primary.light', flex: 1, alignItems: 'center' }} p={theme.spacing(2)} gap={theme.spacing(2)}>
                        <Stack spacing={theme.spacing(2)} direction={'row'} alignItems={'center'}>
                            <Typography variant="h5" align='center' fontWeight={'bold'}>Your Raised Requests</Typography>
                            <IconButton onClick={() => setDrawerOpen(false)}><Close /></IconButton>
                        </Stack>
                        <LeaveRequestList requests={pendingRequests} status="pending" />
                    </Stack>
                </Drawer>
                <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                        * 1 Full Day Leave = 2 Half Day Leaves • Resets on 1st of each month
                    </Typography>
                </Box>
                <Box >
                    <Typography color='info' variant="subtitle1" fontWeight="medium">
                        Additional Leave
                    </Typography>
                    <Typography fontWeight={'bold'} variant="body2" color="text.secondary">
                        {user?.additionalLeave} days
                    </Typography>
                </Box>
            </CardContent>
        </Card >
    );
};

export default StaffLeaveDashboard;