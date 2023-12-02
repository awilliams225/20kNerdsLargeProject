import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Paginator from '../components/Paginator';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Post from './Post';

export default function ProfilePostContent() {

    const { userId, page = '1' } = useParams();

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
        const grabPosts = async () => {
            setPostsLoading(true);

            var obj = { userId: userId, postsPerPage: parseInt(postsPerPage) };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/posts/getPostsByUser/" + page), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

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

            var obj = { UserId: userId };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/posts/countPostsByUser"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                setNumPosts(json.postsCount);

                setPaginationLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        grabPosts();
        grabNumPosts();
    }, [userId, page]);

    const renderForum = () => {
        if (postsLoading || paginationLoading) {
            return <Spinner animation="border" />;
        }
        else {
            if (posts.list == undefined) {
                return (
                    <>
                        <h1>Oops! This user does not appear to have any posts.</h1>
                    </>
                )
            }
            var postList = posts.list;
            return (
                <>
                    <Card>
                        <Container>
                            <Paginator activePage={page} numPages={Math.ceil(numPosts / postsPerPage)} />
                            {postList.map((post) => (
                                <ListGroup.Item action href={`/question/${post.QuestionSlug}/post/${post.Slug}/`} className="my-3 shadow border-5">
                                    <Post post={post} />
                                </ListGroup.Item>
                            ))}
                        </Container>
                    </Card>
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