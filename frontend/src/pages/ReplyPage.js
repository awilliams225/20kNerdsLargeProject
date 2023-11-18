import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import Post from '../components/Post';
import ReplyForum from '../components/ReplyForum';

const ReplyPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <Post />
            <ReplyForum />
        </div>
    );
}

export default ReplyPage;
