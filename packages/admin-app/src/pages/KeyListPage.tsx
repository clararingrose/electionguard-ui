import { Container } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { JointKey } from '@electionguard/api-client';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
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
    const [jointKeys, setJointKeys] = useState<JointKey[]>([]);
    const ceremonyClient = useCeremonyClient();

    // const findJointKeys = async () => {
    //     const response: JointKey[] = await ceremonyClient.getJointKeys();
    //     return response;
    // };
    // const { data: foundJointKeys } = useQuery('jointKeys', findJointKeys, {
    //     onSuccess: (data) => {
    //         if (data) {
    //             setJointKeys(data);
    //         }
    //     },
    // });

    return (
        <h1>Key List Page</h1>
        // <Container maxWidth="md" className={classes.root}>
        //     <IconHeader titleId={MessageId.JointKeyList_Title} />

        //     <JointKeyTable data={jointKeys} />
        // </Container>
    );
};

export default KeyListPage;
