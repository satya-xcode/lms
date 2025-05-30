import useSWR from 'swr';

export const useStaffsByManagers = ({ managerId }: { managerId?: string }) => {
    const key = managerId ? `/api/managers/staffs?managerId=${managerId}` : null;

    const { data, error, isLoading } = useSWR(key);

    return {
        data: data?.data,
        isLoading,
        error
    };
};
