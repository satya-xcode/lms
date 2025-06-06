/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useStaffEmployees.ts
import useSWR from 'swr';
import axios from 'axios';

export const useStaffEmployeesLeave = (staffId?: string) => {
    const { data, error, mutate, isLoading } = useSWR(
        staffId ? `/api/staffs/employee/leaves?staffId=${staffId}` : null,
        url => axios.get(url).then(res => res.data)
    );

    const createLeaveRequest = async (leaveData: any) => {
        try {
            const response = await axios.post(`/api/staffs/employee/leaves?staffId=${staffId}`, leaveData);
            mutate();
            return response.data;
        } catch (err) {
            throw err;
        }
    };


    const updateEmployee = async (id: string, employeeData: any) => {
        try {
            const response = await axios.put(`/api/staff/${staffId}/employees/${id}`, employeeData);
            mutate();
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const deleteEmployeeLeave = async (employeeId: string, staffId: string) => {
        try {
            await axios.delete(`/api/staffs/employee/leaves?employeeId=${employeeId}&staffId=${staffId}`);
            mutate();
        } catch (err) {
            throw err;
        }
    };

    return {
        employees: data?.data,
        isLoading: isLoading,
        error,
        createLeaveRequest,
        updateEmployee,
        deleteEmployeeLeave,
        mutate
    };
};