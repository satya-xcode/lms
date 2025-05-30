/* eslint-disable @typescript-eslint/no-explicit-any */
// components/StaffAccountPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {
    AccountCircle,
    CalendarMonth,
    Phone,
    Work,
    Person,
    Edit,
    Save,
    Cancel
} from '@mui/icons-material';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import axios from 'axios';

const StaffAccountPage = () => {
    // const { data: session }: any = useSession();
    const { user, isLoading, error }: any = useCurrentUser();
    console.log('User', user)
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        department: ''
    });

    // Initialize form data when user data is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobile: user.mobile || '',
                department: user.department || ''
            });
        }
    }, [user]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            // Call API to update user profile
            await axios.put('/api/user/profile', formData);
            setIsEditing(false);
            // Optionally refresh user data
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Error loading account information</Typography>;
    if (!user) return <Typography>No user data available</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            {/* <Typography variant="h4" gutterBottom>
                My Account
            </Typography> */}

            <Grid container spacing={3}>
                {/* Profile Card */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: '0 auto 16px',
                                    bgcolor: 'primary.main'
                                }}
                            >
                                <AccountCircle sx={{ fontSize: 80 }} />
                            </Avatar>

                            {isEditing ? (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        margin="normal"
                                        disabled // Email typically shouldn't be editable
                                    />
                                </>
                            ) : (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        {user.name}
                                    </Typography>
                                    <Typography color="text.secondary" gutterBottom>
                                        {user.email}
                                    </Typography>
                                    <Chip
                                        label={user.role}
                                        color="primary"
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </>
                            )}

                            <Box sx={{ mt: 2 }}>
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            startIcon={<Save />}
                                            onClick={handleSave}
                                            sx={{ mr: 1 }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Cancel />}
                                            onClick={handleEditToggle}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        onClick={handleEditToggle}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Details Card */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Account Details
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Phone color="action" sx={{ mr: 1 }} />
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                label="Mobile Number"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <Typography>+91 {user.mobile || 'Not provided'}</Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Work color="action" sx={{ mr: 1 }} />
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                label="Department"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <Typography>{user.department || 'Not specified'}</Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Person color="action" sx={{ mr: 1 }} />

                                        <Typography>{user?.manager?.name || 'Not specified'}</Typography>

                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <CalendarMonth color="action" sx={{ mr: 1 }} />
                                        <Typography>
                                            Joined: {new Date(user.joinDate || '').toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />
                            {
                                user.role === 'staff' && (

                                    <Stack>
                                        <Typography variant="h6" gutterBottom>
                                            Leave Balances
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                <Paper sx={{ p: 2 }}>
                                                    <Typography variant="subtitle2">Full Day Leaves</Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(user.monthlyLimits?.fullDayLeaves / 1) * 100}
                                                        sx={{ height: 8, my: 1 }}
                                                    />
                                                    <Typography>
                                                        {user.monthlyLimits?.fullDayLeaves || 0} of 1 remaining
                                                    </Typography>
                                                </Paper>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                <Paper sx={{ p: 2 }}>
                                                    <Typography variant="subtitle2">Half Day Leaves</Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(user.monthlyLimits?.halfDayLeaves / 2) * 100}
                                                        sx={{ height: 8, my: 1 }}
                                                    />
                                                    <Typography>
                                                        {user.monthlyLimits?.halfDayLeaves || 0} of 2 remaining
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                <Paper sx={{ p: 2 }}>
                                                    <Typography variant="subtitle2">Gate Passes</Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(user.monthlyLimits?.gatePasses / 2) * 100}
                                                        sx={{ height: 8, my: 1 }}
                                                    />
                                                    <Typography>
                                                        {user.monthlyLimits?.gatePasses || 0} of 2 remaining
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                <Paper sx={{ p: 2 }}>
                                                    <Typography variant="subtitle2">Late Passes</Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(user.monthlyLimits?.latePasses / 2) * 100}
                                                        sx={{ height: 8, my: 1 }}
                                                    />
                                                    <Typography>
                                                        {user.monthlyLimits?.latePasses || 0} of 2 remaining
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                <Paper sx={{ p: 2 }}>
                                                    <Typography variant="subtitle2">Additional Leaves</Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        {user.additionalLeave || 0} taken this month
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Stack>

                                )
                            }

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StaffAccountPage;