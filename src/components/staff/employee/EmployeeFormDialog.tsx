/* eslint-disable @typescript-eslint/no-explicit-any */
// components/EmployeeFormDialog.tsx
'use client';
import React, { useEffect } from 'react';
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
import { DateTimePicker, DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'sonner';
import theme from '@/theme/theme';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useStaffEmployeesLeave } from '@/hooks/staff/useStaffEmployeesLeave';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    fatherName: Yup.string().required('Father Name is required'),
    empId: Yup.string(),
    punchId: Yup.string().required('Punch ID is required'),
    department: Yup.string().required('Department is required'),
    leaveType: Yup.string().required('Leave type is required'),
    reason: Yup.string().required('Reason is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
        .required('End date is required')
        .test('end-date-validation', 'Invalid end time for leave type', function (value) {
            const { leaveType, startDate } = this.parent;
            if (!(value instanceof Date) || !(startDate instanceof Date)) return false;

            const timeDiff = value.getTime() - startDate.getTime();

            if (leaveType === 'half-day') {
                return timeDiff === 5 * 60 * 60 * 1000; // Exactly 5 hours
            } else if (leaveType === 'gate-pass') {
                return timeDiff >= 60000 && timeDiff <= 2 * 60 * 60 * 1000; // 1 min to 2 hours
            }
            return value >= startDate; // Additional leave only needs to be on or after start date
        }),
});

const EmployeeFormDialog = ({ open, setOpenForm }: any) => {
    const { user } = useCurrentUser()
    // console.log('user', user)
    const { createLeaveRequest } = useStaffEmployeesLeave(user?.id, user?.manager?._id);
    const formik = useFormik({
        initialValues: {
            name: '',
            fatherName: '',
            empId: '',
            punchId: '',
            department: 'MI',
            leaveType: 'half-day',
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
                toast.error(error.response.data.message || error.response.data.error, { richColors: true })
            }
        }
    });

    useEffect(() => {
        if (!formik.values.startDate || !formik.values.leaveType) return;

        const start = new Date(formik.values.startDate);

        if (formik.values.leaveType === 'half-day') {
            const endDate = new Date(start.getTime() + 5 * 60 * 60 * 1000);
            formik.setFieldValue('endDate', endDate);
        } else if (formik.values.leaveType === 'additional-leave') {
            formik.setFieldValue('endDate', start);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.startDate, formik.values.leaveType]);

    const isAdditionalLeave = formik.values.leaveType === 'additional-leave';

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Employee Leave Request</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Full Name"
                            name="name"
                            required
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Father's Name"
                            name="fatherName"
                            required
                            value={formik.values.fatherName}
                            onChange={formik.handleChange}
                            error={formik.touched.fatherName && Boolean(formik.errors.fatherName)}
                            helperText={formik.touched.fatherName && formik.errors.fatherName}
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
                                    required
                                    value={formik.values.punchId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.punchId && Boolean(formik.errors.punchId)}
                                    helperText={formik.touched.punchId && formik.errors.punchId}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={theme.spacing(4)}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Department</InputLabel>
                                    <Select
                                        required
                                        name="department"
                                        value={formik.values.department}
                                        onChange={formik.handleChange}
                                        label="Department"
                                    >
                                        <MenuItem value="MI">MI</MenuItem>
                                        <MenuItem value="SMT">SMT</MenuItem>
                                        <MenuItem value="FA">FA</MenuItem>
                                        <MenuItem value="DC_CABLE">DC_CABLE</MenuItem>
                                        <MenuItem value="MOULDING">MOULDING</MenuItem>
                                        <MenuItem value="LASER">LASER</MenuItem>
                                        <MenuItem value="WAREHOUSE">WAREHOUSE</MenuItem>
                                        <MenuItem value="QUALITY">QUALITY</MenuItem>
                                        <MenuItem value="MENTAINCE">MENTAINCE</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Leave Type</InputLabel>
                                    <Select
                                        name="leaveType"
                                        required
                                        value={formik.values.leaveType}
                                        onChange={formik.handleChange}
                                        label="Leave Type"
                                    >
                                        <MenuItem value="half-day">Half Day</MenuItem>
                                        <MenuItem value="gate-pass">Gate Pass</MenuItem>
                                        <MenuItem value="additional-leave">Additional Leave</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Reason"
                            required
                            name="reason"
                            multiline
                            rows={4}
                            value={formik.values.reason}
                            onChange={formik.handleChange}
                            error={formik.touched.reason && Boolean(formik.errors.reason)}
                            helperText={formik.touched.reason && formik.errors.reason}
                        />

                        <Box display="flex" gap={2} mt={2}>
                            {isAdditionalLeave ? (
                                <DatePicker
                                    label="Start Date"
                                    value={formik.values.startDate}
                                    onChange={(date) => formik.setFieldValue('startDate', date)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: formik.touched.startDate && Boolean(formik.errors.startDate),
                                            helperText: formik.touched.startDate && !!formik.errors.startDate,
                                        },
                                    }}
                                />
                            ) : (
                                <DateTimePicker
                                    label="Start Date"
                                    value={formik.values.startDate}
                                    onChange={(date) => formik.setFieldValue('startDate', date)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: formik.touched.startDate && Boolean(formik.errors.startDate),
                                            helperText: formik.touched.startDate && !!formik.errors.startDate,
                                        },
                                    }}
                                />
                            )}

                            {isAdditionalLeave ? (
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
                            ) : (
                                <DateTimePicker
                                    label="End Date"
                                    value={formik.values.endDate}
                                    onChange={(date) => formik.setFieldValue('endDate', date)}
                                    minDateTime={
                                        formik.values.leaveType === 'gate-pass'
                                            ? new Date(formik.values.startDate.getTime() + 60000) // +1 min
                                            : undefined
                                    }
                                    maxDateTime={
                                        formik.values.leaveType === 'gate-pass'
                                            ? new Date(formik.values.startDate.getTime() + 2 * 60 * 60 * 1000) // +2 hours
                                            : undefined
                                    }
                                    disabled={formik.values.leaveType === 'half-day'}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: formik.touched.endDate && Boolean(formik.errors.endDate),
                                            helperText: (
                                                formik.touched.endDate && !!formik.errors.endDate
                                            ) || (
                                                    formik.values.leaveType === 'gate-pass'
                                                        ? 'Select 1 minute to 2 hours'
                                                        : undefined
                                                ),
                                        },
                                    }}
                                />
                            )}
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



























// /* eslint-disable @typescript-eslint/no-explicit-any */
// // components/EmployeeFormDialog.tsx
// 'use client';
// import React, { useEffect } from 'react'; // Added useEffect
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     Button,
//     Box,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Grid
// } from '@mui/material';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { DateTimePicker } from '@mui/x-date-pickers';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { toast } from 'sonner';
// import theme from '@/theme/theme';
// import { useCurrentUser } from '@/hooks/useCurrentUser';
// import { useStaffEmployeesLeave } from '@/hooks/staff/useStaffEmployeesLeave';

// // Updated validation schema with custom rules
// const validationSchema = Yup.object({
//     name: Yup.string().required('Name is required'),
//     fatherName: Yup.string().required('Father Name is required'),
//     empId: Yup.string(),
//     punchId: Yup.string().required('Punch ID is required'),
//     department: Yup.string().required('Department is required'),
//     leaveType: Yup.string().required('Leave type is required'),
//     reason: Yup.string().required('Reason is required'),
//     startDate: Yup.date().required('Start date is required'),
//     endDate: Yup.date()
//         .required('End date is required')
//         .test('end-date-validation', 'Invalid end time for leave type', function (value) {
//             const { leaveType, startDate } = this.parent;
//             if (!(value instanceof Date) || !(startDate instanceof Date)) return false;

//             const timeDiff = value.getTime() - startDate.getTime();

//             if (leaveType === 'half-day') {
//                 return timeDiff === 5 * 60 * 60 * 1000; // Exactly 5 hours
//             } else if (leaveType === 'gate-pass') {
//                 return timeDiff >= 60000 && timeDiff <= 2 * 60 * 60 * 1000; // 1 min to 2 hours
//             }
//             return value > startDate; // Additional leave only needs to be after
//         }),
// });

// const EmployeeFormDialog = ({ open, setOpenForm }: any) => {
//     const { user }: any = useCurrentUser()
//     const { createLeaveRequest, } = useStaffEmployeesLeave(user?.id);
//     const formik = useFormik({
//         initialValues: {
//             name: '',
//             fatherName: '',
//             empId: '',
//             punchId: '',
//             department: 'MI',
//             leaveType: 'half-day',
//             reason: '',
//             startDate: new Date(),
//             endDate: new Date(),
//         },
//         validationSchema,
//         onSubmit: async (values, { resetForm }) => {
//             try {
//                 const res = await createLeaveRequest(values);
//                 toast.success(res.message, { richColors: true })
//                 setOpenForm(false);
//                 resetForm()
//             } catch (error: any) {
//                 console.log('error', error)
//                 toast.error(error.response.data.message || error.response.data.error, { richColors: true })
//             }
//         }
//     });

//     // Automatically adjust endDate when startDate or leaveType changes
//     useEffect(() => {
//         if (!formik.values.startDate || !formik.values.leaveType) return;

//         const start = new Date(formik.values.startDate);

//         if (formik.values.leaveType === 'half-day') {
//             const endDate = new Date(start.getTime() + 5 * 60 * 60 * 1000);
//             formik.setFieldValue('endDate', endDate);
//         }
//         // Reset to startDate for additional-leave
//         else if (formik.values.leaveType === 'additional-leave') {
//             formik.setFieldValue('endDate', start);
//         }
//     }, [formik.values.startDate, formik.values.leaveType]);

//     return (
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Dialog open={open} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
//                 <DialogTitle>
//                     Employee Leave Request
//                 </DialogTitle>
//                 <form onSubmit={formik.handleSubmit}>
//                     <DialogContent>
//                         {/* ... other form fields remain unchanged ... */}



//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             label="Full Name"
//                             name="name"
//                             required
//                             value={formik.values.name}
//                             onChange={formik.handleChange}
//                             error={formik.touched.name && Boolean(formik.errors.name)}
//                             helperText={formik.touched.name && formik.errors.name}
//                         />
//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             label="Father's Name"
//                             name="fatherName"
//                             required
//                             value={formik.values.fatherName}
//                             onChange={formik.handleChange}
//                             error={formik.touched.fatherName && Boolean(formik.errors.fatherName)}
//                             helperText={formik.touched.fatherName && formik.errors.fatherName}
//                         />
//                         <Grid container spacing={theme.spacing(4)}>
//                             <Grid size={{ xs: 12, md: 6 }}>
//                                 <TextField
//                                     fullWidth
//                                     margin="normal"
//                                     label="Employee ID"
//                                     name="empId"
//                                     value={formik.values.empId}
//                                     onChange={formik.handleChange}
//                                     error={formik.touched.empId && Boolean(formik.errors.empId)}
//                                     helperText={formik.touched.empId && formik.errors.empId}
//                                 />
//                             </Grid>
//                             <Grid size={{ xs: 12, md: 6 }}>
//                                 <TextField
//                                     fullWidth
//                                     margin="normal"
//                                     label="Punch ID"
//                                     name="punchId"
//                                     required
//                                     value={formik.values.punchId}
//                                     onChange={formik.handleChange}
//                                     error={formik.touched.punchId && Boolean(formik.errors.punchId)}
//                                     helperText={formik.touched.punchId && formik.errors.punchId}
//                                 />
//                             </Grid>
//                         </Grid>
//                         <Grid container spacing={theme.spacing(4)}>
//                             <Grid size={{ xs: 12, md: 6 }}>
//                                 <FormControl fullWidth margin="normal">
//                                     <InputLabel>Department</InputLabel>
//                                     <Select
//                                         required
//                                         name="department"
//                                         value={formik.values.department}
//                                         onChange={formik.handleChange}
//                                         label="Department"
//                                     >
//                                         <MenuItem value="MI">MI</MenuItem>
//                                         <MenuItem value="SMT">SMT</MenuItem>
//                                         <MenuItem value="FA">FA</MenuItem>
//                                         <MenuItem value="DC_CABLE">DC_CABLE</MenuItem>
//                                         <MenuItem value="MOULDING">MOULDING</MenuItem>
//                                         <MenuItem value="LASER">LASER</MenuItem>
//                                         <MenuItem value="WAREHOUSE">WAREHOUSE</MenuItem>
//                                         <MenuItem value="QUALITY">QUALITY</MenuItem>
//                                         <MenuItem value="MENTAINCE">MENTAINCE</MenuItem>
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                             <Grid size={{ xs: 12, md: 6 }}>
//                                 <FormControl fullWidth margin="normal">
//                                     <InputLabel>Leave Type</InputLabel>
//                                     <Select
//                                         name="leaveType"
//                                         required
//                                         value={formik.values.leaveType}
//                                         onChange={formik.handleChange}
//                                         label="Leave Type"
//                                     >
//                                         <MenuItem value="half-day">Half Day</MenuItem>
//                                         <MenuItem value="gate-pass">Gate Pass</MenuItem>
//                                         <MenuItem value="additional-leave">Additional Leave</MenuItem>
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                         </Grid>

//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             label="Reason"
//                             required
//                             name="reason"
//                             multiline
//                             rows={4}
//                             value={formik.values.reason}
//                             onChange={formik.handleChange}
//                             error={formik.touched.reason && Boolean(formik.errors.reason)}
//                             helperText={formik.touched.reason && formik.errors.reason}
//                         />






//                         <Box display="flex" gap={2} mt={2}>
//                             <DateTimePicker
//                                 label="Start Date"
//                                 value={formik.values.startDate}
//                                 onChange={(date) => formik.setFieldValue('startDate', date)}
//                                 slotProps={{
//                                     textField: {
//                                         fullWidth: true,
//                                         error: formik.touched.startDate && Boolean(formik.errors.startDate),
//                                         helperText: formik.touched.startDate && formik.errors.startDate,
//                                     },
//                                 }}
//                             />
//                             <DateTimePicker
//                                 label="End Date"
//                                 value={formik.values.endDate}
//                                 onChange={(date) => formik.setFieldValue('endDate', date)}
//                                 minDateTime={
//                                     formik.values.leaveType === 'gate-pass'
//                                         ? new Date(formik.values.startDate.getTime() + 60000) // +1 min
//                                         : undefined
//                                 }
//                                 maxDateTime={
//                                     formik.values.leaveType === 'gate-pass'
//                                         ? new Date(formik.values.startDate.getTime() + 2 * 60 * 60 * 1000) // +2 hours
//                                         : undefined
//                                 }
//                                 disabled={formik.values.leaveType === 'half-day'}
//                                 slotProps={{
//                                     textField: {
//                                         fullWidth: true,
//                                         error: formik.touched.endDate && Boolean(formik.errors.endDate),
//                                         helperText: (
//                                             formik.touched.endDate && formik.errors.endDate
//                                         ) || (
//                                                 formik.values.leaveType === 'gate-pass'
//                                                     ? 'Select 1 minute to 2 hours'
//                                                     : undefined
//                                             ),
//                                     },
//                                 }}
//                             />
//                         </Box>

//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setOpenForm(false)}>Cancel</Button>
//                         <Button type="submit" variant="contained">
//                             Submit Leave Request
//                         </Button>
//                     </DialogActions>
//                 </form>
//             </Dialog>
//         </LocalizationProvider>
//     );
// };

// export default EmployeeFormDialog;