import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect, useContext } from 'react';
import { StanceContext } from './StanceContext';
import { useParams } from "react-router-dom";
import CreateReplyForm from './CreateReplyForm';
import Reply from './Reply';
import ForumHeader from './ForumHeader';
import PostDetails from '../components/PostDetails';

export default function ReplyForum() {

    const { questionSlug, slug } = useParams();

    const [replies, setReplies] = useState({});
    const [repliesLoading, setRepliesLoading] = useState(true);
    const [question, setQuestion] = useState({});
    const [answer, setAnswer] = useState({});
    const [answerReceived, setAnswerReceived] = useState(null);
    const {stance, setStance} = useContext(StanceContext);

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const runEffect = async () => {
        await grabAnswer();
    }

    const grabAnswer = async () => {
            
        const userData = localStorage.getItem('user_data');
        const userId = JSON.parse(userData).id;

        var question = null;

        const questResponse = await fetch (buildPath("api/questions/getQuestion/" + questionSlug), { method: 'GET', headers: { 'Content-Type': 'application/json' } });

        if (questResponse != null) {
            const questJson = await questResponse.json();

            question = questJson.question;

            setQuestion(question);

            var obj = { userId: userId, questionId: question._id };
            var js = JSON.stringify(obj);

            const answerResponse = await fetch (buildPath("api/answers/getUserAnswer"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (answerResponse != null) {
                const answerJson = await answerResponse.json();

                const answer = answerJson.answer;

                setAnswer(answer);

                setAnswerReceived(true);
            }
        }
    }

    useEffect(() => {
        runEffect();
    }, [])

    useEffect(() => {
        const grabReplies = async () => {

            setRepliesLoading(true);

            var obj = { slug: slug };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/replies/getByPostSlug"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                setReplies(json);

                setRepliesLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        if (answerReceived) {
            grabReplies();
        }
    }, [slug, answerReceived]);

    const renderQuestions = () => {
        if (repliesLoading) {
            return <Spinner animation="border" />;
        }
        else {
            var replyList = replies.replyList;
            return (
                <>
                    <Button variant={`secondary-${stance}`} href={`/question/${questionSlug}/`}>
                        Back to Forum
                    </Button>
                    <ForumHeader question={question} answer={answer} />
                    <PostDetails />
                    <CreateReplyForm slug={slug} />
                    <ListGroup className="mt-3">
                        {replyList.map((reply) => (
                            <ListGroup.Item className="my-3 shadow border-5">
                                <Reply reply={reply} />
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
