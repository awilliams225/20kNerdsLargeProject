import { useParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';
import Post from './Post';
import { StanceContext } from './StanceContext';
import Button from 'react-bootstrap/Button';

export default function PostDetails() {
    const { questionSlug, slug } = useParams();

    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
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
                    <Button className="mb-3" variant={`secondary-${stance}`} href={`/question/${questionSlug}/`}>
                        Back to Forum
                    </Button>
                    <Post post={post.Result} />
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
