/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react';
import { Container, Grid, Stepper, Step, StepLabel, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
    ElectionQueryRequest,
    EncryptBallotsRequest,
} from '@electionguard/api-client/dist/nswag/clients';
import { CastBallotsRequest, SpoilBallotsRequest } from '@electionguard/api-client';
import { sha256 } from 'js-sha256';
import { MessageId } from '../../lang';
import { useBallotClient, useElectionClient } from '../../hooks/useClient';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import routeIds from '../../routes/RouteIds';
import VoteStep from './Steps/VoteStep';
import SubmitBallotStep from './Steps/SubmitBallotStep';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    content: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

export const VoteWizard: React.FC = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const electionId = process.env.REACT_APP_ELECTION_ID;

    const [activeStep, setActiveStep] = useState(0);
    const [errorMessageId, setErrorMessageId] = useState<string>();
    const [encryptedBallotResponse, setEncryptedBallotResponse] = useState<unknown>();

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

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

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
                election_id: electionId!,
                seed_hash: sha256(plaintextBallot.toString()),
                ballots: [plaintextBallot],
            };
            const response = await ballotClient.encrypt(encryptRequest);
            setEncryptedBallotResponse(response);
            handleNext();
        } catch (ex) {
            setErrorMessageId(MessageId.TaskStatus_Error);
        }
    };

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

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error loading election details</Typography>;
    }

    const steps = ['Vote', 'Submit Ballot'];

    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {errorMessageId && (
                    <Grid item xs={12}>
                        <ErrorMessage MessageId={errorMessageId} />
                    </Grid>
                )}
                <VoteStep
                    active={activeStep === 0}
                    election={election}
                    handleSubmit={handleSubmit}
                />
                <SubmitBallotStep
                    active={activeStep === 1}
                    handleCastBallot={handleCastBallot}
                    handleSpoilBallot={handleSpoilBallot}
                    handleBack={handleBack}
                />
            </Container>
        </Grid>
    );
};

export default VoteWizard;
