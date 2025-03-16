import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { HomePage, VotePage, CastOrSpoilPage } from '../pages';
import routeIds from './RouteIds';

/**
 * The routes to display when the user is fully authenticated
 * and able to view the main UI
 */
const AuthenticatedRoutes: React.FC = () => (
    <Routes>
        <Route path={routeIds.home} element={<Navigate to="/" />} />
        <Route path="/" element={<HomePage />} />

        <Route path={routeIds.vote} element={<Navigate to="/vote" />} />
        <Route path="/vote" element={<VotePage />} />

        <Route path={routeIds.castorspoil} element={<Navigate to="/:electionId/cast-or-spoil" />} />
        <Route path="/:electionId/cast-or-spoil" element={<CastOrSpoilPage />} />
    </Routes>
);

export default AuthenticatedRoutes;
