/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useStaffLeaveRequests.ts
'use client'

import axios from "axios";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

// type CreateLeaveRequestInput = {
//     type: 'half-day' | 'full-day' | 'additional-leave' | 'gate-pass' | 'late-pass';
//     reason: string;
//     startDate?: Date;
//     endDate?: Date;
//     startTime?: Date;
//     endTime?: Date;
// };

export const useStaffLeaves = ({ staffId, status, type }: {
    staffId?: string;
    status?: string;
    type?: string;
}) => {
    const shouldFetch = Boolean(staffId) && Boolean(status)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const queryParams = new URLSearchParams();
    if (staffId) queryParams.append('staffId', staffId);
    if (status) queryParams.append('status', status);
    if (type) queryParams.append('type', type);

    const key = useMemo(() => (
        shouldFetch ? `/api/staffs/leaves?${queryParams.toString()}` : null
    ), [shouldFetch, queryParams]);

    const { data, error, isLoading, mutate } = useSWR(key);

    const createStaffLeaveRequest = useCallback(async (data: any) => {
        // console.log(
        //     "createStaffLeaveRequest", data
        // )
        try {
            // Transform the data based on type
            const requestData = {
                type: data.type,
                name: data?.name,
                fatherName: data?.fatherName,
                empId: data?.empId,
                punchId: data?.punchId,
                department: data?.department,
                role: data?.role,
                reason: data.reason,
                ...(data.type === 'full-day' || data.type === 'additional-leave'
                    ? { startDate: data.startDate, endDate: data.endDate }
                    : { startTime: data.startTime, endTime: data.endTime }
                )
            };
            // console.log(
            //     "createStaffLeaveRequest222222222222222222, ", requestData
            // )
            const response = await axios.post(`/api/staffs/leaves`, requestData);
            mutate();
            return response.data;
        } catch (err) {
            console.error("Failed to create leave request", err);
            throw err;
        }
    }, [mutate]);

    return {
        data: data?.data || [],
        isLoading,
        error,
        createStaffLeaveRequest,
    };
};