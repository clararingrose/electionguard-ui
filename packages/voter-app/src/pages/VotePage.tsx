import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import { useBallotClient, useElectionClient } from '../hooks/useClient';
import { MessageId } from '../lang';
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

export const VotePage: React.FC = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const [errorMessageId, setErrorMessageId] = useState<string>();

    const ballotClient = useBallotClient();
    const electionClient = useElectionClient();

    const name = electionClient.constants();

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
                {errorMessageId && (
                    <Grid item xs={12}>
                        <ErrorMessage MessageId={errorMessageId} />
                    </Grid>
                )}
                {/* for each item on ballot, create input element dynamically */}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="one">Choice one</label>
                    <input type="radio" name="election" id="one" value="Choice one" /> <br />
                    <label htmlFor="two">Choice two</label>
                    <input type="radio" name="election" id="two" value="Choice two" />
                    <input type="submit" value="Encrypt ballot" />
                </form>
            </Container>
        </Grid>
    );
};

export default VotePage;
