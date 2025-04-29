import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Typography, Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ElectionQueryRequest } from '@electionguard/api-client';
import type { Election } from '@electionguard/api-client/dist/nswag/clients';
import { useElectionClient, useBallotClient } from '../hooks/useClient';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    content: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    voterTokenBox: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
    },
    messageBox: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#f9f9f9',
    },
}));

// Helper function to format dates
const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // Ensures 12-hour format with AM/PM
    }).format(date);
};

export interface HomePageProps {
    username: string | null;
}

export const HomePage: React.FC<HomePageProps> = ({ username }) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const electionId = process.env.REACT_APP_ELECTION_ID;
    const electionClient = useElectionClient();
    const ballotClient = useBallotClient();

    const [message, setMessage] = useState<string | null>(null); // State for displaying messages
    const [hasCast, setHasCast] = useState<boolean>(false); // State for tracking if the user has cast a ballot
    const [voterToken, setVoterToken] = useState<string | null>(null); // State for storing the voter token
    const [election, setElection] = useState<Election | undefined>(undefined); // State for storing the election name

    const findParams: ElectionQueryRequest = {
        filter: {
            election_id: electionId,
        },
    };

    const findElection = () =>
        electionClient.find(0, 100, findParams).then((response) => response.elections);

    const { data: elections, isLoading, error } = useQuery('elections', findElection);

    // Update the election state when elections data changes
    useEffect(() => {
        if (elections) {
            const foundElection = elections.find((e) => e.election_id === electionId);
            setElection(foundElection);
        }
    }, [elections, electionId]);

    // Fetch voter status
    useEffect(() => {
        const fetchVoterStatus = async () => {
            try {
                const response = await ballotClient.checkVoterStatus(
                    electionId || 'placeholder',
                    username || 'placeholder'
                );

                if (response.ok) {
                    const data = await response.json();

                    if (data.data.has_cast) {
                        setHasCast(true);
                    } else {
                        setHasCast(false);
                        setVoterToken(data.data.voter_token);
                    }
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (er) {
                setMessage('An error occurred while checking voter status. Please try again.');
            }
        };

        if (election) {
            fetchVoterStatus();
        }
    }, [ballotClient, election, electionId, username]);

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error loading election details</Typography>;
    }

    const isElectionOpen = election?.state === 'OPEN';
    const electionName = election?.manifest.name.text[0].value || 'Unknown Election';
    const electionStartDate = formatDate(election?.manifest.start_date);
    const electionEndDate = formatDate(election?.manifest.end_date);

    return (
        <Grid container className={classes.root}>
            <Container maxWidth="md" className={classes.content}>
                <Typography variant="h4" gutterBottom>
                    {electionName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Start Date: {electionStartDate}
                    <br />
                    End Date: {electionEndDate}
                    <br />
                </Typography>
                {isElectionOpen && !hasCast && voterToken && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/vote', { state: { voterToken } })}
                    >
                        Click Here to Vote
                    </Button>
                )}
                {isElectionOpen && hasCast && (
                    <Typography variant="subtitle1" gutterBottom>
                        You have already cast a ballot. Please contact the election office at{' '}
                        {election?.manifest.contact_information.email[0].value} for more
                        information.
                    </Typography>
                )}
                {!isElectionOpen && (
                    <Typography variant="subtitle1" gutterBottom>
                        The election is not currently open. Please check back later.
                    </Typography>
                )}
                {message && (
                    <Box className={classes.messageBox}>
                        <Typography variant="body1" color="error">
                            {message}
                        </Typography>
                    </Box>
                )}
            </Container>
        </Grid>
    );
};

export default HomePage;
