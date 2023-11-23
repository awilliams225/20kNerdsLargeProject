import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import ProfileHeader from '../components/ProfileHeader';
import ProfilePaginator from '../components/ProfilePaginator';
import ProfilePostContent from '../components/ProfilePostContent';

const ProfilePostPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <ProfileHeader />
            <ProfilePaginator activeTab="post" />
            <ProfilePostContent />
        </div>
    );
}

export default ProfilePostPage;
