/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCurrentUser.ts
'use client'
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

type UserRole = 'admin' | 'staff' | 'manager';

interface MonthlyLimits {
    halfDayLeaves: number;
    fullDayLeaves: number;
    gatePasses: number;
    latePasses: number;
}

interface UserDetails {
    id: string;
    name: string;
    fatherName: string;
    empId: string;
    punchId: string;
    email: string;
    mobile: string;
    role: UserRole;
    department: string;
    additionalLeave: number
    monthlyLimits: MonthlyLimits;
    manager?: {
        _id: string;
        name: string;
        email: string;
    };
    joinDate?: Date;
    isActive?: boolean;
}

export const useCurrentUser = () => {
    const { data: session, status }: any = useSession();
    const userId = session?.user?.id;

    const {
        data,
        error,
        isLoading,
        mutate
    } = useSWR<UserDetails>(userId ? `/api/user/${userId}` : null);

    return {
        user: data,
        isLoading: isLoading || status === 'loading',
        error,
        isAuthenticated: status === 'authenticated',
        isUnAuthenticated: status === 'unauthenticated',
        mutateUser: mutate
    };
};