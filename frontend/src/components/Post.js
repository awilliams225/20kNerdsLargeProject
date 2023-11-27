import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Card from 'react-bootstrap/Card';

export default function Post() {
    const { questionSlug, slug } = useParams();

    const [post, setPost] = useState({});
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
        const grabPost = async () => {
            setLoading(true);

            const response = await fetch(buildPath('api/posts/' + slug), { method: 'GET' })

            if (response != null) {
                const json = await response.json();

                setPost(json);

                setLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        grabPost();
    }, [slug]);

    const renderPost = () => {
        console.log(post)
        if (loading) {
            return <h1>Loading...</h1>
        }
        else {
            return (
                <>
                    <Card className="mb-3 shadow border-5">
                        <Card.Header>
                            <Card.Title>{post.Result.Title}</Card.Title>
                            Posted by <a href={"/user/" + post.Result.UserId + "/"}>{post.Result.Username}</a> on {new Date(post.Result.Timestamp).toDateString()}
                        </Card.Header>
                        <Card.Body>
                            <ReactMarkdown children={post.Result.Content}></ReactMarkdown>
                        </Card.Body>
                    </Card>

                </>
            )
        }
    }

    return (
        <>
            <div>
                {renderPost()}
            </div>
        </>
    )

}
