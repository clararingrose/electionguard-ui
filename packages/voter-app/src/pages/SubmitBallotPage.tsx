import React, { useState } from 'react';
import { Container, Grid, Button, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import { CastBallotsRequest, SpoilBallotsRequest } from '@electionguard/api-client';
import { useBallotClient } from '../hooks/useClient';
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

export const SubmitBallotPage: React.FC = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const electionId = process.env.ELECTION_ID;

    const [errorMessageId, setErrorMessageId] = useState<string>();

    const ballotClient = useBallotClient();

    const handleCastBallot = async () => {
        try {
            const castRequest: CastBallotsRequest = {
                election_id: electionId!,
                ballots: [],
                manifest: {},
                context: {},
            };
            await ballotClient.cast(electionId, castRequest);
            navigate(routeIds.home); // navigate to home page after casting
            // should instead navigate to confirmation page
        } catch (ex) {
            setErrorMessageId(MessageId.TaskStatus_Error);
        }
    };

    const handleSpoilBallot = async () => {
        try {
            const spoilRequest: SpoilBallotsRequest = {
                election_id: electionId!,
                ballots: [],
                manifest: {},
                context: {},
            };
            await ballotClient.spoil(electionId, spoilRequest);
            navigate(routeIds.home); // navigate to home page after spoiling
            // should instead navigate to a page that shows the spoiled ballot
        } catch (ex) {
            setErrorMessageId(MessageId.TaskStatus_Error);
        }
    };

    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                <Typography variant="h4">Submit Your Ballot</Typography>
                {errorMessageId && (
                    <Grid item xs={12}>
                        <ErrorMessage MessageId={errorMessageId} />
                    </Grid>
                )}
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCastBallot}
                            fullWidth
                        >
                            Cast Ballot
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSpoilBallot}
                            fullWidth
                        >
                            Spoil Ballot
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
};

export default SubmitBallotPage;
