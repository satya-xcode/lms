/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    AppBar,
    Avatar,
    Box,
    CircularProgress,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    // useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    Logout as LogoutIcon,
    People,
    AccountCircle,
    Assignment,
    Home,
    HowToReg,
    Group,
} from '@mui/icons-material';
import { ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Replace with react-router-dom for React Router
// import SignOutButton from './SignOutButton';
import { signOut } from 'next-auth/react';
import theme from '@/theme/theme';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLeavesManageByManager } from '@/hooks/manager/useLeavesManageByManager';
const drawerWidth = 240;
interface DashboardLayoutProps {
    children: ReactNode;
}




export default function DashboardLayout({ children }: DashboardLayoutProps) {
    // const theme = useTheme();
    const { isLoading, user }: any = useCurrentUser()
    const { data: pendingRequests } = useLeavesManageByManager({ managerId: user?.id, status: 'pending' })
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter()
    const pathname = usePathname();


    // Role-based navigation configuration
    const roleNavigation: any = {
        admin: [
            { label: 'Dashboard', href: '/admin', icon: <Dashboard /> },
            { label: 'Members', href: '/admin/members', icon: <People /> },
            // { label: 'Managers', href: '/admin/managers', icon: <People /> },
            // { label: 'Staffs', href: '/admin/staffs', icon: <People /> },
            { label: 'My Account', href: '/admin/account', icon: <AccountCircle /> }
        ],
        manager: [
            { label: 'Dashboard', href: '/manager', icon: <Dashboard /> },
            { label: 'Staff History', href: '/manager/staff-history', icon: <People /> },
            { label: 'Leave History', href: '/manager/leave-history', icon: <Assignment />, pending: pendingRequests?.length || 'No Pendings' },
            { label: 'My Account', href: '/manager/my-account', icon: <AccountCircle /> }
        ],
        staff: [
            { label: 'Dashboard', href: '/staff', icon: <Home /> },
            { label: 'Apply Leave', href: '/staff/apply-leave', icon: <HowToReg /> },
            { label: 'Leaves History', href: '/staff/leave-history', icon: <Assignment /> },
            { label: 'Employee Leaves', href: '/staff/employee-leaves', icon: <Group /> },
            { label: 'My Account', href: '/staff/my-account', icon: <AccountCircle /> }
        ]
    };




    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    // Get navigation items based on user role
    const navItems = roleNavigation[user?.role] || [];
    const drawer = (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ textTransform: 'uppercase', color: 'white', fontWeight: 'bold', my: theme.spacing(2) }}>
                Tianyin Panel
            </Typography>
            {/* <Divider /> */}
            <List>
                {navItems?.map((item: any) => {
                    const isActive = pathname === item.href;
                    return (
                        <ListItemButton
                            key={item.label}
                            selected={isActive}
                            onClick={() => {
                                router.push(item.href);
                                setMobileOpen(false);
                            }}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} secondary={<Typography sx={{ color: 'orange' }} fontWeight={'bold'} variant='subtitle1'>{item?.pending}</Typography>} />
                        </ListItemButton>
                    );
                })}

                <ListItemButton
                    onClick={() => {
                        // router.push(item.href);
                        signOut({ redirect: true, callbackUrl: '/' })
                        setMobileOpen(false);
                    }}
                    sx={{
                        '&.Mui-selected': {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '& .MuiListItemIcon-root': {
                                color: 'primary.contrastText',
                            },
                        },
                    }}
                >
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText primary={'Logout'} />
                </ListItemButton>


            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    // bgcolor: 'background.paper',
                    // color: 'text.primary',
                    // boxShadow: theme.shadows[1],
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography flexGrow={1} variant="h5" fontWeight={'bold'} textTransform={'capitalize'} noWrap>
                        {user?.role} Dashboard
                    </Typography>
                    {
                        isLoading ? (
                            <Box sx={{ px: 2 }}>
                                <CircularProgress color="inherit" size={20} thickness={4} />
                            </Box>
                        ) : user && (
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
                                        {user.name?.charAt(0) || user.email?.charAt(0)}
                                    </Avatar>
                                    <Typography variant="subtitle2" noWrap>
                                        <Box component="span" fontWeight="medium">
                                            {user.name}
                                        </Box>
                                        <Box component="span" color="text.secondary" ml={1} fontSize="0.75rem">
                                            ({user.role})
                                        </Box>
                                    </Typography>
                                </Box>

                            </>
                        )
                    }

                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="menu navigation"
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            border: 0,
                            // borderRight: `1px solid ${theme.palette.divider}`,
                            bgcolor: 'primary.main'
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: theme.spacing(2),
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: { xs: 8, md: 8 },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
