import React from 'react';
import { Button, Typography } from '@mui/material';
import { useTallyClient } from '../../../hooks/useClient';

interface DecryptTallyStepProps {
    electionId: string;
    ciphertextTally: any;
    onSuccess: (tally: any) => void;
    onError: (error: string) => void;
}

export const DecryptTallyStep: React.FC<DecryptTallyStepProps> = ({
    electionId,
    ciphertextTally,
    onSuccess,
    onError,
}) => {
    const tallyClient = useTallyClient();

    const handleDecryptTally = async () => {
        try {
            const response = await tallyClient.decryptPost(false, {
                election_id: electionId,
                tally_name: 'default-tally',
            });
            onSuccess(response);
        } catch (err) {
            onError('Failed to decrypt tally. Please try again.');
        }
    };

    return (
        <>
            <Typography variant="body1">Click the button below to decrypt the tally.</Typography>
            <Button variant="contained" color="primary" onClick={handleDecryptTally}>
                Decrypt Tally
            </Button>
        </>
    );
};

export default DecryptTallyStep;
