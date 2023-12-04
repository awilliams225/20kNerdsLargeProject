import React from 'react';
import Card from 'react-bootstrap/Card';
import StanceInfo from './StanceInfo';

export default function ForumHeader(props) {

    const question = props.question;
    const answer = props.answer;
    return (
        <>
            <Card className="my-4 shadow border-5">
                <Card.Header>
                    <Card.Title className="text-center fs-1">{question.text}</Card.Title>
                    <Card.Title className="text-center fs-3">Stance: {`${answer.stance.charAt(0).toUpperCase()}${answer.stance.substring(1)}`} Mode <StanceInfo /></Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text className="text-center fs-4"> You answered: "{question.responses[answer.response]}"</Card.Text>
                </Card.Body>
            </Card>
        </>
    )

}
