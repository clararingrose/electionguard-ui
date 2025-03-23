import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { HomePage, SubmitBallotPage, VotePage } from '../pages';
import routeIds from './RouteIds';
import VoteWizard from '../components/VoteWizard';

/**
 * The routes to display when the user is fully authenticated
 * and able to view the main UI
 */
const AuthenticatedRoutes: React.FC = () => (
    <Routes>
        <Route path={routeIds.home} element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/vote-wizard" element={<VoteWizard />} />

        {/* <Route path={routeIds.vote} element={<Navigate to="/vote" />} /> */}
        <Route path="/vote" element={<VotePage />} />

        {/* <Route path={routeIds.submit} element={<Navigate to="/submit" />} /> */}
        <Route path="/submit" element={<SubmitBallotPage />} />
    </Routes>
);

export default AuthenticatedRoutes;
