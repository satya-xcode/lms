/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
// import useSWR from 'swr';

export const useLeavesManageByManager = (
    { managerId, status }: {
        managerId?: string;
        status?: string;
    }
) => {
    const shouldFetch = Boolean(managerId) && Boolean(status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const queryParams = new URLSearchParams();

    if (managerId) queryParams.append('managerId', managerId);
    if (status) queryParams.append('status', status);

    const key = useMemo(() => (
        shouldFetch ? `/api/managers/leaves?${queryParams.toString()}` : null
    ), [shouldFetch, queryParams]);

    const { data, error, isLoading, mutate } = useSWR(key);

    const approveLeaveRequest = async (requestId: string, requestType: string) => {
        try {
            // Optional: optimistic update
            const optimisticData = data?.data?.filter((req: any) => req._id !== requestId);
            mutate(optimisticData, false); // optimistic update (disable revalidation)
            const response = await axios.post(`/api/managers/leaves/approve?id=${requestId}&requestType=${requestType}`);
            mutate(); // revalidate
            return response.data;
        } catch (err) {
            mutate(); // fallback to original state
            throw err;
        }
    };

    const rejectLeaveRequest = async (requestId: string) => {
        try {
            const optimisticData = data?.data?.filter((req: any) => req._id !== requestId);
            mutate(optimisticData, false);
            const response = await axios.post(`/api/managers/leaves/reject?id=${requestId}`);
            mutate(); // revalidate
            return response.data;
        } catch (err) {
            mutate();
            throw err;
        }
    };

    return {
        data: data?.data,
        isLoading,
        error,
        approveLeaveRequest,
        rejectLeaveRequest
    };
};
