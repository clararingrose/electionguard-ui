import React, { useState } from 'react';
import { Button, Grid, Stepper, Step, StepLabel, Typography, Container } from '@mui/material';
import { InitiateTallyStep } from './Steps/InitiateTallyStep';
import { FetchCiphertextTallyStep } from './Steps/FetchCiphertextTallyStep';
import { DecryptTallyStep } from './Steps/DecryptTallyStep';
import { DecryptSharePostTallyStep } from './Steps/DecryptSharePostTallyStep';

interface ElectionTallyWizardProps {
    electionId: string;
}

const steps = [
    'Initiate Tally',
    'Fetch Ciphertext Tally',
    "Decrypt Guardians' Share Tally",
    'Decrypt Tally',
];

const ElectionTallyWizard: React.FC<ElectionTallyWizardProps> = ({ electionId }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [tallyError, setTallyError] = useState<string | null>(null);
    const [ciphertextTally, setCiphertextTally] = useState<any | null>(null);
    const [plaintextTally, setPlaintextTally] = useState<any | null>(null);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <InitiateTallyStep
                        electionId={electionId}
                        onSuccess={handleNext}
                        onError={setTallyError}
                    />
                );
            case 1:
                return (
                    <FetchCiphertextTallyStep
                        electionId={electionId}
                        onSuccess={(tally) => {
                            setCiphertextTally(tally);
                            handleNext();
                        }}
                        onError={setTallyError}
                    />
                );
            case 2:
                return (
                    <DecryptSharePostTallyStep
                        electionId={electionId}
                        ciphertextTally={ciphertextTally}
                        context={ciphertextTally?.context}
                        guardians={['guardian1', 'guardian2', 'guardian3']} // Replace with actual guardian IDs
                        onSuccess={handleNext}
                        onError={setTallyError}
                    />
                );
            case 3:
                return (
                    <DecryptTallyStep
                        electionId={electionId}
                        ciphertextTally={ciphertextTally}
                        onSuccess={(tally) => {
                            setPlaintextTally(tally);
                            handleNext();
                        }}
                        onError={setTallyError}
                    />
                );
            default:
                return (
                    <Typography variant="h6">
                        All steps completed. The tally process is finished.
                    </Typography>
                );
        }
    };

    return (
        <Container maxWidth="md">
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
            <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
                <Grid item xs={12}>
                    {renderStepContent(activeStep)}
                </Grid>
                {activeStep > 0 && activeStep < steps.length && (
                    <Grid item xs={12}>
                        <Button variant="outlined" onClick={handleBack}>
                            Back
                        </Button>
                    </Grid>
                )}
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
                        <Typography variant="body1">
                            <pre>{JSON.stringify(plaintextTally, null, 2)}</pre>
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ElectionTallyWizard;
