/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
    ElectionQueryRequest,
    EncryptBallotsRequest,
} from '@electionguard/api-client/dist/nswag/clients';
import { sha256 } from 'js-sha256';
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
    const electionId = process.env.REACT_APP_ELECTION_ID;

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
            const formData = new FormData(e.target as HTMLFormElement);
            const selectedCandidateId = formData.get('election') as string;

            const plaintextBallot = {
                object_id: 'placeholder',
                style_id: election?.manifest.ballot_styles[0].object_id,
                contests: [
                    {
                        object_id: election?.manifest.contests[0].object_id,
                        ballot_selections: [
                            {
                                object_id: selectedCandidateId,
                                vote: 1,
                            },
                        ],
                    },
                ],
            };

            const encryptRequest: EncryptBallotsRequest = {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                election_id: electionId!,
                seed_hash: sha256(plaintextBallot.toString()),
                ballots: [plaintextBallot],
            };
            const encryptedBallotResponse = await ballotClient.encrypt(encryptRequest);
            navigate(routeIds.submit, { state: { encryptedBallotResponse } });
        } catch (ex) {
            setErrorMessageId(MessageId.TaskStatus_Error);
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
                <h2>Ballot Title: {election?.manifest.contests[0].ballot_title.text[0].value}</h2>
                <h3>
                    Ballot Subtitle: {election?.manifest.contests[0].ballot_subtitle.text[0].value}
                </h3>
                {errorMessageId && (
                    <Grid item xs={12}>
                        <ErrorMessage MessageId={errorMessageId} />
                    </Grid>
                )}
                <form onSubmit={handleSubmit}>
                    {election?.manifest.candidates.map((candidate: any) => (
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
