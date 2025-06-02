/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useStaffsByManagers } from '@/hooks/manager/useStaffsByManagers'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { DataTable } from '@/components/manager/DataTable'
import { toast } from 'sonner'
import { Delete } from '@mui/icons-material'

function StaffHistory() {
    const { user } = useCurrentUser()
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const { data = [], total, deleteStaff } = useStaffsByManagers({
        managerId: String(user?.id),
        page,
        pageSize,
    })

    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'mobile',
                header: 'Mobile'
            },
            {
                accessorKey: 'role',
                header: 'Role',
            },
        ],
        []
    )

    return (
        <DataTable
            title="Staff History"
            columns={columns}
            data={data}
            totalCount={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onEdit={(row: any) => console.log('Edit', row)}
            onDelete={(row: any) => {
                toast.warning('Are sure to delete', {
                    cancel: {
                        label: 'Cancel',
                        onClick: () => console.log('Cancel!'),
                    },
                    action: {
                        label: 'Delete',
                        onClick: () => deleteStaff(String(user?.id), row._id)
                    },
                    richColors: true, closeButton: true, icon: <Delete />
                });

            }}
        />
    )
}

export default StaffHistory
