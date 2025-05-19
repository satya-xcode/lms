import useSWR from "swr";

export const useStaffLeaveBalance = ({ staffId }: { staffId?: string }) => {
    const shouldFetch = Boolean(staffId);
    const { data, error, isLoading } = useSWR(shouldFetch ? `/api/staff/${staffId}/leave-balance` : null);
    return {
        data: data?.data,
        isLoading,
        error
    };
};
