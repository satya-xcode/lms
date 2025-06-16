/* eslint-disable @typescript-eslint/no-explicit-any */
// components/EmplyeeWorksLeave.tsx
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
import { Add, ArrowBackIosNew, Delete } from '@mui/icons-material';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useStaffEmployeesLeave } from '@/hooks/staff/useStaffEmployeesLeave';
import { toast } from 'sonner';
import { formatDistance } from 'date-fns';
import theme from '@/theme/theme';
import { useRouter } from 'next/navigation';
import EmployeeWorksFormDialog from '@/components/staff/employee/company-works/EmployeeWorksFormDialog';

const EmplyeeWorksLeave = () => {
    const router = useRouter()
    const { user } = useCurrentUser()
    // console.log(
    //     'user', user
    // )
    const {
        employees,
        isLoading,
        error,
        deleteEmployeeLeave,
    } = useStaffEmployeesLeave(user?.id, String(user?.manager?._id), 'gate-pass(Work)');
    const [openForm, setOpenForm] = useState(false);

    const handleAddEmployee = () => {
        setOpenForm(true);
    };
    // console.log(
    //     'employees', employees
    // )
    // Function to calculate time difference based on leave type
    const calculateDuration = (start: Date, end: Date) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate.getTime() - startDate.getTime();
        // Convert milliseconds to days, hours, minutes, and seconds
        const totalSeconds = Math.floor(diffMs / 1000);
        // const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        // const seconds = totalSeconds % 60;
        // Format the duration as a string
        // const duration = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        const duration = `${hours} hours,${minutes} minutes`
        return duration;
    };

    return (
        <Stack spacing={theme.spacing(2)}>
            <Box display="flex" gap={theme.spacing(2)} flexDirection={{ xs: 'column', md: 'row' }} alignItems={'center'}>
                <IconButton onClick={() => router.back()}>
                    <ArrowBackIosNew />
                </IconButton>
                <Typography variant="h4" fontWeight={'bold'}>Works Leave</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddEmployee}
                >
                    Leave Request
                </Button>
            </Box>

            {isLoading ? (
                <Typography>Loading employees...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : employees?.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>No employees works leave found</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} variant='outlined'>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Father Name</TableCell>
                                <TableCell>Employee ID</TableCell>
                                <TableCell>Role</TableCell>
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
                                    <TableCell>{employee?.role}</TableCell>
                                    <TableCell>{employee?.punchId}</TableCell>
                                    <TableCell>{employee?.department}</TableCell>
                                    <TableCell>

                                        {employee?.type}

                                    </TableCell>
                                    <TableCell>
                                        {calculateDuration(
                                            employee?.startDate,
                                            employee?.endDate
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

            <EmployeeWorksFormDialog open={openForm} setOpenForm={setOpenForm} />
        </Stack>
    );
};

export default EmplyeeWorksLeave;