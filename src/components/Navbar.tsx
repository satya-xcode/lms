/* eslint-disable @typescript-eslint/no-explicit-any */
// Placeholder for Navbar.tsx'use client';
'use client'
import { useSession, signOut } from 'next-auth/react';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
    const { data: session }: any = useSession();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>TIANYIN LMS</Typography>
                {session?.user ? (
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Button color="inherit" component={Link} href="/about">About</Button>
                        <Button color="inherit" component={Link} href="/contact">Contact</Button>
                        <Typography>{session.user.name} ( {session.user.role} )</Typography>
                        <Button color="inherit" onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}>Logout</Button>
                    </Stack>
                ) : (
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Button color="inherit" component={Link} href="/about">About</Button>
                        <Button color="inherit" component={Link} href="/contact">Contact</Button>
                        <Button color="inherit" component={Link} href="/login">Login</Button>
                    </Stack>

                )}
            </Toolbar>
        </AppBar>
    );
}
