/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
    ElectionQueryRequest,
    ElectionSummaryDto,
} from '@electionguard/api-client/dist/nswag/clients';
import { MessageId } from '../lang';
import { useBallotClient, useElectionClient } from '../hooks/useClient';
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
    const electionId = process.env.ELECTION_ID;
    // const { electionId } = useParams<{ electionId: string }>();

    const [errorMessageId, setErrorMessageId] = useState<string>();

    const ballotClient = useBallotClient();
    const electionClient = useElectionClient();

    const findParams: ElectionQueryRequest = {
        filter: {
            election_id: electionId,
        },
    };

    const findElection = () =>
        electionClient.find(0, 100, findParams).then((response) => response.elections);
    const { data: elections, isLoading, error } = useQuery('elections', findElection);

    const election = elections?.find((e) => e.election_id === electionId);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            await ballotClient.encrypt;
            navigate(routeIds.home); // navigate to cast/spoil page
        } catch (ex) {
            setErrorMessageId(MessageId.TaskStatus_Error); // could replace with something more specific
        }
    };

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error loading election details</Typography>;
    }

    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                <h1>Election Title: {election?.manifest.name.text[0].value}</h1>
                {errorMessageId && (
                    <Grid item xs={12}>
                        <ErrorMessage MessageId={errorMessageId} />
                    </Grid>
                )}
                <form onSubmit={handleSubmit}>
                    {election?.manifest.candidates.map((candidate) => (
                        <div key={candidate.object_id}>
                            <label htmlFor={candidate.object_id}>
                                {candidate.name.text[0].value}
                            </label>
                            <input
                                type="radio"
                                name="election"
                                id={candidate.object_id}
                                value={candidate.object_id}
                            />{' '}
                            <br />
                        </div>
                    ))}
                    <input type="submit" value="Encrypt ballot" />
                </form>
            </Container>
        </Grid>
    );
};

export default VotePage;
