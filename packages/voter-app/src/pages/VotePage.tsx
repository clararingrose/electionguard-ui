import React from 'react';
import { Container, Grid } from '@mui/material';
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

export const VotePage: React.FC = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                {/* stuff here */}
            </Container>
        </Grid>
    );
};
