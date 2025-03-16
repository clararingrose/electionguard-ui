import React, { useState } from 'react';
import { Button, Container, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ElectionQueryRequest } from '@electionguard/api-client/dist/nswag/clients';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { DataGrid, GridColumns, GridValueGetterParams } from '@mui/x-data-grid';
import { useElectionClient } from '../hooks/useClient';
import AsyncContent from '../components/AsyncContent';

// import { MessageId } from '../lang';
// import InternationalText from '../components/InternationalText';
// import WelcomeHeader from '../components/WelcomeHeader';

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
    const navigate = useNavigate();
    const electionClient = useElectionClient();
    const electionId = process.env.ELECTION_ID;

    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                <h1>Home: ElectionID: {electionId}</h1>
                <Button onClick={() => navigate('/vote')}>Vote</Button>
            </Container>
        </Grid>
    );
};

export default HomePage;
