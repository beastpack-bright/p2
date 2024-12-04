import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import './NotFound.css';

const NotFound = () => {
    const wolfImages = [
            'images/wolf1.png',
            'images/wolf2.png',
            'images/wolf3.png',
            'images/wolf4.png'
        ];
    
    const wolves = Array(10).fill(null).map((_, i) => ({
        id: i,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
        top: Math.random() * 80 + 10 + '%',
        image: wolfImages[Math.floor(Math.random() * wolfImages.length)]
    }));

    return (
        <Container maxWidth="sm" sx={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
            {wolves.map(wolf => (
            <img 
            key={wolf.id}
            src={wolf.image}
            alt="Running Wolf"
            className="running-wolf"
            style={{
                top: wolf.top,
                animationDelay: `${wolf.delay}s`,
                animationDuration: `${wolf.duration}s`
            }}
                />
            ))}
            <Box sx={{ 
                mt: 8, 
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: 4,
                borderRadius: 2
            }}>
                <Typography variant="h1" sx={{ mb: 4 }}>
                    🐺
                </Typography>
                <Typography variant="h4" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 4 }}>
                    Page Not Found. Do you need to log in? 
                </Typography>
                <Button 
                    variant="contained"
                    onClick={() => window.location.href = '/'}
                    sx={{ 
                        backgroundColor: '#4a4a4a',
                        '&:hover': {
                            backgroundColor: '#2a2a2a',
                        },
                        mb: 2
                    }}
                >
                    Login
                </Button>
                <Button 
                    variant="outlined"
                    onClick={() => window.location.href = '/signup'}
                    sx={{ 
                        color: '#4a4a4a',
                        borderColor: '#4a4a4a',
                        '&:hover': {
                            borderColor: '#2a2a2a',
                            backgroundColor: 'rgba(74, 74, 74, 0.04)'
                        }
                    }}
                >
                    Sign Up
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;