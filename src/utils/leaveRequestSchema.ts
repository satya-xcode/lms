/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/validationSchemas.ts
import * as yup from 'yup';
// import { LeaveRequestType } from '@/models/LeaveRequest';

const commonFields = {
    reason: yup.string().required('Reason is required').max(500, 'Reason should be less than 500 characters'),
};

export const leaveRequestSchemas: any = {
    'half-day': yup.object().shape({
        ...commonFields,
        startTime: yup.date().required('Start time is required'),
        endTime: yup.date()
            .required('End time is required')
            .min(yup.ref('startTime'), 'End time must be after start time')
            .test(
                'is-half-day',
                'Half-day leave should be exactly 4 hours',
                function (endTime) {
                    const startTime = this.parent.startTime;
                    if (!startTime || !endTime) return true;
                    const diffHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                    // Changed to exactly 2 hours (±10 minutes tolerance)
                    // return diffHours >= 1.83 && diffHours <= 2.17; // for 2 hours
                    return diffHours >= 3.5 && diffHours <= 4.5; // for 4 hours
                }
            ),
    }),
    'full-day': yup.object().shape({
        ...commonFields,
        startDate: yup.date().required('Start date is required'),
        endDate: yup.date()
            .required('End date is required')
            .min(yup.ref('startDate'), 'End date must be after start date')
            .test(
                'is-single-day',
                'Full-day leave should be for one day only',
                function (endDate) {
                    const startDate = this.parent.startDate;
                    if (!startDate || !endDate) return true;
                    return startDate.toDateString() === endDate.toDateString();
                }
            ),
    }),
    'additional-leave': yup.object().shape({
        ...commonFields,
        startDate: yup.date().required('Start date is required'),
        endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date'),
    }),
    'gate-pass': yup.object().shape({
        ...commonFields,
        startTime: yup.date().required('Start time is required'),
        endTime: yup.date()
            .required('End time is required')
            .min(yup.ref('startTime'), 'End time must be after start time')
            .test(
                'is-valid-duration',
                'Gate pass duration must be 2 hours',
                function (endTime) {
                    const startTime = this.parent.startTime;
                    if (!startTime || !endTime) return true;
                    const diffHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                    return diffHours >= 1.83 && diffHours <= 2.17;
                    // return diffMinutes >= 1 && diffMinutes <= 120;
                }
            ),
    }),
    'late-pass': yup.object().shape({
        ...commonFields,
        startTime: yup
            .date()
            .required('Start time is required'),
        endTime: yup
            .date()
            .required('End time is required')
            .min(yup.ref('startTime'), 'End time must be after start time')
            .test(
                'is-valid-duration',
                'Late pass duration must be between 1 and 30 minutes',
                function (endTime: any) {
                    const { startTime } = this.parent;
                    if (!startTime || !endTime) return true; // Skip if one is missing; required check handles it
                    const diffMinutes = (endTime - startTime) / (1000 * 60); // Convert milliseconds to minutes
                    return diffMinutes >= 1 && diffMinutes <= 30;
                }
            ),
    }),
};

// export type LeaveRequestFormValues = {
//     name:string,
//     type: LeaveRequestType;
//     reason: string;
//     startDate?: Date;
//     endDate?: Date;
//     startTime?: Date;
//     endTime?: Date;
// };