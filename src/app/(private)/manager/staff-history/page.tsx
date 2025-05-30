/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useStaffsByManagers } from '@/hooks/useStaffsByManagers'
import { Stack, Typography } from '@mui/material'
import React from 'react'

function StaffHistory() {
    const { user } = useCurrentUser()
    const { data } = useStaffsByManagers({ managerId: user?.id })

    // console.log('StaffsByManager', data)

    return (
        <Stack>

            {
                data?.map((staff: any, index: string) => {
                    return (
                        <Typography key={index}>{staff.name}</Typography>
                    )
                })
            }



        </Stack>
    )
}

export default StaffHistory