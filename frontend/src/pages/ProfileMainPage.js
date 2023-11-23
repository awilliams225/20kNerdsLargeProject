import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import ProfileHeader from '../components/ProfileHeader';
import ProfilePaginator from '../components/ProfilePaginator';
import ProfileMainContent from '../components/ProfileMainContent';

const ProfileMainPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <ProfileHeader />
            <ProfilePaginator activeTab="main" />
            <ProfileMainContent />
        </div>
    );
}

export default ProfileMainPage;
