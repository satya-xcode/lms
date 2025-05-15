/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Box, Typography } from '@mui/material';

export default async function ManagerPage() {
    const session: any = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "manager") {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h5" color="error">Access Denied</Typography>
                <Typography>Please login with a manager account to continue.</Typography>
            </Box>
        );
    }

    return <div>Manager Dashboard</div>;
}
