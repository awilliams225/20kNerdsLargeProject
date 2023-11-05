import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import CreatePostForm from '../components/CreatePostForm';
import AnswerForum from '../components/AnswerForum';

const ForumPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <CreatePostForm />
            <AnswerForum />
        </div>
    );
}

export default ForumPage;
