/* eslint-disable @typescript-eslint/no-explicit-any */
// components/StaffEmployeeManagement.tsx
'use client';
import React, { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useStaffEmployeesLeave } from '@/hooks/staff/useStaffEmployeesLeave';
import EmployeeFormDialog from './EmployeeFormDialog';
import { toast } from 'sonner';
import { format, formatDistance } from 'date-fns';

const StaffEmployeeManagement = () => {
    const { user }: any = useCurrentUser()
    const {
        employees,
        isLoading,
        error,
        deleteEmployeeLeave,
        createLeaveRequest,
    } = useStaffEmployeesLeave(user?.id);
    const [openForm, setOpenForm] = useState(false);

    const handleAddEmployee = () => {
        setOpenForm(true);
    };

    const formatDateRange = (start: Date, end: Date, type: string) => {
        if (type === 'full-day') {
            return format(new Date(start), 'MMM dd, yyyy');
        }
        //  if (type === 'additional-leave') {
        //      return `${format(new Date(start), 'MMM dd, hh:mm a')} - ${format(new Date(end), 'MMM dd, hh:mm a')}`;
        //  }
        return `${format(new Date(start), 'MMM dd, hh:mm a')} - ${format(new Date(end), ' hh:mm a')}`;
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Employees Leave</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddEmployee}
                >
                    Employee Leave Request
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
                                    <TableCell>{employee?.empId}</TableCell>
                                    <TableCell>{employee?.punchId}</TableCell>
                                    <TableCell>{employee?.department}</TableCell>
                                    <TableCell>{employee?.type}</TableCell>
                                    <TableCell>
                                        {formatDateRange(employee?.startDate, employee?.endDate, employee?.type)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDistance(new Date(employee?.createdAt), new Date(), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                        // onClick={() => handleEditEmployee(employee)}
                                        >
                                            <Edit />
                                        </IconButton>
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
                                                    richColors: true, closeButton: true, icon: <Delete />
                                                });
                                            }}
                                        >
                                            <Delete color="error" />
                                        </IconButton>
                                        {/* <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleRequestLeave(employee)}
                                            sx={{ ml: 1 }}
                                        >
                                            Request Leave
                                        </Button> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <EmployeeFormDialog open={openForm} setOpenForm={setOpenForm} createLeaveRequest={createLeaveRequest} />
        </Box>
    );
};

export default StaffEmployeeManagement;