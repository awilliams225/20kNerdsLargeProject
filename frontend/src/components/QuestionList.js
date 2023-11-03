import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from 'react';

export default function QuestionList() {

    const [questions, setQuestions] = useState({});
    const [loading, setLoading] = useState(true);

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
        const grabQuestions = async () => {
            setLoading(true);

            var obj = { questionPerPage: parseInt(1) };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath(`api/questions/pageNum?` + new URLSearchParams({ pageNum: 2 })), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                setQuestions(json);

                setLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        grabQuestions();
    }, []);

    const renderQuestions = () => {
        if (loading) {
            return <Spinner animation="border" />;
        }
        else {
            var questionList = questions.question;
            return (
                <>
                    <ListGroup>
                        {questionList.map((question) => (
                            <ListGroup.Item action variant="dark">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{question.text}</Card.Title>
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
