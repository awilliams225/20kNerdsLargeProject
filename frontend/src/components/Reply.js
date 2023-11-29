import React from 'react';
import ReactMarkdown from 'react-markdown';
import Card from 'react-bootstrap/Card';

export default function Post(props) {

    const reply = props.reply;

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>{reply.text}</Card.Title>
                    Posted by <a href={"/user/" + reply.userId + "/"}>{reply.username}</a> on {new Date(reply.timestamp).toLocaleString()} 
                </Card.Body>
            </Card>
        </>
    )

}
