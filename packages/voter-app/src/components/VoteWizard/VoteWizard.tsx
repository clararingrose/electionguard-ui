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
import ConfirmationStep from './Steps/ConfirmationStep';

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
    const [encryptedBallot, setEncryptedBallot] = useState<any>();

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
    const electionManifest = election?.manifest;
    const electionContext = election?.context;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinish = () => {
        navigate(routeIds.home);
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target as HTMLFormElement);

            const contests = electionManifest.contests.map((contest: any) => {
                const selectedCandidateId = formData.get(contest.object_id) as string;
                return {
                    object_id: contest.object_id,
                    ballot_selections: [
                        {
                            object_id: selectedCandidateId,
                            vote: 1,
                        },
                    ],
                };
            });

            const plaintextBallot = {
                object_id: 'placeholder',
                style_id: electionManifest.ballot_styles[0].object_id,
                contests,
            };

            const encryptRequest: EncryptBallotsRequest = {
                election_id: electionId!,
                seed_hash: sha256(plaintextBallot.toString()),
                ballots: [plaintextBallot],
            };
            const response = await ballotClient.encrypt(encryptRequest);
            setEncryptedBallot(response.ballots[0]);
            handleNext();
        } catch (ex) {
            setErrorMessageId(MessageId.TaskStatus_Error);
        }
    };

    const handleCastBallot = async () => {
        try {
            const castRequest: CastBallotsRequest = {
                election_id: electionId!,
                ballots: [encryptedBallot],
                manifest: electionManifest,
                context: electionContext,
            };
            await ballotClient.cast(electionId, castRequest);
            handleNext(); // Navigate to the confirmation step
        } catch (ex) {
            setErrorMessageId(MessageId.TaskStatus_Error);
        }
    };

    const handleSpoilBallot = async () => {
        try {
            const spoilRequest: SpoilBallotsRequest = {
                election_id: electionId!,
                ballots: [encryptedBallot],
                manifest: electionManifest,
                context: electionContext,
            };
            await ballotClient.spoil(electionId, spoilRequest);
            navigate(routeIds.home); // navigate to home page after spoiling
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

    const steps = ['Vote', 'Submit Ballot', 'Confirmation'];

    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                <Typography variant="h4">{election?.manifest.name.text[0].value}</Typography>
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
                    encryptedBallot={encryptedBallot}
                />
                <ConfirmationStep active={activeStep === 2} handleFinish={handleFinish} />
            </Container>
        </Grid>
    );
};

export default VoteWizard;
