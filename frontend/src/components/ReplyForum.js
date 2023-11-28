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
        const grabAnswer = async () => {
            let userData = localStorage.getItem('user_data');
            if (!userData) {
                return;
            }
            let userId = JSON.parse(userData).id;

            const questResponse = await fetch(buildPath('api/questions/getQuestion/' + slug), { method: 'GET', headers: { 'Content-Type': 'application/json' }});

            if (questResponse != null) {
                const questJson = await questResponse.json();

                console.log(questJson);
            }
            else {
                console.log('Question is null');
            }
        }

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

        grabAnswer();
        grabReplies();
    }, [slug]);

    const renderQuestions = () => {
        if (repliesLoading) {
            return <Spinner animation="border" />;
        }
        else {
            var replyList = replies.replyList;
            console.log(replyList);
            return (
                <>
                    <CreateReplyForm slug={slug} />
                    <ListGroup className="mt-3">
                        {replyList.map((reply) => (
                            <ListGroup.Item className="my-3 shadow border-5">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{reply.text}</Card.Title>
                                        Posted by <a href={"/user/" + reply.userId + "/"}>{reply.username}</a> on {new Date(reply.timestamp).toDateString()} 
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
