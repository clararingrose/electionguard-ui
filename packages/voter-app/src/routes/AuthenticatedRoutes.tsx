import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { HomePage } from '../pages';
import routeIds from './RouteIds';
import VoteWizard from '../components/VoteWizard';

interface AuthenticatedRoutesProps {
    username: string | null; // Add username prop
}

/**
 * The routes to display when the user is fully authenticated
 * and able to view the main UI
 */
const AuthenticatedRoutes: React.FC<AuthenticatedRoutesProps> = ({ username }) => (
    <Routes>
        <Route path={routeIds.home} element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage username={username} />} /> {/* Pass username */}
        <Route path="/vote" element={<VoteWizard />} />
    </Routes>
);

export default AuthenticatedRoutes;
