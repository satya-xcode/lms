/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/StaffManagement.tsx
'use client';
import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'sonner';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { useRouter } from 'next/navigation';

const StaffManagement = () => {
    const { data: session }: any = useSession();
    // const router = useRouter();
    const [staffMembers, setStaffMembers] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [managers, setManagers] = useState<any[]>([]);

    // Form validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobile: Yup.string().required('Mobile number is required'),
        role: Yup.string().oneOf(['staff', 'manager']).required('Role is required'),
        department: Yup.string().required('Department is required'),

        joinDate: Yup.date().required('Join date is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
    });

    // Initial form values
    const initialValues = {
        _id: '',
        name: '',
        email: '',
        mobile: '',
        role: 'staff',
        department: '',
        manager: '',
        joinDate: new Date(),
        password: '',
    };

    // Fetch staff data
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [staffRes, managersRes] = await Promise.all([
                    axios.get('/api/admin/staff'),
                    axios.get('/api/admin/staff?role=manager'),
                ]);
                setStaffMembers(staffRes.data.data);
                setManagers(managersRes.data.data);
            } catch (error: any) {
                toast.error('Failed to fetch staff data');
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.role === 'admin') {
            fetchData();
        }
    }, [session]);

    // Handle form submission
    const handleSubmit = async (values: any, { resetForm }: any) => {
        try {
            const method = values._id ? 'put' : 'post';
            const url = values._id ? `/api/admin/staff?id=${values._id}` : '/api/admin/staff';

            const { data } = await axios[method](url, values);

            if (method === 'post') {
                setStaffMembers([...staffMembers, data.data]);
                toast.success('Staff member created successfully');
            } else {
                setStaffMembers(staffMembers.map(member =>
                    member._id === data.data._id ? data.data : member
                ));
                toast.success('Staff member updated successfully');
            }

            setOpenDialog(false);
            resetForm();
        } catch (error) {
            toast.error('Failed to save staff member');
        }
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/admin/staff?id=${id}`);
            setStaffMembers(staffMembers.filter(member => member._id !== id));
            toast.success('Staff member deleted successfully');
        } catch (error) {
            toast.error('Failed to delete staff member');
        }
    };

    if (!session || session.user.role !== 'admin') {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6">Unauthorized Access</Typography>
                <Typography>You don&apos;t have permission to view this page.</Typography>
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5">Staff Management</Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setOpenDialog(true)}
                            >
                                Add New Staff
                            </Button>
                        </Box>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Department</TableCell>
                                        <TableCell>Position</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Loading...
                                            </TableCell>
                                        </TableRow>
                                    ) : staffMembers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No staff members found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        staffMembers.map((staff) => (
                                            <TableRow key={staff._id}>
                                                <TableCell>{staff.name}</TableCell>
                                                <TableCell>{staff.email}</TableCell>
                                                <TableCell>{staff.department}</TableCell>
                                                <TableCell>{staff.position}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={staff.role}
                                                        color={staff.role === 'manager' ? 'primary' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={staff.isActive ? 'Active' : 'Inactive'}
                                                        color={staff.isActive ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            setOpenDialog(true);
                                                            // You'll need to set the form values here
                                                        }}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(staff._id)}>
                                                        <Delete fontSize="small" color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Add/Edit Staff Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, setFieldValue }) => (
                            <Form>
                                <DialogContent dividers>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Field
                                                as={TextField}
                                                name="name"
                                                label="Full Name"
                                                fullWidth
                                                error={touched.name && !!errors.name}
                                                helperText={touched.name && errors.name}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Field
                                                as={TextField}
                                                name="email"
                                                label="Email"
                                                fullWidth
                                                error={touched.email && !!errors.email}
                                                helperText={touched.email && errors.email}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Field
                                                as={TextField}
                                                name="mobile"
                                                label="Mobile Number"
                                                fullWidth
                                                error={touched.mobile && !!errors.mobile}
                                                helperText={touched.mobile && errors.mobile}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Field
                                                as={TextField}
                                                name="department"
                                                label="Department"
                                                fullWidth
                                                error={touched.department && !!errors.department}
                                                helperText={touched.department && errors.department}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Field
                                                as={TextField}
                                                name="role"
                                                label="Role"
                                                select
                                                fullWidth
                                                error={touched.role && !!errors.role}
                                                helperText={touched.role && errors.role}
                                            >
                                                <MenuItem value="staff">Staff</MenuItem>
                                                <MenuItem value="manager">Manager</MenuItem>
                                            </Field>
                                        </Grid>
                                        {values.role === 'staff' && (
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Field
                                                    as={TextField}
                                                    name="manager"
                                                    label="Manager"
                                                    select
                                                    fullWidth
                                                >
                                                    <MenuItem value="">None</MenuItem>
                                                    {managers.map((manager) => (
                                                        <MenuItem key={manager._id} value={manager._id}>
                                                            {manager.name}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </Grid>
                                        )}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <DatePicker
                                                label="Join Date"
                                                value={values.joinDate}
                                                onChange={(date) => setFieldValue('joinDate', date)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: touched.joinDate && !!errors.joinDate,
                                                        helperText: String(touched.joinDate) && String(errors.joinDate),
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        {!values._id && (
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Field
                                                    as={TextField}
                                                    name="password"
                                                    label="Password"
                                                    type="password"
                                                    fullWidth
                                                    error={touched.password && !!errors.password}
                                                    helperText={touched.password && errors.password}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button type="submit" variant="contained" color="primary">
                                        Save
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
};

export default StaffManagement;