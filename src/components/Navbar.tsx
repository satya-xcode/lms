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
    Box,
    Avatar,
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
                    <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
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
                    {/* <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        {commonLinks.map(({ label, href }) => (
                            <Button key={href} color="inherit" sx={{ textTransform: 'uppercase' }} component={Link} href={href}>
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
                            <Button sx={{ textTransform: 'uppercase' }} color="inherit" component={Link} href="/login">
                                Login
                            </Button>
                        )}
                    </Stack> */}



                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={3}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            ml: 3 // Add some left margin for better spacing
                        }}
                    >
                        {commonLinks.map(({ label, href }) => (
                            <Button
                                key={href}
                                color="inherit"
                                component={Link}
                                href={href}
                                sx={{
                                    textTransform: 'none', // More modern than uppercase
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                    letterSpacing: '0.02em',
                                    '&:hover': {
                                        color: 'primary.light',
                                        backgroundColor: 'transparent'
                                    },
                                    borderRadius: 1,
                                    px: 1.5,
                                    py: 1
                                }}
                            >
                                {label}
                            </Button>
                        ))}

                        {status === 'loading' ? (
                            <Box sx={{ px: 2 }}>
                                <CircularProgress color="inherit" size={20} thickness={4} />
                            </Box>
                        ) : session?.user ? (
                            <>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 1,
                                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.12)'
                                    }
                                }}>
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: 'primary.main',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                                    </Avatar>
                                    <Typography variant="subtitle2" noWrap>
                                        <Box component="span" fontWeight="medium">
                                            {session.user.name}
                                        </Box>
                                        <Box component="span" color="text.secondary" ml={1} fontSize="0.75rem">
                                            ({session.user.role})
                                        </Box>
                                    </Typography>
                                </Box>
                                <SignOutButton

                                />
                            </>
                        ) : (
                            <Button
                                color="inherit"
                                component={Link}
                                href="/login"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    px: 2.5,
                                    py: 0.8,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: 'primary.light'
                                    }
                                }}
                            >
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