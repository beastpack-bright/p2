import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, Box, Avatar, Grid, Card, CardContent, Tooltip, Button, TextField
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PetsIcon from '@mui/icons-material/Pets';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [blurb, setBlurb] = useState('');
    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const username = window.location.pathname.split('/profile/')[1];
        const fetchProfile = async () => {
            try {
                const profileResponse = await fetch(`/api/profile/${username}`);
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setProfile(profileData);
                    setBlurb(profileData.blurb || '');
                }

                const currentUserResponse = await fetch('/api/user');
                if (currentUserResponse.ok) {
                    const userData = await currentUserResponse.json();
                    if (userData.isLoggedIn) {
                        setCurrentUser(userData.user);
                        setIsCurrentUserProfile(userData.user.username === username);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);
    const fetchUser = async () => {
        const response = await fetch('/api/user');
        const data = await response.json();
        if (data.isLoggedIn) {
            setCurrentUser(data.user);
        }
    };
    const handleFollow = async (userId) => {
        const response = await fetch(`/api/users/${userId}/follow`, {
            method: 'POST'
        });
        if (response.ok) {
            fetchUser();
        }
    };

    const handleUnfollow = async (userId) => {
        const response = await fetch(`/api/users/${userId}/unfollow`, {
            method: 'POST'
        });
        if (response.ok) {
            fetchUser();
        }
    };


    const handleSaveBlurb = async () => {
        try {
            const response = await fetch('/api/profile/blurb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blurb })
            });

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error saving blurb:', error);
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: profile.avatarColor || '#4a4a4a',
                            mr: 2
                        }}
                        src={profile.avatar}
                    >
                        {profile.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h4">{profile.username}</Typography>
                        <Typography variant="body1" color="textSecondary">
                            Howls: {profile.howlCount}
                        </Typography>
                        {!isCurrentUserProfile && currentUser && (
    <Button
        variant="contained"
        startIcon={currentUser.following?.includes(profile._id) ? <PersonRemoveIcon /> : <PersonAddIcon />}
        onClick={() =>
            currentUser.following?.includes(profile._id)
                ? handleUnfollow(profile._id)
                : handleFollow(profile._id)
        }
        sx={{
            mt: 1,
            backgroundColor: currentUser.following?.includes(profile._id) ? '#ff4444' : '#4a4a4a',
            '&:hover': {
                backgroundColor: currentUser.following?.includes(profile._id) ? '#cc0000' : '#2a2a2a'
            }
        }}
    >
        {currentUser.following?.includes(profile._id) ? 'Unfollow' : 'Follow'}
    </Button>
)}
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            { }
                            {profile.howlCount >= 5 && (
                                <Tooltip title="Vocal Wolf: Posted 5+ Howls">
                                    <ChatBubbleIcon sx={{ color: '#FFD700' }} />
                                </Tooltip>
                            )}
                            {profile.packStats.repliesReceived >= 10 && (
                                <Tooltip title="Pack Leader: Received 10+ Replies">
                                    <StarIcon sx={{ color: '#C0C0C0' }} />
                                </Tooltip>
                            )}
                            {profile.packStats.repliesMade >= 7 && (
                                <Tooltip title="Social Wolf: Made 7+ Replies">
                                    <GroupIcon sx={{ color: '#CD7F32' }} />
                                </Tooltip>
                            )}
                            {profile.howlCount >= 25 && (
                                <Tooltip title="Alpha Wolf: Posted 25+ Howls">
                                    <PetsIcon sx={{ color: '#FFD700' }} />
                                </Tooltip>
                            )}
                            {profile.packStats.repliesReceived >= 50 && (
                                <Tooltip title="Pack Champion: Received 50+ Replies">
                                    <EmojiEventsIcon sx={{ color: '#C0C0C0' }} />
                                </Tooltip>
                            )}
                            {profile.packStats.repliesMade >= 30 && (
                                <Tooltip title="Pack Guardian: Made 30+ Replies">
                                    <MilitaryTechIcon sx={{ color: '#CD7F32' }} />
                                </Tooltip>
                            )}
                            {(profile.packStats.repliesMade + profile.packStats.repliesReceived + profile.howlCount) >= 100 && (
                                <Tooltip title="Legendary Wolf: 100+ Total Interactions">
                                    <WhatshotIcon sx={{ color: '#FF4500' }} />
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                </Box>

                {isEditing ? (
                    <Box sx={{ mt: 2, width: '100%' }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={blurb}
                            onChange={(e) => setBlurb(e.target.value)}
                        />
                        <Button
                            onClick={handleSaveBlurb}
                            sx={{ mt: 2 }}
                        >
                            Save
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="body1">
                            {profile.blurb || "No bio yet"}
                        </Typography>
                        {isCurrentUserProfile && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                sx={{ mt: 2 }}
                            >
                                Edit Blurb
                            </Button>
                        )}
                    </Box>
                )}

                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Pack Stats</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Howls
                                </Typography>
                                <Typography variant="h4">
                                    {profile.howlCount}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Replies Received
                                </Typography>
                                <Typography variant="h4">
                                    {profile.packStats.repliesReceived}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Replies Made
                                </Typography>
                                <Typography variant="h4">
                                    {profile.packStats.repliesMade}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Following
                                </Typography>
                                <Typography variant="h4">
                                    {profile.following?.length || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Typography
                    variant="subtitle1"
                    sx={{
                        mt: 2,
                        color: 'text.secondary',
                        fontStyle: 'italic'
                    }}
                >
                    Joined the Pack: {new Date(profile.joinDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </Typography>

                {profile.featuredHowl && (
                    <Box sx={{ mt: 4, mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StarIcon sx={{ color: '#FFD700' }} />
                            Featured Howl
                        </Typography>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                mt: 1,
                                backgroundColor: '#f8f8f8',
                                border: '2px solid #FFD700'
                            }}
                        >
                            <Typography variant="body1">
                                {profile.featuredHowl.content}
                            </Typography>
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                                {new Date(profile.featuredHowl.createdAt).toLocaleString()}
                            </Typography>
                        </Paper>
                    </Box>
                )}

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Recent Howls</Typography>
                    <Box
                        sx={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '8px'
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '10px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '10px',
                                '&:hover': {
                                    background: '#555'
                                }
                            }
                        }}
                    >
                        {profile.recentHowls.map(howl => (
                            <Paper
                                key={howl._id}
                                elevation={1}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: '#f5f5f5'
                                }}
                            >
                                <Typography variant="body1">
                                    {howl.content}
                                </Typography>
                                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                                    {new Date(howl.createdAt).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;
