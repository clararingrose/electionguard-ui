import {
    AuthClient,
    CeremonyClient,
    UserClient,
    V1Client,
    KeyClient,
    Token,
    BallotClient,
    ElectionClient,
    TallyClient,
    DecryptClient,
} from './clients';

export class ClientFactory {
    private static GetUrl(): string {
        return process.env.REACT_APP_MEDIATOR_SERVICE || '';
    }

    public static GetAuthClient(): AuthClient {
        const url = this.GetUrl();
        return new AuthClient(url);
    }

    public static GetCeremonyClient(): CeremonyClient {
        const url = this.GetUrl();
        return new CeremonyClient(url);
    }

    public static GetV1Client(
        token?: string,
        onTokenExpired?: (newToken?: Token) => void
    ): V1Client {
        const url = this.GetUrl();
        const client = new V1Client(url);
        client.token = token;
        client.onTokenExpired = onTokenExpired;
        return client;
    }

    public static GetKeyClient(): KeyClient {
        const url = this.GetUrl();
        return new KeyClient(url);
    }

    public static GetBallotClient(
        token?: string,
        onTokenExpired?: (newToken?: Token) => void
    ): BallotClient {
        const url = this.GetUrl();
        const client = new BallotClient(url);
        client.token = token;
        client.onTokenExpired = onTokenExpired;
        return client;
    }

    public static GetUserClient(
        token?: string,
        onTokenExpired?: (newToken?: Token) => void
    ): UserClient {
        const url = this.GetUrl();
        const client = new UserClient(url);
        client.token = token;
        client.onTokenExpired = onTokenExpired;
        return client;
    }

    public static GetElectionClient(
        token?: string,
        onTokenExpired?: (newToken?: Token) => void
    ): ElectionClient {
        const url = this.GetUrl();
        const client = new ElectionClient(url);
        client.token = token;
        client.onTokenExpired = onTokenExpired;
        return client;
    }

    public static GetTallyClient(
        token?: string,
        onTokenExpired?: (newToken?: Token) => void
    ): TallyClient {
        const url = this.GetUrl();
        const client = new TallyClient(url);
        client.token = token;
        client.onTokenExpired = onTokenExpired;
        return client;
    }

    public static GetDecryptClient(
        token?: string,
        onTokenExpired?: (newToken?: Token) => void
    ): DecryptClient {
        const url = this.GetUrl();
        const client = new DecryptClient(url);
        client.token = token;
        client.onTokenExpired = onTokenExpired;
        return client;
    }
}
