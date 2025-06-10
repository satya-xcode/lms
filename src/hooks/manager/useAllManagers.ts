import useSWR from "swr";

interface Manager {
    _id: string;
    name: string;
    email: string;
}

export const useAllManagers = () => {
    const { data, isLoading, error } = useSWR<Manager[]>('/api/managers');
    return {
        managers: data,
        isLoading,
        error
    }
}