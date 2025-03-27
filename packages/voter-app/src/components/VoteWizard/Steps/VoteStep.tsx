/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Typography } from '@mui/material';
import WizardStep, { WizardStepProps } from '../../WizardStep/WizardStep';

export interface VoteStepProps extends WizardStepProps {
    election: any;
    handleSubmit: React.FormEventHandler<HTMLFormElement>;
}

const VoteStep: React.FC<VoteStepProps> = ({ active, election, handleSubmit }) => (
    <WizardStep active={active}>
        <form onSubmit={handleSubmit}>
            {election?.manifest.contests.map((contest: any) => (
                <div
                    key={contest.object_id}
                    style={{ border: '1px solid', margin: '1em', padding: '1em' }}
                >
                    <Typography variant="h5">{contest.ballot_title.text[0].value}</Typography>
                    <Typography variant="h6">{contest.ballot_subtitle.text[0].value}</Typography>
                    {contest.ballot_selections.map((selection: any) => (
                        <div key={selection.object_id}>
                            <label htmlFor={selection.object_id}>
                                {
                                    election.manifest.candidates.find(
                                        (candidate: any) =>
                                            candidate.object_id === selection.candidate_id
                                    )?.name.text[0].value
                                }
                            </label>
                            <input
                                type="radio"
                                name={contest.object_id}
                                id={selection.object_id}
                                value={selection.object_id}
                            />{' '}
                            <br />
                        </div>
                    ))}
                </div>
            ))}
            <Button type="submit" variant="contained" color="primary">
                Encrypt Ballot
            </Button>
        </form>
    </WizardStep>
);

export default VoteStep;
