import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import AppBar from '../components/AppBar';
import Footer from '../components/Footer';

const useStyles = makeStyles(() => ({
    root: {
        minHeight: '100vh',
    },
}));

export interface DefaultLayoutProps {
    // eslint-disable-next-line react/no-unused-prop-types, react/require-default-props
    isLoading?: boolean;
}

export const UnauthenticatedLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    const classes = useStyles();
    return (
        <Box className={classes.root} height="100vh" display="flex" flexDirection="column">
            <AppBar title="Admin App" />
            <Box display="flex" flexDirection="column" flexGrow={1}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default UnauthenticatedLayout;
