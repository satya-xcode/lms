import {
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    IconButton,
    Skeleton,
    Stack,
} from '@mui/material';
import { ArrowBack, MoreHoriz as More } from '@mui/icons-material';

export default function StaffDashboardSkeleton() {
    return (
        <Container maxWidth="xl">
            <Card>
                <CardHeader
                    avatar={
                        <Skeleton variant="circular">
                            <IconButton>
                                <ArrowBack />
                            </IconButton>
                        </Skeleton>
                    }
                    action={
                        <Skeleton variant="circular">
                            <IconButton>
                                <More />
                            </IconButton>
                        </Skeleton>
                    }
                    title={<Skeleton variant="text" width="40%" height={32} />}
                    subheader={<Skeleton variant="text" width="60%" />}
                />
                <CardContent>
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
                </CardContent>
            </Card>
        </Container>
    );
}
