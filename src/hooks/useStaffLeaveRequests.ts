// hooks/useStaffLeaveRequests.ts
'use client'

import axios from "axios";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

type CreateLeaveRequestInput = {
    type: 'half-day' | 'full-day' | 'gate-pass' | 'late-pass';
    reason: string;
    startDate?: Date;
    endDate?: Date;
    startTime?: Date;
    endTime?: Date;
};

export const useStaffLeaveRequests = ({ staffId, status, type }: {
    staffId?: string;
    status?: string;
    type?: string;
}) => {
    const shouldFetch = Boolean(staffId) && Boolean(status);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const queryParams = new URLSearchParams();
    if (staffId) queryParams.append('staffId', staffId);
    if (status) queryParams.append('status', status);
    if (type) queryParams.append('type', type);

    const key = useMemo(() => (
        shouldFetch ? `/api/leave/requests?${queryParams.toString()}` : null
    ), [shouldFetch, queryParams]);

    const { data, error, isLoading, mutate } = useSWR(key);

    const createStaffLeaveRequest = useCallback(async (data: CreateLeaveRequestInput) => {
        try {
            // Transform the data based on type
            const requestData = {
                type: data.type,
                reason: data.reason,
                ...(data.type === 'full-day'
                    ? { startDate: data.startDate, endDate: data.endDate }
                    : { startTime: data.startTime, endTime: data.endTime }
                )
            };

            const response = await axios.post(`/api/leave/requests`, requestData);
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