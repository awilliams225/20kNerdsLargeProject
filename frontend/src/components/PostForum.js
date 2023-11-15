import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import Paginator from '../components/Paginator';
import CreatePostForm from '../components/CreatePostForm';

export default function PostForum() {

    const { questionSlug, page = '1' } = useParams();

    const [posts, setPosts] = useState({});
    const [numPosts, setNumPosts] = useState({});
    const [postsLoading, setPostsLoading] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(true);

    const postsPerPage = 5;

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
        const grabForum = async () => {
            setPostsLoading(true);

            var obj = { questionSlug: questionSlug, postsPerPage: parseInt(postsPerPage) };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/postsByQuestion/" + page), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                setPosts(json);

                setPostsLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        const grabNumPosts = async () => {
            setPaginationLoading(true);

            var obj = { questionSlug: questionSlug };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/numPosts"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                setNumPosts(json.numPosts);

                setPaginationLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        grabForum();
        grabNumPosts();
    }, [questionSlug, page]);

    const renderForum = () => {
        if (postsLoading || paginationLoading) {
            return <Spinner animation="border" />;
        }
        else {
            var postList = posts.posts;
            return (
                <>
                    <CreatePostForm questionSlug={questionSlug} />
                    <Paginator activePage={page} numPages={Math.ceil(numPosts / postsPerPage)} />
                    <ListGroup className="mt-3">
                        {postList.map((post) => (
                            <ListGroup.Item action variant="dark" href={"post/" + post.Slug + "/"} className="my-1">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{post.Title}</Card.Title>
                                        <Card.Text>
                                            <ReactMarkdown children={post.Content}></ReactMarkdown>
                                        </Card.Text>
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
                {renderForum()}
            </div>
        </>
    )

}
