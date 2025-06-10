/* eslint-disable @typescript-eslint/no-explicit-any */
// components/StaffEmployeeManagement.tsx
'use client';
import React, { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Add, Delete, WorkspacePremium } from '@mui/icons-material';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useStaffEmployeesLeave } from '@/hooks/staff/useStaffEmployeesLeave';
import EmployeeFormDialog from './EmployeeFormDialog';
import { toast } from 'sonner';
import { differenceInDays, formatDistance } from 'date-fns';
import theme from '@/theme/theme';
import { useRouter } from 'next/navigation';

const StaffEmployeeManagement = () => {
    const router = useRouter()
    const { user }: any = useCurrentUser()
    const {
        employees,
        isLoading,
        error,
        deleteEmployeeLeave,
    } = useStaffEmployeesLeave(user?.id);
    const [openForm, setOpenForm] = useState(false);

    const handleAddEmployee = () => {
        setOpenForm(true);
    };

    // Function to calculate time difference based on leave type
    // Function to calculate time difference based on leave type
    const calculateDuration = (start: Date, end: Date, leaveType: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate.getTime() - startDate.getTime();

        // Convert milliseconds to days, hours, minutes
        const totalMinutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        // const days = Math.floor(hours / 24);

        switch (leaveType) {
            case 'half-day':
                // Always show 5 hours for half-day
                return '5 hours';

            case 'gate-pass':
                // Show actual gate-pass duration in hours/minutes
                const minutes = totalMinutes % 60;
                if (hours > 0) {
                    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
                }
                return `${minutes} min`;

            case 'additional-leave':
                // For additional-leave, show only days (adding 1 to include both start and end dates)
                const totalDays = differenceInDays(endDate, startDate) + 1;
                return `${totalDays} day${totalDays > 1 ? 's' : ''}`;

            default:
                // Default case (shouldn't happen)
                return `${hours} hour${hours > 1 ? 's' : ''}`;
        }
    };

    return (
        <Stack spacing={theme.spacing(2)}>
            <Box display="flex" gap={theme.spacing(2)} flexDirection={{ xs: 'column', md: 'row' }} alignItems={'flex-start'}>
                <Typography variant="h4" fontWeight={'bold'}>Employees Leave</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddEmployee}
                >
                    Leave Request
                </Button>
                <Button
                    variant="contained"
                    color='info'
                    startIcon={<WorkspacePremium />}
                    onClick={() => router.push('employee-leaves/company-work-leaves')}
                >
                    Work Leave Request
                </Button>
            </Box>

            {isLoading ? (
                <Typography>Loading employees...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : employees?.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>No employees leave found</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} variant='outlined'>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Father Name</TableCell>
                                <TableCell>Employee ID</TableCell>
                                <TableCell>Punch ID</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Leave Type</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Submitted</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees?.map((employee: any) => (
                                <TableRow key={employee?._id}>
                                    <TableCell>{employee?.name}</TableCell>
                                    <TableCell>{employee?.fatherName}</TableCell>
                                    <TableCell>{employee?.empId}</TableCell>
                                    <TableCell>{employee?.punchId}</TableCell>
                                    <TableCell>{employee?.department}</TableCell>
                                    <TableCell>
                                        {employee?.leaveType}
                                        {/* {employee?.leaveType === 'gate-pass' && 'Gate Pass'}
                                        {employee?.leaveType === 'additional-leave' && 'Additional Leave'} */}
                                    </TableCell>
                                    <TableCell>
                                        {calculateDuration(
                                            employee?.startDate,
                                            employee?.endDate,
                                            employee?.leaveType
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {formatDistance(new Date(employee?.createdAt), new Date(), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => {
                                                toast.warning('Are sure to delete', {
                                                    cancel: {
                                                        label: 'Cancel',
                                                        onClick: () => console.log('Cancel!'),
                                                    },
                                                    action: {
                                                        label: 'Delete',
                                                        onClick: () => deleteEmployeeLeave(employee?._id, String(user?.id))
                                                    },
                                                    richColors: true,
                                                    closeButton: true,
                                                    icon: <Delete />
                                                });
                                            }}
                                        >
                                            <Delete color="error" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <EmployeeFormDialog open={openForm} setOpenForm={setOpenForm} />
        </Stack>
    );
};

export default StaffEmployeeManagement;