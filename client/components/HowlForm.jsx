import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';

const HowlForm = () => {
    const [howlContent, setHowlContent] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const maxChars = 150;

    const handleContentChange = (e) => {
        const content = e.target.value;
        if (content.length <= maxChars) {
            setHowlContent(content);
            setCharCount(content.length);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        const response = await fetch('/api/howls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: howlContent }),
        });
    
        if (response.ok) {
            setHowlContent('');
            setCharCount(0);
        }
        
        setIsSubmitting(false);
    };
    
    

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        🐺 Release Your Howl
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            placeholder="What's on your mind, wolf?"
                            value={howlContent}
                            onChange={handleContentChange}
                            sx={{ 
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#4a4a4a',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2a2a2a',
                                    }
                                }
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                {charCount}/{maxChars} characters
                            </Typography>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting || charCount === 0}
                                sx={{
                                    backgroundColor: '#4a4a4a',
                                    '&:hover': {
                                        backgroundColor: '#2a2a2a',
                                    },
                                    '&.Mui-disabled': {
                                        backgroundColor: '#cccccc'
                                    }
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Howl!'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default HowlForm;