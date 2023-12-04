import React from 'react';
import ReactMarkdown from 'react-markdown';
import Card from 'react-bootstrap/Card';

export default function Reply(props) {

    const reply = props.reply;

    return (
        <>
            {reply !== undefined &&
            <Card>
                <Card.Body>
                    <Card.Title className='fs-6'>{reply.text}</Card.Title>
                    Posted by <a href={`/user/${reply.userId}/`}>{reply.username}</a> at {new Date(reply.timestamp).toLocaleTimeString()}  on {new Date(reply.timestamp).toLocaleDateString()} 
                </Card.Body>
            </Card>
            }
        </>
    )

}
