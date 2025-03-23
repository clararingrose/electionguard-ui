import React from 'react';
import { Button, Container, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';

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
    const electionId = process.env.REACT_APP_ELECTION_ID;

    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                <h1>Home: ElectionID: {electionId}</h1>
                <Button onClick={() => navigate('/vote-wizard')}>Vote</Button>
            </Container>
        </Grid>
    );
};

export default HomePage;
