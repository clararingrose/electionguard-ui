/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Typography } from '@mui/material';
import WizardStep, { WizardStepProps } from '../../WizardStep';

export interface VoteStepProps extends WizardStepProps {
    election: any;
    handleSubmit: React.FormEventHandler<HTMLFormElement>;
}

const VoteStep: React.FC<VoteStepProps> = ({ active, election, handleSubmit }) => (
    <WizardStep active={active}>
        <form onSubmit={handleSubmit}>
            <Typography variant="h4">
                Election Title: {election?.manifest.name.text[0].value}
            </Typography>
            <Typography variant="h5">
                Ballot Title: {election?.manifest.contests[0].ballot_title.text[0].value}
            </Typography>
            <Typography variant="h6">
                Ballot Subtitle: {election?.manifest.contests[0].ballot_subtitle.text[0].value}
            </Typography>
            {election?.manifest.candidates.map((candidate: any) => (
                <div key={candidate.object_id}>
                    <label htmlFor={candidate.object_id}>{candidate.name.text[0].value}</label>
                    <input
                        type="radio"
                        name="election"
                        id={candidate.object_id}
                        value={candidate.object_id}
                    />{' '}
                    <br />
                </div>
            ))}
            <Button type="submit" variant="contained" color="primary">
                Encrypt Ballot
            </Button>
        </form>
    </WizardStep>
);

export default VoteStep;
