import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import PostForum from '../components/PostForum';
import Container from 'react-bootstrap/Container';

const PostPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <Container className="my-5">
                <PostForum />
            </Container>
        </div>
    );
}

export default PostPage;
