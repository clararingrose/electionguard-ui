/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DataGrid, GridColumns, GridValueGetterParams } from '@mui/x-data-grid';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { ElectionQueryRequest, BallotInventory } from '@electionguard/api-client';
import { useElectionClient, useBallotClient } from '../hooks/useClient';

export const ElectionPage: React.FC = () => {
    const useStyles = makeStyles((theme) => ({
        root: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(3),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 500,
            width: '100%',
        },
        grid: {
            width: '100%',
        },
    }));
    const classes = useStyles();
    const [pageSize, setPageSize] = useState(10);
    const { electionId } = useParams<{ electionId: string }>();
    const electionClient = useElectionClient();
    const ballotClient = useBallotClient();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [ballotInventory, setBallotInventory] = useState<BallotInventory | null>(null);

    const findParams: ElectionQueryRequest = {
        filter: {
            election_id: electionId,
        },
    };

    const findElection = () =>
        electionClient.find(0, 100, findParams).then((response) => response.elections);
    const { data: elections, isLoading, error } = useQuery('elections', findElection);

    const election = elections?.find((e) => e.election_id === electionId);

    const updateElectionState = async () => {
        if (!electionId || !election) return;

        try {
            if (election.state === 'CREATED') {
                await electionClient.open(electionId);
            } else if (election.state === 'OPEN') {
                await electionClient.close(electionId);
            } else if (election.state === 'CLOSED') {
                await electionClient.publish(electionId);
            }
            queryClient.invalidateQueries('elections'); // Refresh the election data
        } catch (er) {
            // console.error('Failed to update election state:', er);
        }
    };

    const fetchBallotInventory = async () => {
        if (!electionId) return;

        try {
            const response = await ballotClient.inventory(electionId);
            setBallotInventory({
                ...response.inventory,
                cast_ballot_count: response.inventory.cast_ballot_count ?? 0,
                spoiled_ballot_count: response.inventory.spoiled_ballot_count ?? 0,
                cast_ballots: new Map(Object.entries(response.inventory.cast_ballots || {})),
                spoiled_ballots: new Map(Object.entries(response.inventory.spoiled_ballots || {})),
            });
        } catch (err) {
            // console.error('Failed to fetch ballot inventory:', err);
        }
    };

    useEffect(() => {
        if (election?.state === 'CLOSED') {
            fetchBallotInventory();
        }
    }, [election]);

    const candidateColumns = (): GridColumns => [
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
            valueGetter: (params: GridValueGetterParams) =>
                params.row.name?.text?.[0]?.value || 'N/A',
        },
        {
            field: 'object_id',
            headerName: 'ID',
            width: 250,
        },
        {
            field: 'party_id',
            headerName: 'Party ID',
            width: 250,
        },
        {
            field: 'image_uri',
            headerName: 'Logo',
            width: 250,
            renderCell: (params) => <img src={params.value} alt="Logo" height="50px" />,
        },
    ];

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error loading election details</Typography>;
    }

    return (
        <Container maxWidth="md" className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h1>Election Details</h1>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>ID:</strong> {election?.election_id || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>Name:</strong> {election?.manifest?.name?.text?.[0]?.value || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>Start Date:</strong> {election?.manifest?.start_date || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>End Date:</strong> {election?.manifest?.end_date || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>State:</strong> {election?.state || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={updateElectionState}>
                        {election?.state === 'CREATED'
                            ? 'Open Election'
                            : election?.state === 'OPEN'
                            ? 'Close Election'
                            : election?.state === 'CLOSED'
                            ? 'Publish Election'
                            : 'Update State'}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {election?.state === 'CLOSED' || election?.state === 'PUBLISHED' ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/election/${electionId}/tally`)}
                        >
                            Go to Tally Page
                        </Button>
                    ) : null}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>Candidates:</strong>
                    </Typography>
                </Grid>
                <DataGrid
                    rows={election?.manifest?.candidates || []}
                    columns={candidateColumns()}
                    getRowId={(r) => r.object_id}
                    disableSelectionOnClick
                    className={classes.grid}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 50, 100]}
                    pagination
                />
            </Grid>
        </Container>
    );
};

export default ElectionPage;
