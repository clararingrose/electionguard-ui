import { Button, Container, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DataGrid, GridColumns, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ElectionQueryRequest } from '@electionguard/api-client/dist/nswag/clients';
// import { ElectionState } from '@electionguard/api-client/src/models';
import { useElectionClient } from '../hooks/useClient';

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
        electionState: {
            textTransform: 'lowercase',
        },
        navArea: {
            paddingBottom: theme.spacing(4),
        },
        error: {
            marginBottom: theme.spacing(2),
        },
    }));
    const classes = useStyles();
    const [pageSize, setPageSize] = React.useState(10);
    const { electionId } = useParams<{ electionId: string }>();
    const electionClient = useElectionClient();
    // const [electionState, setElectionState] = useState<ElectionState>();

    const findParams: ElectionQueryRequest = {
        filter: {
            election_id: electionId,
        },
    };

    const findElection = () =>
        electionClient.find(0, 100, findParams).then((response) => response.elections);
    const usersQuery = useQuery('elections', findElection);

    const election = usersQuery.data?.find((e) => e.election_id === electionId);

    // const handleElectionState: React.FormEventHandler<HTMLFormElement> = async (e) => {
    //     e.preventDefault();

    //     if (election.state === ElectionState.CREATED) {
    //         await electionClient.open(electionId);
    //     } else if (electionState === ElectionState.OPEN) {
    //         await electionClient.close(electionId);
    //     } else if (electionState === ElectionState.CLOSED) {
    //         await electionClient.publish(electionId);
    //     }
    // };

    const candidateColumns = (): GridColumns => [
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
            valueGetter: (params: GridValueGetterParams) => params.row.name.text[0].value,
        },
        {
            field: 'object_id',
            headerName: 'ID',
            width: 250,
        },
        {
            field: 'party_id',
            headerName: 'ID',
            width: 250,
        },
        {
            field: 'image_uri',
            headerName: 'Logo',
            width: 250,
            renderCell: (params) => <img src={params.value} alt="Logo" height="50px" />,
        },
    ];

    return (
        <Container maxWidth="md" className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h1>Election Details</h1>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>ID:</strong> {election?.election_id}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>Name:</strong> {election?.manifest.name.text[0].value}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>Start Date:</strong> {election?.manifest.start_date}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>End Date:</strong> {election?.manifest.end_date}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>State:</strong> {election?.state}
                    </Typography>
                </Grid>
                {/* <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleElectionState}>
                        Open Election
                    </Button>
                </Grid> */}
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <strong>Candidates:</strong>
                    </Typography>
                </Grid>
                <DataGrid
                    rows={election?.manifest.candidates}
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
