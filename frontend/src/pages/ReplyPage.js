import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import ReplyForum from '../components/ReplyForum';
import Container from 'react-bootstrap/Container';

const ReplyPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <Container className="my-5">
                <ReplyForum />
            </Container>
        </div>
    );
}

export default ReplyPage;
