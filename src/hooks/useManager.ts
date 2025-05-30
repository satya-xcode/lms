/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import useSWR from 'swr';

export const useManager = ({ managerId }: { managerId?: string }) => {
    const key = managerId ? `api/leave/requests?managerId=${managerId}` : null;

    const { data, error, isLoading, mutate } = useSWR(key);

    const approveLeaveRequest = async (requestId: string, requestType: string) => {
        try {
            // Optional: optimistic update
            const optimisticData = data?.data?.filter((req: any) => req._id !== requestId);
            mutate(optimisticData, false); // optimistic update (disable revalidation)
            const response = await axios.post(`/api/leave/approve?id=${requestId}&requestType=${requestType}`);
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
            const response = await axios.post(`/api/leave/reject?id=${requestId}`);
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
