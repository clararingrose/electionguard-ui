import { Container } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AsyncResult, JointKey } from '@electionguard/api-client';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { useCeremonyClient } from '../hooks/useClient';
import JointKeyTable from '../components/JointKeyTable';
import MessageId from '../lang/MessageId';
import IconHeader from '../components/IconHeader';

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

export const KeyListPage: React.FC = () => {
    const classes = useStyles();
    const [jointKeys, setJointKeys] = useState([] as JointKey[]);

    const ceremonyClient = useCeremonyClient();

    const findJointKeys = async () => ceremonyClient.joint_key;
    const keysQuery = useQuery('users', async () => {
        const foundJointKeys = await findJointKeys();
        if (foundJointKeys) {
            setJointKeys(foundJointKeys);
        }
        return foundJointKeys;
    });

    const getJointKeys = (): AsyncResult<JointKey[]> => keysQuery;

    return (
        <Container maxWidth="md" className={classes.root}>
            <IconHeader titleId={MessageId.JointKeyList_Title} />

            <JointKeyTable data={getJointKeys} />
        </Container>
    );
};

export default KeyListPage;
