import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Avatar,
    Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Wheel } from '@uiw/react-color';
import { TextField } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Settings = ({ currentTheme, onThemeChange  }) => {
    const [theme, setTheme] = useState(currentTheme);
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#4a4a4a');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    
    const themes = [
        { value: 'light', label: 'Light Theme' },
        { value: 'dark', label: 'Dark Theme' },
        { value: 'blue', label: 'Blue Theme' },
        { value: 'highContrast', label: 'High Contrast' },
        { value: 'bee', label: 'Bee Theme' },
        { value: 'pink', label: 'Pink Theme' }
    ];
    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        try {
            const response = await fetch('/api/settings/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (response.ok) {
                alert('Password changed successfully.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordError('');
            } else {
                const error = await response.json();
                setPasswordError(error.message || 'Failed to change password.');
            }
        } catch (err) {
            setPasswordError('An error occurred. Please try again later.');
        }
    };
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/user');
            if (response.ok) {
                const user = await response.json();
                setCurrentAvatar(user.avatar);
                setPreviewUrl(user.avatar);
                setBackgroundColor(user.avatarColor || '#4a4a4a');
            }
        };
        fetchUser();
    }, []);

    const handleThemeChange = (event) => {
        const newTheme = event.target.value;
        setTheme(newTheme);
        onThemeChange(newTheme);
        
        fetch('/api/settings/theme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: newTheme })
        });
    };

    const handleColorChange = async (color) => {
        const newColor = color.hex;
        setBackgroundColor(newColor);
        const response = await fetch('/api/settings/avatar-color', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ color: newColor })
        });
        if (response.ok) {
            window.location.reload();
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatar(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!avatar) return;
        const formData = new FormData();
        formData.append('avatar', avatar);
        const response = await fetch('/api/settings/avatar', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            window.location.reload();
        }
    };

    const handleResetAvatar = async () => {
        const response = await fetch('/api/settings/reset-avatar', {
            method: 'POST'
        });

        if (response.ok) {
            setCurrentAvatar(null);
            setPreviewUrl(null);
            setBackgroundColor('#4a4a4a');
            window.location.reload();
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Profile Settings
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
                        <Box>
                            <Box sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Avatar Background Color
                                </Typography>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mb: 2,
                                        bgcolor: backgroundColor,
                                        margin: '0 auto'
                                    }}
                                />
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Wheel
                                        color={backgroundColor}
                                        onChange={(color) => handleColorChange({ hex: color.hex })}
                                        style={{ width: '200px' }}
                                        hsv="true"
                                    />
                                </Box>
                            </Box>

                            <Divider sx={{ width: '100%', my: 4 }} />

                            <Box sx={{ textAlign: 'center', width: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Custom Avatar Image
                                </Typography>
                                <Avatar
                                    src={previewUrl}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mb: 2,
                                        bgcolor: backgroundColor,
                                        margin: '0 auto'
                                    }}
                                />
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="avatar-upload"
                                    type="file"
                                    onChange={handleFileSelect}
                                />
                                <label htmlFor="avatar-upload">
                                    <Button
                                        variant="contained"
                                        component="span"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{
                                            backgroundColor: '#4a4a4a',
                                            '&:hover': {
                                                backgroundColor: '#2a2a2a'
                                            }
                                        }}
                                    >
                                        Choose Avatar
                                    </Button>
                                </label>
                                {avatar && (
                                    <Button
                                        onClick={handleUpload}
                                        sx={{
                                            mt: 2,
                                            ml: 2,
                                            backgroundColor: '#4a4a4a',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#2a2a2a'
                                            }
                                        }}
                                    >
                                        Upload Avatar
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ textAlign: 'center', width: '100%' }}>
                                <Button
                                    onClick={handleResetAvatar}
                                    sx={{
                                        mt: 3,
                                        backgroundColor: '#4a4a4a',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#2a2a2a'
                                        }
                                    }}
                                >
                                    Reset to Default
                                </Button>
                                <Divider sx={{ width: '100%', my: 4 }} />
                                <Box sx={{ textAlign: 'center', width: '100%' }}>
    <Typography variant="h6" gutterBottom>
        Theme
    </Typography>
    <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Theme</InputLabel>
        <Select
            value={theme}
            onChange={handleThemeChange}
            label="Theme"
        >
            {themes.map((theme) => (
                <MenuItem key={theme.value} value={theme.value}>
                    {theme.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
</Box>

<Divider sx={{ width: '100%', my: 4 }} />
                                <Box sx={{ textAlign: 'center', width: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Change Password
                                    </Typography>

                                    <TextField
                                        type="password"
                                        label="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />

                                    <TextField
                                        type="password"
                                        label="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />

                                    <TextField
                                        type="password"
                                        label="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        error={!!passwordError}
                                        helperText={passwordError}
                                    />

                                    <Button
                                        onClick={handleChangePassword}
                                        sx={{
                                            mt: 3,
                                            backgroundColor: '#4a4a4a',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#2a2a2a'
                                            }
                                        }}
                                    >
                                        Change Password
                                    </Button>
                                   
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Settings;