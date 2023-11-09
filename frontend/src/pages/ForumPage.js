import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import CreatePostForm from '../components/CreatePostForm';
import Paginator from '../components/Paginator';
import AnswerForum from '../components/AnswerForum';
import Container from 'react-bootstrap/Container';

const ForumPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <Container className="my-5">
                <CreatePostForm />
                <Paginator />
                <AnswerForum />
            </Container>
        </div>
    );
}

export default ForumPage;
