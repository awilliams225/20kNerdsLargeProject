import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Paginator from './Paginator';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Reply from './Reply';

export default function ProfileReplyContent() {

    const { userId, page = '1' } = useParams();

    const [replies, setReplies] = useState({});
    const [numReplies, setNumReplies] = useState({});
    const [repliesLoading, setRepliesLoading] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(true);

    const repliesPerPage = 5;

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    useEffect(() => {
        const grabReplies = async () => {
            setRepliesLoading(true);

            var obj = { userId: userId, perPage: parseInt(repliesPerPage) };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/replies/grabRepliesAndPostsByUserId/" + page), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                console.log(json);

                setReplies(json);

                setRepliesLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        const grabNumReplies = async () => {
            setPaginationLoading(true);

            var obj = { UserID: userId };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/replies/countRepliesByUser"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                setNumReplies(json.repliesCount);

                setPaginationLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        grabReplies();
        grabNumReplies();
    }, [userId, page]);

    const renderForum = () => {
        if (repliesLoading || paginationLoading) {
            return <Spinner animation="border" />;
        }
        else {
            if (replies.pairList == undefined) {
                return (
                    <>
                        <h1>Oops! This user does not appear to have any replies.</h1>
                    </>
                )
            }
            var pairList = replies.pairList;
            console.log(pairList);
            return (
                <>
                    <Card>
                        <Container>
                            <Paginator activePage={page} numPages={Math.ceil(numReplies / repliesPerPage)} />
                            {pairList.map((pair) => (
                                <ListGroup.Item action href={`/question/${pair.post.QuestionSlug}/post/${pair.post.Slug}/`} className="my-3 shadow border-5">
                                    <Reply reply={pair.reply} />
                                </ListGroup.Item>
                            ))}
                        </Container>
                    </Card>
                </>
            )
        }
    }

    return (
        <>
            <div>
                {renderForum()}
            </div>
        </>
    )

}