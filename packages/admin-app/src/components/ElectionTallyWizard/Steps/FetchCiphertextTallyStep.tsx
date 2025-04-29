import React, { useState } from 'react';
import { Button, Typography, Grid } from '@mui/material';
import { useV1Client } from '../../../hooks/useClient';

interface FetchCiphertextTallyStepProps {
    electionId: string;
    onSuccess: (tally: any) => void;
    onError: (error: string) => void;
}

export const FetchCiphertextTallyStep: React.FC<FetchCiphertextTallyStepProps> = ({
    electionId,
    onSuccess,
    onError,
}) => {
    const v1Client = useV1Client();
    const [isFetching, setIsFetching] = useState(false); // Track if the fetch is in progress
    const [ciphertextTally, setCiphertextTally] = useState<any | null>(null); // Store fetched tally

    const handleFetchCiphertextTally = async () => {
        setIsFetching(true); // Disable the button while fetching
        try {
            const response = await v1Client.tallyGet(electionId, 'default-tally');
            setCiphertextTally(response); // Store the fetched tally
            onSuccess(response); // Notify parent component of success
        } catch (err) {
            onError('Failed to fetch ciphertext tally. Please try again.');
        } finally {
            setIsFetching(false); // Re-enable the button after fetching
        }
    };

    return (
        <>
            <Typography variant="body1">
                Click the button below to fetch the ciphertext tally.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleFetchCiphertextTally}
                disabled={isFetching} // Disable the button while fetching
            >
                {isFetching ? 'Fetching...' : 'Fetch Ciphertext Tally'}
            </Button>
            {ciphertextTally && (
                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Ciphertext Tally</Typography>
                        <Typography variant="body1">
                            <pre>{JSON.stringify(ciphertextTally, null, 2)}</pre>
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </>
    );
};

export default FetchCiphertextTallyStep;
