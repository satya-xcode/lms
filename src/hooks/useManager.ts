// import { fetcher } from "@/lib/fetcher";
// import axios from "axios";
import axios from "axios";
import useSWR from "swr";

export const useManager = ({ managerId }: { managerId?: string }) => {
    const isManagerId = Boolean(managerId)
    const { data, error, isLoading, mutate } = useSWR(isManagerId ? `api/leave/requests?managerId=${managerId}` : null);

    const approveLeaveRequest = async (requestId: string) => {
        try {
            const response = await axios.post(`/api/leave/${requestId}/approve`, data);
            mutate();
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    const rejectLeaveRequest = async (requestId: string) => {
        try {
            const response = await axios.post(`/api/leave/${requestId}/reject`, data);
            mutate();
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    return {
        data: data?.data,
        isLoading,
        error,
        approveLeaveRequest,
        rejectLeaveRequest
    };

}