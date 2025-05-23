/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import SignOutButton from './SignOutButton';

const commonLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const { data: session, status }: any = useSession();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpen = () => setDialogOpen(true);
    const handleClose = () => setDialogOpen(false);

    const authLinks = session?.user ? (
        <>
            <ListItem>
                <ListItemText primary={`${session.user.name} (${session.user.role})`} />
            </ListItem>
            <ListItem>
                <SignOutButton />
            </ListItem>
        </>
    ) : (
        <ListItem>
            <ListItemButton component={Link} href="/login" onClick={handleClose}>
                <ListItemText primary="Login" />
            </ListItemButton>
        </ListItem>
    );

    return (
        <>
            <AppBar position="static" variant='elevation' elevation={0}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        TIANYIN LMS
                    </Typography>

                    {/* Mobile menu button - hidden on desktop */}
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleOpen}
                        sx={{ display: { xs: 'flex', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Desktop navigation - hidden on mobile */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        {commonLinks.map(({ label, href }) => (
                            <Button key={href} color="inherit" component={Link} href={href}>
                                {label}
                            </Button>
                        ))}
                        {status === 'loading' ? (
                            <CircularProgress color="inherit" size={24} />
                        ) : session?.user ? (
                            <>
                                <Typography>
                                    {session.user.name} ({session.user.role})
                                </Typography>
                                <SignOutButton />
                            </>
                        ) : (
                            <Button color="inherit" component={Link} href="/login">
                                Login
                            </Button>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>

            <Dialog open={dialogOpen} onClose={handleClose} fullScreen>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Menu
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {commonLinks.map(({ label, href }) => (
                            <ListItem key={href} disablePadding>
                                <ListItemButton component={Link} href={href} onClick={handleClose}>
                                    <ListItemText primary={label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        {status === 'loading' ? (
                            <ListItem>
                                <CircularProgress size={24} />
                            </ListItem>
                        ) : (
                            authLinks
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
}