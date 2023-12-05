import React from 'react';
import ReactMarkdown from 'react-markdown';
import Card from 'react-bootstrap/Card';

export default function Post(props) {

    const post = props.post;

    return (
        <>
            {post !== undefined &&
            <Card className="mb-3 shadow border-5">
                <Card.Header>
                    <Card.Title>{post.Title}</Card.Title>
                    Posted by <a href={`/user/${post.UserId}/`}>{post.Username}</a> at {new Date(post.Timestamp).toLocaleTimeString()} on {new Date(post.Timestamp).toLocaleDateString()}
                </Card.Header>
                <Card.Body>
                    <ReactMarkdown children={post.Content}></ReactMarkdown>
                </Card.Body>
            </Card>
            }
        </>
    )

}
