import {
    Body_login_for_access_token_api_v1_auth_login_post,
    ErrorMessage,
    Token,
} from '@electionguard/api-client';
import { Button, Container, InputAdornment, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AccountCircle, Lock } from '@mui/icons-material';
import React, { useState } from 'react';
import { useAuthClient } from '../hooks/useClient';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorMessage: {
        color: 'red',
        marginBottom: theme.spacing(3),
    },
    text: {
        marginBottom: theme.spacing(3),
        width: '100%',
    },
    submit: {
        marginTop: theme.spacing(3),
        width: '100%',
    },
}));

export interface LoginPageProps {
    setToken: (token: Token) => void;
    setUsername: (username: string) => void;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const isErrorMessage = (object: any): object is ErrorMessage => 'detail' in object;

export const LoginPage: React.FC<LoginPageProps> = ({ setToken, setUsername }) => {
    const classes = useStyles();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState<string>();
    const authClient = useAuthClient();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        let isMounted = true;

        const loginParams = {
            username,
            password,
            grant_type: 'password',
            scope: 'voter',
            client_id: 'electionguard-default-client-id',
            client_secret: 'electionguard-default-client-secret',
        } as Body_login_for_access_token_api_v1_auth_login_post;

        try {
            const token = await authClient.login(loginParams);
            if (isMounted) {
                setToken(token);
                setUsername(username);
            }
        } catch (ex: any) {
            if (isMounted) {
                if (typeof ex === 'string') {
                    setResult(ex);
                } else if (ex.status === 401) {
                    setResult('Incorrect username or password');
                } else if (ex.status === 403) {
                    setResult('Your account has been locked. Please contact support.');
                } else if (isErrorMessage(ex)) {
                    setResult(ex.detail);
                } else {
                    setResult('An error occurred');
                }
            }
        }

        return () => {
            isMounted = false; // Cleanup function to prevent state updates
        };
    };

    return (
        <Container maxWidth="xs" className={classes.root}>
            <h1>ElectionGuard Voter Interface</h1>
            <div className={classes.errorMessage}>{result}</div>
            <form onSubmit={handleSubmit}>
                <TextField
                    id="username"
                    label="Username"
                    variant="standard"
                    className={classes.text}
                    onChange={(e) => setUserName(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    id="password"
                    label="Password"
                    variant="standard"
                    className={classes.text}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Log In
                </Button>
            </form>
        </Container>
    );
};

export default LoginPage;
