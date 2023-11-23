import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import ProfileHeader from '../components/ProfileHeader';
import ProfilePaginator from '../components/ProfilePaginator';
import ProfileReplyContent from '../components/ProfileReplyContent';

const ProfileReplyPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <ProfileHeader />
            <ProfilePaginator activeTab="reply" />
            <ProfileReplyContent />
        </div>
    );
}

export default ProfileReplyPage;
