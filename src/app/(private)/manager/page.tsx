'use client'

import { colors, Grid } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { DashboardCard } from '@/components/manager/DashboardCard'
import { useStaffsByManagers } from '@/hooks/manager/useStaffsByManagers'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { CloseTwoTone } from '@mui/icons-material'
import { useLeavesManageByManager } from '@/hooks/manager/useLeavesManageByManager'

export default function ManagerDashboard() {
    const { user } = useCurrentUser()
    const { total: totalStaffs } = useStaffsByManagers({ managerId: String(user?.id) })
    const { data: pendingLeaves } = useLeavesManageByManager({ managerId: user?.id, status: 'pending' })
    const { data: approvedLeaves } = useLeavesManageByManager({ managerId: user?.id, status: 'approved' })
    const { data: rejectedLeaves } = useLeavesManageByManager({ managerId: user?.id, status: 'rejected' })
    return (
        <>
            {/* <Typography variant="h5" mb={3}>
                Manager Dashboard
            </Typography> */}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard
                        title="Total Staffs"
                        value={totalStaffs || 0}
                        icon={<GroupIcon />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard
                        title="Total Leaves"
                        value={parseInt(pendingLeaves?.length) + parseInt(approvedLeaves?.length) + parseInt(rejectedLeaves?.length) || 0}
                        icon={<EventAvailableIcon />}
                        color="#9c27b0"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard
                        title="Approved Leaves"
                        value={approvedLeaves?.length || 0}
                        icon={<CheckCircleIcon />}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard
                        title="Pending Leaves"
                        value={pendingLeaves?.length || 0}
                        icon={<HourglassEmptyIcon />}
                        color="#f57c00"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard
                        title="Rejected Leaves"
                        value={rejectedLeaves?.length || 0}
                        icon={<CloseTwoTone />}
                        color={colors.red[500]}
                    />
                </Grid>
            </Grid>
        </>
    )
}



















