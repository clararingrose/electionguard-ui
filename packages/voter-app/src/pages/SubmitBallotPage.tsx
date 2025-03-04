import React from 'react';
import { useState } from 'react';
import { Container, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import { useBallotClient } from '../hooks/useClient';
import { Message, MessageId } from '../lang';
import routeIds from '../routes/RouteIds';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    content: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

export const CastOrSpoilPage: React.FC = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const [errorMessageId, setErrorMessageId] = useState<string>();

    const ballotClient = useBallotClient();
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            await ballotClient.encrypt;
            navigate(routeIds.home); // navigate to cast/spoil page
        } catch (ex) {
            setErrorMessageId(MessageId.TaskStatus_Error); // could replace with something more specific
        }
    };

    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                <h1>ElectionTitle</h1>
            </Container>
        </Grid>
    );
};

export default CastOrSpoilPage;
