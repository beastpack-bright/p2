import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography
} from '@mui/material';
import {
    Home as HomeIcon,
    Create as CreateIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import NotificationBell from './NotificationBell';

const NavBar = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/user');
            if (response.ok) {
                const data = await response.json();
                if (data.isLoggedIn) {
                    setUsername(data.user.username);
                }
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const response = await fetch('/logout', { method: 'POST' });
        if (response.ok) {
            window.location.href = '/';
        }
    };

    return (
        <AppBar position="fixed" sx={{ bgcolor: 'primary.main' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                    🐺 WolfChat
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                    <Button
                        color="inherit"
                        startIcon={<HomeIcon />}
                        onClick={() => window.location.href = '/feed'}
                    >
                        Feed
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<CreateIcon />}
                        onClick={() => window.location.href = '/howls'}
                    >
                        Howl
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<PersonIcon />}
                        onClick={() => window.location.href = `/profile/${username}`}
                    >
                        Profile
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<SettingsIcon />}
                        onClick={() => window.location.href = '/settings'}
                    >
                        Settings
                    </Button>
                </Box>
                <Button
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
                <NotificationBell />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;