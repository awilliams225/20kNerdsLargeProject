import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Paginator from '../components/Paginator';

export default function QuestionForum() {

    const [questions, setQuestions] = useState({});
    const [numQuestions, setNumQuestions] = useState({});
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(true);

    const questionsPerPage = 5;

    const { page = '1' } = useParams();

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
            setQuestionsLoading(true);

            var obj = { questionPerPage: parseInt(questionsPerPage) };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/questions/" + page), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                setQuestions(json);

                setQuestionsLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        const grabNumQuestions = async () => {
            setPaginationLoading(true);

            const response = await fetch(buildPath("api/numQuestions"), { method: 'POST',  headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                setNumQuestions(json.numQuestions);

                setPaginationLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        grabQuestions();
        grabNumQuestions();
    }, [page]);

    const renderQuestions = () => {
        if (questionsLoading || paginationLoading) {
            return <Spinner animation="border" />;
        }
        else {
            var questionList = questions.question;
            return (
                <>
                    <Paginator activePage={page} numPages={Math.ceil(numQuestions / questionsPerPage)}/>
                    <ListGroup>
                        {questionList.map((question) => (
                            <ListGroup.Item action variant="dark" href={"/question/" + question.slug + "/"}>
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
