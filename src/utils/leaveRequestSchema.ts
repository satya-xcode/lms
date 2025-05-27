// utils/validationSchemas.ts
import * as yup from 'yup';
import { LeaveRequestType } from '@/models/LeaveRequest';

const commonFields = {
    reason: yup.string().required('Reason is required').max(500, 'Reason should be less than 500 characters'),
};

export const leaveRequestSchemas = {
    'half-day': yup.object().shape({
        ...commonFields,
        startTime: yup.date().required('Start time is required'),
        endTime: yup.date()
            .required('End time is required')
            .min(yup.ref('startTime'), 'End time must be after start time')
            .test(
                'is-half-day',
                'Half-day leave should be approximately 4 hours',
                function (endTime) {
                    const startTime = this.parent.startTime;
                    if (!startTime || !endTime) return true;
                    const diffHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                    return diffHours >= 3.5 && diffHours <= 4.5;
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
    'gate-pass': yup.object().shape({
        ...commonFields,
        startTime: yup.date().required('Start time is required'),
        endTime: yup.date()
            .required('End time is required')
            .min(yup.ref('startTime'), 'End time must be after start time')
            .test(
                'is-valid-duration',
                'Gate pass duration must be between 1 minute and 2 hours',
                function (endTime) {
                    const startTime = this.parent.startTime;
                    if (!startTime || !endTime) return true;
                    const diffMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                    return diffMinutes >= 1 && diffMinutes <= 120;
                }
            ),
    }),
    'late-pass': yup.object().shape({
        ...commonFields,
        startTime: yup.date().required('Start time is required'),
        endTime: yup.date()
            .required('End time is required')
            .min(yup.ref('startTime'), 'End time must be after start time')
            .test(
                'is-valid-duration',
                'Late pass duration must be between 1 minute and 30 minutes',
                function (endTime) {
                    const startTime = this.parent.startTime;
                    if (!startTime || !endTime) return true;
                    const diffMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                    return diffMinutes >= 1 && diffMinutes <= 30;
                }
            ),
    }),
};

export type LeaveRequestFormValues = {
    type: LeaveRequestType;
    reason: string;
    startDate?: Date;
    endDate?: Date;
    startTime?: Date;
    endTime?: Date;
};