import React, { useState } from 'react';
import { Button, Typography, Grid } from '@mui/material';
import { useTallyClient, useDecryptClient } from '../../../hooks/useClient';

interface DecryptSharePostTallyStepProps {
    electionId: string;
    ciphertextTally: any;
    context: any;
    guardians: string[];
    onSuccess: () => void;
    onError: (error: string) => void;
}

export const DecryptSharePostTallyStep: React.FC<DecryptSharePostTallyStepProps> = ({
    electionId,
    ciphertextTally,
    context,
    guardians,
    onSuccess,
    onError,
}) => {
    const tallyClient = useTallyClient();
    const decryptClient = useDecryptClient(); // Use DecryptClient
    const [currentGuardianIndex, setCurrentGuardianIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const handleDecryptShare = async () => {
        setIsProcessing(true);
        try {
            const guardianId = guardians[currentGuardianIndex];

            // Step 1: Decrypt the share using TallyClient
            const response = await tallyClient.decryptSharePostTally(
                guardianId,
                ciphertextTally,
                context
            );

            // Step 2: Construct the CiphertextTallyDecryptionShare
            const share = {
                election_id: ciphertextTally.election_id,
                tally_name: ciphertextTally.tally_name,
                guardian_id: guardianId,
                tally_share: response, // Use the response from decryptSharePostTally
            };

            // Step 3: Submit the share using DecryptClient
            await decryptClient.submitShare({
                share, // Pass the constructed share as part of the DecryptionShareRequest
            });

            setResults((prevResults) => [...prevResults, { guardianId, response }]);

            if (currentGuardianIndex + 1 < guardians.length) {
                setCurrentGuardianIndex((prevIndex) => prevIndex + 1);
            } else {
                onSuccess();
            }
        } catch (err) {
            onError('Failed to process decryption share. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Typography variant="body1">
                Processing decryption shares for guardian {currentGuardianIndex + 1} of{' '}
                {guardians.length}.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleDecryptShare}
                disabled={isProcessing}
            >
                {isProcessing ? 'Processing...' : 'Decrypt Share'}
            </Button>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {results.map((result, index) => (
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
        </>
    );
};

export default DecryptSharePostTallyStep;
