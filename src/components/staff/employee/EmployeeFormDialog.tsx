/* eslint-disable @typescript-eslint/no-explicit-any */
// components/EmployeeFormDialog.tsx
'use client';
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'sonner';
import theme from '@/theme/theme';
const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    empId: Yup.string().required('Employee ID is required'),
    punchId: Yup.string().required('Punch ID is required'),
    department: Yup.string().required('Department is required'),
    type: Yup.string().required('Leave type is required'),
    reason: Yup.string().required('Reason is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
});

const EmployeeFormDialog = ({ open, setOpenForm, createLeaveRequest }: any) => {

    // const [openForm, setOpenForm] = useState(false);

    // const [currentEmployee, setCurrentEmployee] = useState(null);

    // const handleAddEmployee = () => {
    //     // setCurrentEmployee(null);
    //     setOpenForm(true);
    // };
    // const handleSubmitEmployee = async (values: any) => {

    //     await createLeaveRequest(values);
    //     // }
    //     setOpenForm(false);
    // };

    const formik = useFormik({
        initialValues: {
            name: '',
            empId: '',
            punchId: '',
            department: '',
            type: 'full-day',
            reason: '',
            startDate: new Date(),
            endDate: new Date(),
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await createLeaveRequest(values);
                toast.success(res.message, { richColors: true })
                setOpenForm(false);
                resetForm()
            } catch (error: any) {
                console.log('error', error)
                toast.error(error.response.data.message || error.message, { richColors: true })
            }

        }
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Employee Leave Request
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Full Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <Grid container spacing={theme.spacing(4)}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Employee ID"
                                    name="empId"
                                    value={formik.values.empId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.empId && Boolean(formik.errors.empId)}
                                    helperText={formik.touched.empId && formik.errors.empId}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Punch ID"
                                    name="punchId"
                                    value={formik.values.punchId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.punchId && Boolean(formik.errors.punchId)}
                                    helperText={formik.touched.punchId && formik.errors.punchId}
                                />
                            </Grid>
                        </Grid>


                        <TextField
                            fullWidth
                            margin="normal"
                            label="Department"
                            name="department"
                            value={formik.values.department}
                            onChange={formik.handleChange}
                            error={formik.touched.department && Boolean(formik.errors.department)}
                            helperText={formik.touched.department && formik.errors.department}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Leave Type</InputLabel>
                            <Select
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                label="Leave Type"
                            >
                                <MenuItem value="full-day">Full Day</MenuItem>
                                <MenuItem value="half-day">Half Day</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Reason"
                            name="reason"
                            multiline
                            rows={4}
                            value={formik.values.reason}
                            onChange={formik.handleChange}
                            error={formik.touched.reason && Boolean(formik.errors.reason)}
                            helperText={formik.touched.reason && formik.errors.reason}
                        />

                        <Box display="flex" gap={2} mt={2}>
                            <DatePicker
                                label="Start Date"
                                value={formik.values.startDate}
                                onChange={(date) => formik.setFieldValue('startDate', date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                                        helperText: formik?.touched?.startDate && !!formik?.errors?.startDate,
                                    },
                                }}
                            />
                            <DatePicker
                                label="End Date"
                                value={formik.values.endDate}
                                onChange={(date) => formik.setFieldValue('endDate', date)}
                                minDate={formik.values.startDate}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: formik.touched.endDate && Boolean(formik.errors.endDate),
                                        helperText: formik.touched.endDate && !!formik.errors.endDate,
                                    },
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Submit Leave Request
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </LocalizationProvider>
    );
};

export default EmployeeFormDialog;