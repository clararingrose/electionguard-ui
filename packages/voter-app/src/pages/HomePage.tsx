import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
// import { useNavigate } from 'react-router-dom';
import { MessageId } from '../lang';
import InternationalText from '../components/InternationalText';
import WelcomeHeader from '../components/WelcomeHeader';

// import routeIds from '../routes/RouteIds';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    content: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

export const HomePage: React.FC = () => {
    const classes = useStyles();
    // const navigate = useNavigate();
    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                <WelcomeHeader />
                <InternationalText id={MessageId.AppAbout} />
            </Container>
        </Grid>
    );
};

export default HomePage;
