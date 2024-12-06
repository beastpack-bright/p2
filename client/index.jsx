import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import HowlForm from './components/HowlForm';
import Feed from './components/Feed';
import Layout from './components/Layout';
import NotFound from './components/NotFound'
import Settings from './components/Settings';
import Profile from './components/Profile';
import { lightTheme, darkTheme, blueTheme, highContrastTheme, beeTheme, pinkTheme } from '../views/layouts/index';


const themes = {
    light: lightTheme,
    dark: darkTheme,
    blue: blueTheme,
    highContrast: highContrastTheme,
    bee: beeTheme,
    pink: pinkTheme
};


const App = () => {
    const path = window.location.pathname;
    const isAuthPage = path === '/' || path === '/signup' || path === "/404";

    const [currentTheme, setCurrentTheme] = useState(() => {
        return isAuthPage ? 'light' : (localStorage.getItem('userTheme') || 'light');
    });

    useEffect(() => {
        if (!isAuthPage) {
            const fetchUserTheme = async () => {
                const response = await fetch('/api/user');
                const data = await response.json();
                if (data.theme) {
                    setCurrentTheme(data.theme);
                    localStorage.setItem('userTheme', data.theme);
                }
            };
            fetchUserTheme();
        }
    }, [isAuthPage]);


    const handleThemeChange = (newTheme) => {
        setCurrentTheme(newTheme);
        localStorage.setItem('userTheme', newTheme);
    };


    const getComponent = () => {
        switch (path) {
            case '/signup':
                return <SignupForm />;
            case '/howls':
                return <HowlForm />;
            case '/feed':
                return <Feed />;
            case '/settings':
            case '/settings':
                return <Settings currentTheme={currentTheme} onThemeChange={setCurrentTheme} />;
            case '/404':
                return <NotFound />;
            default:
                if (path.startsWith('/profile/')) {
                    return <Profile />;
                }
                return <LoginForm />;
        }
    };


    const componentToRender = getComponent();


    return (
        <ThemeProvider theme={themes[isAuthPage ? 'light' : currentTheme]}>
            <CssBaseline />
            {isAuthPage ? componentToRender : (
                <Layout>
                    {React.cloneElement(componentToRender, {
                        currentTheme: currentTheme,
                        onThemeChange: handleThemeChange
                    })}
                </Layout>
            )}
        </ThemeProvider>
    );
};


document.addEventListener('DOMContentLoaded', () => {
    const root = createRoot(document.getElementById('root'));
    root.render(<App />);
});