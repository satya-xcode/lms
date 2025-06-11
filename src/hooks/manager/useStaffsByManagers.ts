// hooks/useStaffsByManagers.ts
import axios from 'axios'
import useSWR from 'swr'

interface Params {
    managerId?: string
    page?: number
    pageSize?: number
}

export const useStaffsByManagers = ({ managerId, page, pageSize }: Params) => {

    const key =
        Boolean(managerId)
            ? `/api/managers/staffs?managerId=${managerId}&page=${page}&limit=${pageSize}`
            : null
    const { data, error, isLoading, mutate } = useSWR(key)

    const addStaff = async (data: unknown) => {
        try {
            const response = await axios.post(`/api/managers/staffs`, data);
            mutate(); // revalidate
            return response.data;
        } catch (err) {
            mutate(); // fallback to original state
            throw err;
        }
    };

    const deleteStaff = async (managerId: string, staffId: string) => {
        try {
            const response = await axios.delete(`/api/managers/staffs?managerId=${managerId}&staffId=${staffId}`);
            mutate(); // revalidate
            return response.data;
        } catch (err) {
            mutate(); // fallback to original state
            throw err;
        }
    };



    return {
        data: data?.data || [],
        total: data?.total || 0,
        page: data?.page || 0,
        isLoading,
        error,
        addStaff,
        deleteStaff
    }
}
