import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ToggleButtonGroup';

import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import React, { useState, useEffect, useContext } from 'react';
import { StanceContext } from './StanceContext';
import { useParams } from "react-router-dom";
import Paginator from '../components/Paginator';

import { useNavigate } from 'react-router-dom';


export default function QuestionForum() {
    const [active, setActive] = useState("");
    const [checked, setChecked] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    const [radioValue, setRadioValue] = useState('');

    const [questions, setQuestions] = useState({});
    const [numQuestions, setNumQuestions] = useState({});
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(true);
    const [randLoading, setRandLoading] = useState(true);
    const [responsesLoading, setResponsesLoading] = useState(false);

    const {stance, setStance} = useContext(StanceContext);
    const [currQuestion, setCurrQuestion] = useState({});
    const [currAnswer, setCurrAnswer] = useState({});
    const [alreadyAnswered, setAlreadyAnswered] = useState(false);
    const [answers, setAnswers] = useState([]);

    const navigate = useNavigate();

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
        const grabAnswers = async () => {

            const userData = localStorage.getItem('user_data');
            const userId = JSON.parse(userData).id;

            var obj = { userId: userId };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/users/getAnsweredQuestions"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' }});

            if (response != null) {
                const json = await response.json();

                setAnswers(json.questionIds);
            }
            else {
                console.log("Response is null");
            }
        }

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
                await checkAnswered(json.question);
                setCurrQuestion(json.question);
                setRandLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        grabAnswers();
        grabQuestions();
        grabNumQuestions();
        grabRandQuestion();
    }, [page]);

    function printResponses(side) {
        if (randLoading || responsesLoading) {
            return <Spinner animation="border" />;
        }
        else {
            let responseText = (<h4>{currQuestion.responses[side]}</h4>);
            if (alreadyAnswered && currAnswer.response === side) {
                return (
                    <div>
                        {responseText}
                        <h5><b>Your Answer!</b></h5>
                    </div>
                )
            } else {
                return responseText;
            }
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

                if (res.answer != null) {
                    setAlreadyAnswered(true);
                    setCurrAnswer(res.answer);
                    setStance(res.answer.stance);
                    setRadioValue(res.answer.response + 1);
                } else
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

        if (!panelOpen) {
            setPanelOpen(true);
        }

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
                            <ListGroup.Item action variant={ answers.includes(question._id) ? "tertiary" : "dark" } className="my-3 shadow border-5" onClick={async (e) => await selectQuestion(question)}>
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

    const renderStanceButton = (style) => {
        return (
            <>
                <Button style={style} 
                    variant={'primary-' + stance} 
                    onClick={ panelOpen && alreadyAnswered ? null : changeStance }
                >
                    <span>{ stance.toUpperCase() } MODE</span>
                    
                    <OverlayTrigger placement='bottom' overlay={
                        <Tooltip>
                            <h3>What is this?</h3>
                            This is your <b>stance.</b> In <b style={{color: 'orange'}}>fight</b> mode, you can argue with people about this topic, while in <b style={{color: 'cyan'}}>flight</b> mode, you can talk to other people who feel the same way as you. You cannot change your stance on a question once you answer it, so choose wisely!
                        </Tooltip>
                    }>
                        <Badge pill bg="secondary" className="m-2">i</Badge>
                    </OverlayTrigger>
                </Button> 
            </>
        )
    }

    const changeStance = () => {
        if (panelOpen && alreadyAnswered) {
            return;
        }

        if (stance === "fight")
            setStance("flight");
        else
            setStance("fight");
    }

    const submitAnswer = async () => {

        const userData = localStorage.getItem('user_data');
        const userId = JSON.parse(userData).id;

        const obj = { response: radioValue - 1, stance: stance, questionId: currQuestion._id, userId: userId }

        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/answers/addAnswer'),
            { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' }});

            if (response.status === 200)
            {
                var res = JSON.parse(await response.text());

                var newArr = answers;
                newArr.push(currQuestion._id);
                setAnswers(newArr);

                renderQuestions();

                await checkAnswered(currQuestion);
            }
        }
        catch (e) {
            console.log(e.toString());
            return;
        }

    }

    const goToForum = () => {

        navigate('/question/' + currQuestion.slug + '/' + 1, { relative: false, replace: true });

    }

    const stanceButtonStyle = () => {
        if (panelOpen && alreadyAnswered) {
            return 'default';
        }
        return 'pointer';
    }

    return (
        <>
            <Collapse in={!panelOpen}>
                <div id="lonely-stance-button">
                    {renderStanceButton({width: '100%', height: '10vh'})}
                </div>
            </Collapse>
            <Collapse in={panelOpen}>
                <Container fluid id="choose-answer-panel">
                    <Row>
                        <ButtonGroup name="options" type="radio" style={{ paddingLeft: 0, paddingRight: 0}}>
                            <ToggleButton className="w-50 d-flex align-items-center justify-content-center"
                                style={{
                                    height: '40vh', borderRadius: '0', padding: '5vw',
                                    position: 'relative', zIndex:'0', border: radioValue == 1 ? '15px solid black' : 'none',
                                }}
                                key={1}
                                id={"radio-1"}
                                type="radio"
                                variant={"primary-" + stance}
                                name="radio"
                                value={1}
                                checked={radioValue === 1}
                                onChange={(e) => setRadioValue(e.currentTarget.value)}
                                disabled={alreadyAnswered}
                            >
                                { printResponses(0)}
                            </ToggleButton>
                            <ToggleButton className="w-50 d-flex align-items-center justify-content-center"
                                style={{
                                    height: '40vh', borderRadius: '0', padding: '5vw',
                                    position: 'relative', zIndex:'0', border: radioValue == 2 ? '15px solid black' : 'none'
                                }}
                                key={2}
                                id={"radio-2"}
                                type="radio"
                                variant={"secondary-" + stance}
                                name="radio"
                                value={2}
                                checked={radioValue === 2}
                                onChange={(e) => setRadioValue(e.currentTarget.value)}
                                disabled={alreadyAnswered}
                            >
                                { printResponses(1) }
                            </ToggleButton>
                        </ButtonGroup>
                    </Row>
                    <Row className="d-flex align-items-center justify-content-center">
                        <div className="d-flex align-items-center justify-content-center shadow"
                            style={{
                                backgroundColor: 'white', width: '60vw',
                                borderRadius: '15px', textAlign: 'center', height: '10vh', marginTop: '-60vh',
                                position: 'absolute'
                            }}
                        >
                            <h3>{currQuestion.text}</h3>
                        </div>
                    </Row>
                    <Row className="d-flex align-items-center justify-content-center">
                        <ButtonGroup style={{ width: '75%'}} name="actions">
                            <Button style={{
                                width: '25%', height: '10vh'
                            }} 
                                onClick={ () => setPanelOpen(false) }
                                variant='secondary'
                                aria-controls="choose-answer-panel lonely-stance-button"
                                aria-expanded={false}
                            >
                                CANCEL
                            </Button>
                            <Button style={{ 
                                width: '35%', height: '10vh'
                            }} 
                                onClick={ alreadyAnswered ? goToForum : submitAnswer}
                                variant="dark"
                                key={3}
                                //className={(active != "1" || active != "2") ? "active" : undefined}
                                id={"3"}
                                active={radioValue === ''}
                            >
                                { alreadyAnswered ? 'GO TO FORUM' : 'SUBMIT' }
                            </Button>
                            {renderStanceButton({width: '25%', height: '10vh', cursor: stanceButtonStyle()})}
                        </ButtonGroup>
                    </Row>
                </Container>
            </Collapse>
            <div>
                {renderQuestions()}
            </div>
            </>
    );
}
