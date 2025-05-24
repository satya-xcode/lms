import {
    Grid,
    IconButton,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import theme from '@/theme/theme';

export default function StaffDashboardSkeleton() {
    return (
        <Stack spacing={theme.spacing(2)}>
            <Stack direction={'row'} spacing={theme.spacing(2)} alignItems={'center'}>
                <Skeleton variant="circular">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Skeleton>
                <Stack>
                    <Skeleton variant="text" width="70%" height={32}>
                        <Typography>Hello Hello Hello Hello Hello Hello Hello</Typography>
                    </Skeleton>
                    <Skeleton variant="text" width="70%" height={22}>
                        <Typography>Hello Hello Hello Hello Hello</Typography>
                    </Skeleton>
                </Stack>
            </Stack>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Stack spacing={4}>
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={100} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={300} />
                    </Stack>

                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Stack spacing={1}>
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                    </Stack>

                </Grid>
            </Grid>

        </Stack>
    );
}
