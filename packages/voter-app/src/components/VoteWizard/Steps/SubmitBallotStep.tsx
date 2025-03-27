import React from 'react';
import { Button, Grid } from '@mui/material';
import { WizardStep, WizardStepProps } from '../../WizardStep/WizardStep';

export interface SubmitBallotStepProps extends WizardStepProps {
    handleCastBallot: () => void;
    handleSpoilBallot: () => void;
    handleBack: () => void;
    encryptedBallot: any;
}

const SubmitBallotStep: React.FC<SubmitBallotStepProps> = ({
    active,
    handleCastBallot,
    handleSpoilBallot,
    handleBack,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    encryptedBallot,
}) => (
    <WizardStep active={active}>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Button variant="contained" color="primary" onClick={handleCastBallot} fullWidth>
                    Cast Ballot
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button variant="contained" color="secondary" onClick={handleSpoilBallot} fullWidth>
                    Spoil Ballot
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button onClick={handleBack}>Back</Button>
            </Grid>
        </Grid>
    </WizardStep>
);

export default SubmitBallotStep;
