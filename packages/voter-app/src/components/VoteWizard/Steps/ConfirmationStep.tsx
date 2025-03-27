import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import WizardStep, { WizardStepProps } from '../../WizardStep/WizardStep';

export interface ConfirmationStepProps extends WizardStepProps {
    handleFinish: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ active, handleFinish }) => (
    <WizardStep active={active}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Ballot Submitted Successfully</Typography>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleFinish} fullWidth>
                    Finish
                </Button>
            </Grid>
        </Grid>
    </WizardStep>
);

export default ConfirmationStep;
