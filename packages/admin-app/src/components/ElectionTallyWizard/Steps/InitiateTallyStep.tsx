import React from 'react';
import { Button, Typography } from '@mui/material';
import { useV1Client } from '../../../hooks/useClient';

interface InitiateTallyStepProps {
    electionId: string;
    onSuccess: () => void;
    onError: (error: string) => void;
}

export const InitiateTallyStep: React.FC<InitiateTallyStepProps> = ({
    electionId,
    onSuccess,
    onError,
}) => {
    const v1Client = useV1Client();

    const handleInitiateTally = async () => {
        try {
            await v1Client.tallyPost(electionId, 'default-tally');
            onSuccess();
        } catch (err) {
            onError('Failed to initiate tally. Please try again.');
        }
    };

    return (
        <>
            <Typography variant="body1">Click the button below to initiate the tally.</Typography>
            <Button variant="contained" color="primary" onClick={handleInitiateTally}>
                Initiate Tally
            </Button>
        </>
    );
};

export default InitiateTallyStep;
