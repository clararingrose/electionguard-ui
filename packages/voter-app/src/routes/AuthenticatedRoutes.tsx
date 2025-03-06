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

        <Route path={routeIds.castorspoil} element={<Navigate to="/cast-or-spoil" />} />
        <Route path="/cast-or-spoil" element={<CastOrSpoilPage />} />

        {/* <Route path={routeIds.electionList} element={<ElectionListPage />} />
        <Route path="/election-setup" element={<ElectionSetupPage />} />
        <Route path="/election/:election-id/key" element={<ElectionKeyPage />} />

        <Route path="/key" element={<KeyListPage />} />
        <Route path={routeIds.keySetup} element={<KeySetupPage />} />
        <Route path="/key/:key-id/ceremony" element={<KeyCeremonyPage />} />

        <Route path="/tally" element={<TallyListPage />} />
        <Route path="/tally-setup" element={<TallySetupPage />} />
        <Route path="/tally/:key-id/ceremony" element={<TallyCeremonyPage />} />

        <Route path={routeIds.manageUsers} element={<UserManagementPage />} />
        <Route path={routeIds.addUser} element={<AddUserPage />} /> */}
    </Routes>
);

export default AuthenticatedRoutes;
