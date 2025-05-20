import {
    Card,
    CardContent,
    CardHeader,
    Container,
    IconButton,
    Skeleton,
    Stack,
} from '@mui/material';
import { ArrowBack, MoreHoriz as More } from '@mui/icons-material';

export default function ManagerAuthCheckingLoader() {
    return (
        <Container maxWidth="lg">
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
                    <Stack spacing={1}>
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                        <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={50} />
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}
