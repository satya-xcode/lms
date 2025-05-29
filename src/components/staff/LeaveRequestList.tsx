/* eslint-disable @typescript-eslint/no-explicit-any */
// components/LeaveRequestList.tsx
'use client';

import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography
} from '@mui/material';
import { format, formatDistance } from 'date-fns';
import { LeaveRequestType } from '@/models/LeaveRequest';

interface LeaveRequestListProps {
    requests: any[];
    status: 'pending' | 'approved' | 'rejected';
}

const LeaveRequestList: React.FC<LeaveRequestListProps> = ({ requests, status }) => {
    const getTypeLabel = (type: LeaveRequestType) => {
        switch (type) {
            case 'half-day': return 'Half Day Leave';
            case 'full-day': return 'Full Day Leave';
            case 'additional-leave': return 'Additional Leave';
            case 'gate-pass': return 'Gate Pass';
            case 'late-pass': return 'Late Pass';
            default: return type;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'warning';
        }
    };

    const formatDateRange = (start: Date, end: Date, type: LeaveRequestType) => {
        if (type === 'full-day') {
            return format(new Date(start), 'MMM dd, yyyy');
        }
        if (type === 'additional-leave') {
            return `${format(new Date(start), 'MMM dd, hh:mm a')} - ${format(new Date(end), 'MMM dd, hh:mm a')}`;
        }
        return `${format(new Date(start), 'MMM dd, hh:mm a')} - ${format(new Date(end), 'hh:mm a')}`;
    };

    return (
        <Box>
            {requests.length === 0 ? (
                <Typography variant="body1" color="textSecondary" align="center">
                    No {status} requests found
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {requests.map((request) => (
                        <Grid size={{ xs: 12 }} key={request._id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="subtitle1">
                                            {getTypeLabel(request.type)}
                                        </Typography>
                                        <Chip
                                            label={status.toUpperCase()}
                                            color={getStatusColor()}
                                            size="small"
                                        />
                                    </Box>

                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                        {formatDateRange(request.startDate, request.endDate, request.type)}
                                    </Typography>

                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {request.reason}
                                    </Typography>

                                    <Divider sx={{ my: 1.5 }} />

                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="caption" color="textSecondary">
                                            Submitted {formatDistance(new Date(request.createdAt), new Date(), { addSuffix: true })}
                                        </Typography>
                                        {request.manager && (
                                            <Typography variant="caption" color="textSecondary">
                                                Manager: {request.manager.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default LeaveRequestList;