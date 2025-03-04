import { FormattedMessage } from 'react-intl';
import { Container, Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Message, MessageId } from '../lang';
import routeIds from '../routes/RouteIds';
import { useUserClient } from '../hooks/useClient';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import IconHeader from '../components/IconHeader';

export const ResetPasswordPage: React.FC = () => {
    const [errorMessageId, setErrorMessageId] = useState<string>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const queryClient = new QueryClient();
    const userClient = useUserClient();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const un = username;
        const pw = password;

        try {
            await userClient.reset_password(un, pw);
            navigate(routeIds.manageUsers);
        } catch (ex) {
            setErrorMessageId(MessageId.ResetPassword_Error);
        }
    };

    const onCancel = () => {
        navigate(routeIds.manageUsers);
    };

    const isFormValid: () => boolean = () => !!(username && password);

    return (
        <Container maxWidth="sm">
            <QueryClientProvider client={queryClient}>
                <IconHeader title={new Message(MessageId.ResetPassword_Title)} />
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        {errorMessageId && (
                            <Grid item xs={12}>
                                <ErrorMessage MessageId={errorMessageId} />
                            </Grid>
                        )}
                        <Grid item sm={8} xs={12}>
                            <TextField
                                id="username"
                                label="Username"
                                fullWidth
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                id="password"
                                label="New Password"
                                type="password"
                                fullWidth
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={!isFormValid()}
                            >
                                <FormattedMessage id={MessageId.Actions_Submit} />
                            </Button>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <Button type="button" color="secondary" fullWidth onClick={onCancel}>
                                <FormattedMessage id={MessageId.Actions_Cancel} />
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </QueryClientProvider>
        </Container>
    );
};

export default ResetPasswordPage;
