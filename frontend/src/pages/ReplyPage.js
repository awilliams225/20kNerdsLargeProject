import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import Post from '../components/Post';
import ReplyForum from '../components/ReplyForum';
import Container from 'react-bootstrap/Container';

const ReplyPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <Container className="my-5">
                <Post />
                <ReplyForum />
            </Container>
        </div>
    );
}

export default ReplyPage;
