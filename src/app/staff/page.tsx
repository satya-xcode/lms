/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth';
import { Box, Typography } from '@mui/material';
import { authOptions } from '@/lib/auth/authOptions';

export default async function DashboardPage() {
    const session: any = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "staff") {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h5" color="error">Access Denied</Typography>
                <Typography>Please login with a Staff account to continue.</Typography>
            </Box>
        );
    }

    return <div>Staff Dashboard</div>;
}
