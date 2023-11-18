import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import CreateReplyForm from '../components/CreateReplyForm';

export default function ReplyForum() {

    const { slug } = useParams();

    const [replies, setReplies] = useState({});
    const [repliesLoading, setRepliesLoading] = useState(true);

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

            var obj = { slug: slug };
            var js = JSON.stringify(obj);
            console.log(js);

            const response = await fetch(buildPath("api/replies/getByPostSlug"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

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

        grabReplies();
    }, []);

    const renderQuestions = () => {
        if (repliesLoading) {
            return <Spinner animation="border" />;
        }
        else {
            var replyList = replies.replyList;
            return (
                <>
                    <CreateReplyForm slug={slug} />
                    <ListGroup>
                        {replyList.map((reply) => (
                            <ListGroup.Item variant="dark">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{reply.text}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
            )
        }
    }

    return (
        <>
            <div>
                {renderQuestions()}
            </div>
        </>
    )

}
