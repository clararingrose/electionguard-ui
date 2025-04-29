import React, { createContext, useContext, useState, useEffect } from 'react';
import { Election } from '@electionguard/api-client/dist/nswag/clients';
import { useElectionClient } from '../hooks/useClient';

interface ElectionContextType {
    election: Election | null;
    loading: boolean;
    error: string | null;
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const electionClient = useElectionClient();
    const [election, setElection] = useState<Election | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchElection = async () => {
            const token = localStorage.getItem('accessToken'); // Check for token
            if (!token) {
                setLoading(false); // Stop loading if no token is present
                return;
            }

            try {
                const electionId = process.env.REACT_APP_ELECTION_ID;
                const findParams = { filter: { election_id: electionId } };

                const response = await electionClient.find(0, 100, findParams);

                const { elections } = response;
                const foundElection = (elections ?? []).find((el) => el.election_id === electionId);
                setElection(foundElection || null);
            } catch (err) {
                if ((err as any)?.response?.status === 401) {
                    setError('Unauthorized. Please log in again.');
                } else {
                    setError('Failed to fetch election data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchElection();
    }, [electionClient]);

    const contextValue = React.useMemo(
        () => ({ election, loading, error }),
        [election, loading, error]
    );

    return <ElectionContext.Provider value={contextValue}>{children}</ElectionContext.Provider>;
};

export const useElectionContext = (): ElectionContextType => {
    const context = useContext(ElectionContext);
    if (!context) {
        throw new Error('useElectionContext must be used within an ElectionProvider');
    }
    return context;
};
