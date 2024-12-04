import { createTheme } from '@mui/material';

export const lightTheme = createTheme({
    // Our current theme
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        background: {
            default: '#1a1a1a',
            paper: '#2d2d2d'
        },
        text: {
            primary: '#000000',
            secondary: '#000000'
        }
    }
});

export const blueTheme = createTheme({
    palette: {
        primary: {
            main: '#1976d2'
        },
        background: {
            default: '#e3f2fd',
            paper: '#bbdefb'
        }
    }
});

export const highContrastTheme = createTheme({
    palette: {
        primary: { main: '#000000' },
        secondary: { main: '#ffffff' },
        background: {
            default: '#ffffff',
            paper: '#ffffff'
        },
        text: {
            primary: '#000000',
            secondary: '#000000'
        },
        divider: '#000000',
        action: {
            active: '#000000',
            hover: '#333333'
        }
    },
    typography: {
        allVariants: {
            fontWeight: 700
        }
    }
});
export const beeTheme = createTheme({
    palette: {
        primary: { main: '#ffd700' },
        background: {
            default: '#000000',
            paper: '#242424'
        },
        text: {
            primary: '#000000',
            secondary: '#000000'
        }
    }
});
export const pinkTheme = createTheme({
    palette: {
        primary: {
            main: '#ff69b4'
        },
        background: {
            default: '#fff0f7',
            paper: '#ffd6e8'
        }
    }
});