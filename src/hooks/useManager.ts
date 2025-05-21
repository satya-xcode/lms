/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import useSWR from 'swr';

export const useManager = ({ managerId }: { managerId?: string }) => {
    const key = managerId ? `api/leave/requests?managerId=${managerId}` : null;

    const { data, error, isLoading, mutate } = useSWR(key);

    const approveLeaveRequest = async (requestId: string) => {
        try {
            // Optional: optimistic update
            const optimisticData = data?.data?.filter((req: any) => req._id !== requestId);
            mutate(optimisticData, false); // optimistic update (disable revalidation)

            await axios.post(`/api/leave/${requestId}/approve`);
            mutate(); // revalidate
        } catch (err) {
            mutate(); // fallback to original state
            throw err;
        }
    };

    const rejectLeaveRequest = async (requestId: string) => {
        try {
            const optimisticData = data?.data?.filter((req: any) => req._id !== requestId);
            mutate(optimisticData, false);

            await axios.post(`/api/leave/${requestId}/reject`);
            mutate(); // revalidate
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
