'use client'
import axios from "axios";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

type CreateLeaveRequestInput = {
    startDate?: Date;
    endDate?: Date;
    reason?: string;
    // add more fields as needed
};

export const useStaffLeaveRequests = ({ staffId, status }: { staffId?: string, status?: string }) => {
    const shouldFetch = Boolean(staffId) && Boolean(status);

    const key = useMemo(() => (
        shouldFetch ? `/api/leave/requests?staffId=${staffId}&status=${status}` : null
    ), [shouldFetch, staffId, status]);

    const { data, error, isLoading, mutate } = useSWR(key);

    const createStaffLeaveRequest = useCallback(async (data: CreateLeaveRequestInput) => {
        try {
            const response = await axios.post(`/api/leave/requests`, data);
            mutate(); // optionally pass false to avoid revalidation
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
