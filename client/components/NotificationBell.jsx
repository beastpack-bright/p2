import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme, blueTheme, highContrastTheme, beeTheme, pinkTheme } from '../../views/layouts/index';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const fetchNotifications = async () => {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data);
    };
    const handleMarkAsRead = async () => {
        await fetch('/api/notifications/read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setNotifications([]);
        handleClose();
    };
    

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    
    const currentTheme = lightTheme; 

    return (
        <ThemeProvider theme={currentTheme}>
            <IconButton 
                onClick={handleClick}
                sx={{
                    '& .MuiBadge-badge': {
                        backgroundColor: '#ffff00'
                    }
                }}
            >
                <Badge badgeContent={notifications.length} color="primary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <MenuItem key={notification._id} onClick={handleClose}>
                            {notification.message}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem>No new notifications</MenuItem>
                )}
                <MenuItem onClick={handleMarkAsRead}>
    Mark all as read
</MenuItem>
            </Menu>
        </ThemeProvider>
    );
};

export default NotificationBell;