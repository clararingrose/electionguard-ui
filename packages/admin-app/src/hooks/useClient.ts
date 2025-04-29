import {
    AuthClient,
    CeremonyClient,
    ClientFactory,
    KeyClient,
    V1Client,
    Token,
} from '@electionguard/api-client';
import {
    BallotClient,
    ElectionClient,
    UserClient,
    TallyClient,
    DecryptClient,
} from '@electionguard/api-client/dist/nswag/clients';
import useToken from './useToken';

function onTokenExpired(setToken: (token?: Token) => void, newToken?: Token) {
    setToken(newToken);
    window.location.reload();
}

export function useV1Client(): V1Client {
    const { token, setToken } = useToken();
    return ClientFactory.GetV1Client(token?.access_token, (newToken?: Token) =>
        onTokenExpired(setToken, newToken)
    );
}

export function useCeremonyClient(): CeremonyClient {
    return ClientFactory.GetCeremonyClient();
}

export function useTallyClient(): TallyClient {
    const { token, setToken } = useToken();
    return ClientFactory.GetTallyClient(token?.access_token, (newToken?: Token) =>
        onTokenExpired(setToken, newToken)
    );
}

export function useAuthClient(): AuthClient {
    return ClientFactory.GetAuthClient();
}

export function useKeyClient(): KeyClient {
    return ClientFactory.GetKeyClient();
}

export function useBallotClient(): BallotClient {
    const { token, setToken } = useToken();

    return ClientFactory.GetBallotClient(token?.access_token, (newToken?: Token) =>
        onTokenExpired(setToken, newToken)
    );
}

export function useUserClient(): UserClient {
    const { token, setToken } = useToken();

    return ClientFactory.GetUserClient(token?.access_token, (newToken?: Token) =>
        onTokenExpired(setToken, newToken)
    );
}

export function useElectionClient(): ElectionClient {
    const { token, setToken } = useToken();

    return ClientFactory.GetElectionClient(token?.access_token, (newToken?: Token) =>
        onTokenExpired(setToken, newToken)
    );
}

// Add the useDecryptClient function
export function useDecryptClient(): DecryptClient {
    const { token, setToken } = useToken();

    return ClientFactory.GetDecryptClient(token?.access_token, (newToken?: Token) =>
        onTokenExpired(setToken, newToken)
    );
}
