/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutate } from 'swr';

export function useMutateApi() {
    const mutateRequest = async (
        url: string,
        method: 'POST' | 'PUT' | 'DELETE',
        body?: any,
        options?: RequestInit
    ) => {
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
                ...options,
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            // Revalidate relevant SWR data
            if (url.includes('/leave/')) {
                mutate('/api/leave/requests');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };

    return {
        post: (url: string, body: any) => mutateRequest(url, 'POST', body),
        put: (url: string, body: any) => mutateRequest(url, 'PUT', body),
        delete: (url: string) => mutateRequest(url, 'DELETE'),
    };
}

// Specialized leave mutation hooks
export function useLeaveMutations() {
    const { post, put } = useMutateApi();

    const createLeaveRequest = async (data: {
        reason: string;
        startDate: Date;
        endDate: Date;
    }) => {
        return post('/api/leave/request', data);
    };

    const approveLeaveRequest = async (requestId: string) => {
        return put(`/api/leave/${requestId}/approve`, {});
    };

    const rejectLeaveRequest = async (requestId: string) => {
        return put(`/api/leave/${requestId}/reject`, {});
    };

    return {
        createLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
    };
}