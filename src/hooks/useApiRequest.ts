import { fetcher } from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';

// Generic API request hook
export function useApiRequest<T>(url: string | null) {
    const { data, error, isLoading } = useSWR<T>(url, fetcher);

    return {
        data,
        isLoading,
        isError: error,
        error,
        mutate: () => mutate(url)
    };
}

// Leave-specific hooks
export function useLeaveRequests() {
    return useApiRequest('/api/leave/requests');
}

export function useStaffLeaveRequests(staffId: string) {
    return useApiRequest(`/api/leave/requests?staffId=${staffId}`);
}

export function usePendingLeaveRequests(managerId: string) {
    return useApiRequest(`/api/leave/requests/pending?managerId=${managerId}`);
}

export function useLeaveBalance(userId: string) {
    return useApiRequest<{ leaveBalance: number }>(`/api/user/${userId}/leave-balance`);
}