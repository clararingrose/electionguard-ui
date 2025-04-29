import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { AuthenticatedLayout } from './layouts';
import { LoginPage } from './pages';
import useToken from './hooks/useToken';
import { ElectionProvider } from './contexts/ElectionContext';

import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import UnauthenticatedLayout from './layouts/UnauthenticatedLayout';
import theme from './theme';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const App: React.FunctionComponent = () => {
    const { setToken, token } = useToken();
    const [username, setUsername] = useState<string | null>(null); // Add username state

    const getContent = () => {
        const unauthenticated = !token;
        if (unauthenticated) {
            return (
                <UnauthenticatedLayout>
                    <LoginPage setToken={setToken} setUsername={setUsername} />
                </UnauthenticatedLayout>
            );
        }

        return (
            <ElectionProvider>
                <Router>
                    <AuthenticatedLayout>
                        <AuthenticatedRoutes username={username} />
                    </AuthenticatedLayout>
                </Router>
            </ElectionProvider>
        );
    };

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme()}>{getContent()}</ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
