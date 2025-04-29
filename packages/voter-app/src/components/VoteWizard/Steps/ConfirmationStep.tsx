import React, { useState } from 'react';
import { Button, Grid, Typography, Box } from '@mui/material';
import WizardStep, { WizardStepProps } from '../../WizardStep/WizardStep';

export interface ConfirmationStepProps extends WizardStepProps {
    handleFinish: () => void; // Function to navigate to the home page
    handleRestart: () => void; // Function to restart the vote wizard
    trackingCode: string; // Confirmation code for cast ballots
    isSpoiled: boolean; // Indicates whether the ballot was spoiled
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    active,
    handleFinish,
    handleRestart,
    trackingCode,
    isSpoiled,
}) => {
    const [copyMessage, setCopyMessage] = useState<string | null>(null);

    const handleCopyToClipboard = () => {
        navigator.clipboard
            .writeText(trackingCode)
            .then(() => {
                setCopyMessage('Tracking code copied to clipboard!');
            })
            .catch(() => {
                setCopyMessage('Failed to copy tracking code. Please try again.');
            });

        // Clear the message after 3 seconds
        setTimeout(() => setCopyMessage(null), 3000);
    };

    return (
        <WizardStep active={active}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4">
                        {isSpoiled ? 'Ballot Spoiled Successfully' : 'Ballot Cast Successfully'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">Your tracking code is:</Typography>
                    <Box
                        sx={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                            backgroundColor: '#f5f5f5',
                            padding: '8px',
                            borderRadius: '4px',
                            textAlign: 'center',
                            fontFamily: 'monospace',
                        }}
                    >
                        <strong>{trackingCode}</strong>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleCopyToClipboard}
                        fullWidth
                    >
                        Copy Tracking Code
                    </Button>
                </Grid>
                {copyMessage && (
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            color={copyMessage.includes('Failed') ? 'error' : 'primary'}
                            textAlign="center"
                        >
                            {copyMessage}
                        </Typography>
                    </Grid>
                )}
                {isSpoiled && (
                    <>
                        <Grid item xs={12}>
                            <Typography variant="body1">
                                Your spoiled ballot will be publicly posted after the election. It
                                will not be included in the official tally. You can restart the
                                voting process if you wish to cast a ballot to be included in the
                                official tally.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRestart}
                                fullWidth
                            >
                                Restart Voting
                            </Button>
                        </Grid>
                    </>
                )}
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleFinish} fullWidth>
                        Finish
                    </Button>
                </Grid>
            </Grid>
        </WizardStep>
    );
};

export default ConfirmationStep;
