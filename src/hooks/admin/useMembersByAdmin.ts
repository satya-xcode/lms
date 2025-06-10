import axios from 'axios';
import useSWR from 'swr'
export const useMembersByAdmin = () => {

    const { data, error, isLoading, mutate } = useSWR('/api/admin/members')

    const addMember = async (data: unknown) => {
        try {
            const response = await axios.post(`/api/admin/members`, data);
            mutate(); // revalidate
            return response.data;
        } catch (err) {
            mutate(); // fallback to original state
            throw err;
        }
    };

    const deleteMember = async (managerId: string, memberId: string) => {
        try {
            const response = await axios.delete(`/api/admin/members?adminId=${managerId}&memberId=${memberId}`);
            mutate(); // revalidate
            return response.data;
        } catch (err) {
            mutate(); // fallback to original state
            throw err;
        }
    };



    return {
        members: data?.data,
        isLoading,
        error,
        addMember,
        deleteMember
    }
}
