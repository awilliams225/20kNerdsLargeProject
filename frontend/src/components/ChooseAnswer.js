//import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Paginator from '../components/Paginator';


export default function ChooseAnswer() {
    const [active, setActive] = useState("");
    const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('');

    const [questions, setQuestions] = useState({});
    const [numQuestions, setNumQuestions] = useState({});
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(true);
    const [randLoading, setRandLoading] = useState(true);
    const [responsesLoading, setResponsesLoading] = useState(false);

    const [stance, setStance] = useState("fight");
    const [currQuestion, setCurrQuestion] = useState({});
    const [alreadyAnswered, setAlreadyAnswered] = useState(false);

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

        const grabRandQuestion = async () => {
            setRandLoading(true);

            const response = await fetch(buildPath("api/questions/getRandom"), { method: 'GET', headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();
                setCurrQuestion(json.question);
                setRandLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        grabQuestions();
        grabNumQuestions();
        grabRandQuestion();
    }, [page]);

    function printResponses(side) {
        if (randLoading || responsesLoading) {
            return <Spinner animation="border" />;
        }
        else {
            if (side == 0)
                return <h4>{currQuestion.responses[0]}</h4>;
            else
                return <h4>{currQuestion.responses[1]}</h4>;
        }
    }

    const checkAnswered = async (question) => {
        
        setResponsesLoading(true);

        const userData = localStorage.getItem('user_data');
        const userId = JSON.parse(userData).id;

        const obj = { userId: userId, questionId: question._id }

        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/answers/getUserAnswer'),
            {method: 'POST', body:js, headers: { 'Content-Type': 'application/json' }});

            if (response.status === 200)
            {

                var res = await response.json();

                if (res.answer != null)
                    setAlreadyAnswered(true);
                else
                    setAlreadyAnswered(false);

                setResponsesLoading(false);
            }
            else
            {
                console.log("Response not successful");
            }
        }
        catch (e) {
            console.log("Error checking answer");
        }

    }

    const selectQuestion = async (question) => {
         
        await checkAnswered(question);

        setCurrQuestion(question);

    }

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
                            <ListGroup.Item action variant="dark" onClick={async (e) => await selectQuestion(question)}>
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

    const changeStance = () => {
        if (stance === "fight")
            setStance("flight");
        else
            setStance("fight");
    }

    const submitAnswer = async () => {

        const userData = localStorage.getItem('user_data');
        const userId = JSON.parse(userData).id;

        console.log('Answer: ' + radioValue);
        console.log('Stance: ' + stance);
        console.log('QuestionId: ' + currQuestion._id);
        console.log('UserId: ' + userId);

        const obj = { response: radioValue - 1, stance: stance, questionId: currQuestion._id, userId: userId }

        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/answers/addAnswer'),
            { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' }});

            if (response.status === 200)
            {
                var res = JSON.parse(await response.text());

                console.log("Question successfully answered!");
            }
        }
        catch (e) {
            console.log(e.toString());
            return;
        }

    }

    return (
        <Container fluid style={{ backgroundColor: '#CDD1D5', height: '50vh' }}>
            <ButtonGroup name="options" type="radio">
                <ToggleButton className="d-flex align-items-center justify-content-center"
                    style={{
                        height: '40vh', width: '52vw', borderRadius: '0',
                        marginLeft: '-5vw', position: 'relative', zIndex:'0'
                    }}
                    key={1}
                    id={"radio-1"}
                    type="radio"
                    //variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={1}
                    checked={radioValue === 1}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                    { printResponses(0)}
                </ToggleButton>
                <ToggleButton className="d-flex align-items-center justify-content-center"
                    style={{
                        height: '40vh', width: '52vw', borderRadius: '0',
                        marginRight: '-15vw', position: 'relative', zIndex:'0'
                    }}
                    key={2}
                    id={"radio-2"}
                    type="radio"
                    //variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={2}
                    checked={radioValue === 2}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                    { printResponses(1) }
                </ToggleButton>
            </ButtonGroup>
            <Row className="d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center"
                    style={{
                        backgroundColor: 'white', width: '60vw',
                        borderRadius: '15px', textAlign: 'center', height: '10vh', marginTop: '-60vh',
                        position: 'absolute'
                    }}
                >
                    <h3>{currQuestion.text}</h3>
                </div>
            </Row>
            <Row>
                <Col className="d-flex align-items-center justify-content-end">
                    <Button style={{
                        width: '75%', height: '10vh', marginRight: '-4vw',
                        borderRadius: 0
                    }} variant='light'>
                        Cancel
                    </Button>
                </Col>
                <Col className="d-flex align-items-center justify-content-center">
                    <Button style={{ width: '40vw', height: '10vh', borderRadius: 0 }} onClick={submitAnswer} disabled={ alreadyAnswered ? true : false }
                        variant="dark"
                        key={3}
                        //className={(active != "1" || active != "2") ? "active" : undefined}
                        id={"3"}
                        active={radioValue === ''}
                        href={"question/" + currQuestion.slug} 
                    >
                        { alreadyAnswered ? 'CHANGE' : 'SUBMIT' }
                    </Button>
                </Col>
                <Col className="d-flex align-items-center justify-content-start">
                    <Button style={{
                        width: '75%', height: '10vh', marginLeft: '-4vw',
                        borderRadius: 0}} 
                        variant='light' 
                        onClick={changeStance}
                    >
                        { stance.toUpperCase() } MODE
                    </Button> 
                </Col>
            </Row>
            <div>
                {renderQuestions()}
            </div>
        </Container>
    );
}
