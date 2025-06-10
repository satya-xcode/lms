/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useStaffEmployees.ts
import useSWR from 'swr';
import axios from 'axios';
import qs from 'query-string';
export const useStaffEmployeesLeave = (staffId?: string, leaveType?: string) => {
    // Construct query parameters properly
    const queryParams = qs.stringify({
        staffId,
        leaveType: leaveType || undefined // Only include leaveType if it has a value
    }, { skipNull: true, skipEmptyString: true });

    const apiUrl = staffId ? `/api/staffs/employee/leaves?${queryParams}` : null;

    const { data, error, mutate, isLoading } = useSWR(
        apiUrl,
        url => axios.get(url).then(res => res.data),
        { revalidateOnFocus: false }
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