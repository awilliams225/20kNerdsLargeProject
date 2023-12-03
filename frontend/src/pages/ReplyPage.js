import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import PostDetails from '../components/PostDetails';
import ReplyForum from '../components/ReplyForum';
import Container from 'react-bootstrap/Container';

const ReplyPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <Container className="my-5">
                <PostDetails />
                <ReplyForum />
            </Container>
        </div>
    );
}

export default ReplyPage;
