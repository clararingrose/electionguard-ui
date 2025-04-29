import React, { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Grid,
    Typography,
    Stepper,
    Step,
    StepLabel,
    TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useParams } from 'react-router-dom';
import { CiphertextTally } from '@electionguard/api-client/dist/models/tally';
import { CiphertextElectionContextDto } from '@electionguard/api-client/dist/nswag/clients';
import { useV1Client, useTallyClient, useElectionClient } from '../hooks/useClient';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 500,
        width: '100%',
    },
}));

export const ElectionTallyPage: React.FC = () => {
    const classes = useStyles();
    const { electionId } = useParams<{ electionId: string }>();
    const v1Client = useV1Client();
    const tallyClient = useTallyClient();
    const electionClient = useElectionClient(); // Use electionClient instead of v1Client
    const [ciphertextTally, setCiphertextTally] = useState<CiphertextTally | null>(null);
    const [electionContext, setElectionContext] = useState<CiphertextElectionContextDto | null>(
        null
    ); // Store election context
    const [plaintextTally, setPlaintextTally] = useState<any | null>(null);
    const [tallyError, setTallyError] = useState<string | null>(null);
    const [tallyExists, setTallyExists] = useState<boolean>(false); // Track if the tally exists
    const [activeStep, setActiveStep] = useState<number>(0); // Track the current step
    const [decryptShareResults, setDecryptShareResults] = useState<any[]>([]); // Store results of decrypt share
    const [guardianId, setGuardianId] = useState<string>(''); // Input for guardian ID

    const steps = [
        'Initiate Tally',
        'Fetch Ciphertext Tally',
        "Decrypt Guardians' Share Tally",
        'Decrypt Tally',
    ];

    useEffect(() => {
        const checkTallyExists = async () => {
            if (!electionId) return;

            try {
                const response = await v1Client.tallyGet(electionId, 'default-tally');
                if (response) {
                    setTallyExists(true);
                    setCiphertextTally({
                        ...response,
                        tally: response.tally ?? {}, // Ensure optional properties are handled
                    });
                }
            } catch (err) {
                if ((err as any)?.response?.status === 404) {
                    setTallyExists(false); // Tally does not exist
                } else {
                    setTallyError('Failed to check tally existence. Please try again.');
                }
            }
        };

        const fetchElectionContext = async () => {
            if (!electionId) return;

            try {
                const response = await electionClient.find(0, 1, {
                    filter: { election_id: electionId },
                }); // Fetch election using electionClient.find
                const election = response.elections?.[0];
                if (election?.context) {
                    setElectionContext(election.context); // Store the election context
                } else {
                    setTallyError('Election context not found. Please try again.');
                }
            } catch (err) {
                setTallyError('Failed to fetch election context. Please try again.');
            }
        };

        checkTallyExists();
        fetchElectionContext(); // Fetch the election context
    }, [electionId]);

    const initiateTally = async () => {
        if (!electionId) {
            return;
        }

        try {
            const response = await v1Client.tallyPost(electionId, 'default-tally'); // Call the API
            setCiphertextTally({
                ...response,
                tally: response.tally ?? {}, // Ensure optional properties are handled
            }); // Map the response to the expected type
            setTallyExists(true); // Update tally existence state
            setTallyError(null); // Clear any previous errors
        } catch (err) {
            setTallyError('Failed to initiate tally. Please try again.');
        }
    };

    const fetchCiphertextTally = async () => {
        if (!electionId) return;

        try {
            const response = await v1Client.tallyGet(electionId, 'default-tally'); // Call the API
            setCiphertextTally({
                ...response,
                tally: response.tally ?? {}, // Ensure optional properties are handled
            }); // Map the response to the expected type
            setTallyError(null); // Clear any previous errors
        } catch (err) {
            setTallyError('Failed to fetch ciphertext tally. Please try again.');
        }
    };

    const decryptSharePostTally = async (guardianIdParam: string) => {
        if (!electionId || !ciphertextTally || !electionContext) {
            setTallyError('Missing required data for decryptSharePostTally.');
            return;
        }

        try {
            const response = await tallyClient.decryptSharePostTally(
                guardianIdParam,
                ciphertextTally,
                electionContext // Pass the fetched election context
            );
            setDecryptShareResults((prevResults) => [
                ...prevResults,
                { guardianId: guardianIdParam, response },
            ]);
        } catch (err) {
            setTallyError(`Failed to decrypt share for guardian ${guardianIdParam}.`);
        }
    };

    const decryptTally = async () => {
        if (!electionId) return;

        try {
            const response = await tallyClient.decryptPost(false, {
                election_id: electionId,
                tally_name: 'default-tally',
            }); // Call the API to decrypt the tally
            setPlaintextTally(response); // Set the response as the plaintext tally
            setTallyError(null); // Clear any previous errors
            setActiveStep(4); // Move to the completion step
        } catch (err) {
            setTallyError('Failed to decrypt tally. Please try again.');
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                if (tallyExists) {
                    return (
                        <>
                            <Typography variant="body1" color="textSecondary">
                                Tally already initiated.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setActiveStep(1)} // Move to the next step
                            >
                                Go to Fetch Ciphertext Tally
                            </Button>
                        </>
                    );
                }
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={initiateTally}
                        disabled={!electionId}
                    >
                        Initiate Tally
                    </Button>
                );
            case 1:
                return (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={fetchCiphertextTally}
                            disabled={!electionId || !tallyExists}
                        >
                            Fetch Ciphertext Tally
                        </Button>
                        {ciphertextTally && (
                            <>
                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">Ciphertext Tally</Typography>
                                        <div
                                            style={{
                                                maxHeight: '300px',
                                                overflowY: 'auto',
                                                backgroundColor: '#f5f5f5',
                                                padding: '10px',
                                                borderRadius: '5px',
                                                border: '1px solid #ddd',
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                component="pre"
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordWrap: 'break-word',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {JSON.stringify(ciphertextTally, null, 2)}
                                            </Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '20px' }}
                                    onClick={() => setActiveStep(2)} // Move to the next step
                                >
                                    Next
                                </Button>
                            </>
                        )}
                    </>
                );
            case 2:
                return (
                    <>
                        <Typography variant="body1">Decrypting shares for guardians...</Typography>
                        <Grid container spacing={2} style={{ marginTop: '20px' }}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Guardian ID"
                                    variant="outlined"
                                    value={guardianId}
                                    onChange={(e) => setGuardianId(e.target.value)}
                                    fullWidth
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '10px' }}
                                    onClick={() => {
                                        if (guardianId.trim()) {
                                            decryptSharePostTally(guardianId.trim());
                                            setGuardianId(''); // Clear the input after submission
                                        }
                                    }}
                                >
                                    Decrypt Share
                                </Button>
                            </Grid>
                            {decryptShareResults.map((result, index) => (
                                <Grid item xs={12} key={result.guardianId}>
                                    <Typography variant="body1">
                                        <strong>Guardian {result.guardianId}:</strong>
                                    </Typography>
                                    <Typography variant="body2">
                                        <pre>{JSON.stringify(result.response, null, 2)}</pre>
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '20px' }}
                            onClick={() => setActiveStep(3)} // Move to the next step
                        >
                            Next
                        </Button>
                    </>
                );
            case 3:
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={decryptTally}
                        disabled={!electionId || !tallyExists || !ciphertextTally}
                    >
                        Decrypt Tally
                    </Button>
                );
            default:
                return (
                    <Typography variant="h6">
                        All steps completed. Tally process is finished.
                    </Typography>
                );
        }
    };

    return (
        <Container maxWidth="md" className={classes.root}>
            <Typography variant="h4" gutterBottom>
                Election Tally Wizard
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    {renderStepContent(activeStep)}
                </Grid>
                <Grid item xs={12}>
                    {activeStep > 0 && (
                        <Button variant="outlined" onClick={handleBack}>
                            Back
                        </Button>
                    )}
                </Grid>
                {tallyError && (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="error">
                            {tallyError}
                        </Typography>
                    </Grid>
                )}
                {plaintextTally && activeStep === steps.length && (
                    <Grid item xs={12}>
                        <Typography variant="h6">Plaintext Tally Results</Typography>
                        <div
                            style={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                backgroundColor: '#f5f5f5',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                            }}
                        >
                            <Typography
                                variant="body1"
                                component="pre"
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {JSON.stringify(plaintextTally, null, 2)}
                            </Typography>
                        </div>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ElectionTallyPage;
