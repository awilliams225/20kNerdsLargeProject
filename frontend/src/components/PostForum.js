import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Paginator from '../components/Paginator';
import CreatePostForm from '../components/CreatePostForm';
import Post from './Post';

export default function PostForum() {

    const { questionSlug, page = '1' } = useParams();

    const [posts, setPosts] = useState({});
    const [numPosts, setNumPosts] = useState({});
    const [postsLoading, setPostsLoading] = useState(true);
    const [paginationLoading, setPaginationLoading] = useState(true);
    const [answer, setAnswer] = useState({});
    const [answerReceived, setAnswerReceived] = useState(null);

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

    const grabAnswer = async () => {
            
        const userData = localStorage.getItem('user_data');
        const userId = JSON.parse(userData).id;

        var question = null;

        const questResponse = await fetch (buildPath("api/questions/getQuestion/" + questionSlug), { method: 'GET', headers: { 'Content-Type': 'application/json' } });

        if (questResponse != null) {
            const questJson = await questResponse.json();

            question = questJson.question;

            var obj = { userId: userId, questionId: question._id };
            var js = JSON.stringify(obj);

            const answerResponse = await fetch (buildPath("api/answers/getUserAnswer"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (answerResponse != null) {
                const answerJson = await answerResponse.json();

                const answer = answerJson.answer;

                setAnswer(answer);

                setAnswerReceived(true);
            }
        }
    }

    const runEffect = async () => {
        await grabAnswer();
        console.log("Answer grabbed");
    }

    useEffect(() => {
        runEffect();
    }, [])

    useEffect(() => {

        const grabForum = async () => {
            setPostsLoading(true);

            var obj = { questionSlug: questionSlug, postsPerPage: parseInt(postsPerPage), stance: answer.stance, response: answer.response };
            var js = JSON.stringify(obj);

            console.log(answer);

            const response = await fetch(buildPath("api/getPostsByQuestion/" + page), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                console.log(json);

                setPosts(json);

                setPostsLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        const grabNumPosts = async () => {
            setPaginationLoading(true);

            var obj = { questionSlug: questionSlug, stance: answer.stance, response: answer.response };
            var js = JSON.stringify(obj);

            console.log(answer);

            const response = await fetch(buildPath("api/numPosts"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response != null) {
                const json = await response.json();

                console.log(json.numPosts);

                setNumPosts(json.numPosts);

                setPaginationLoading(false);
            }
            else {
                console.log("Response is null");
            }
        }

        console.log(answerReceived);

        if (answerReceived) {
            console.log("Hello?");
            grabForum();
            grabNumPosts();
        }

    }, [questionSlug, page, answerReceived]);

    const renderForum = () => {
        if (postsLoading || paginationLoading) {
            return <Spinner animation="border" />;
        }
        else {
            var postList = posts.posts;
            return (
                <>
                    <CreatePostForm questionSlug={questionSlug} answerId={answer._id} />
                    <Paginator activePage={page} numPages={Math.ceil(numPosts / postsPerPage)} />
                    <ListGroup className="mt-3">
                        {postList.map((post) => (
                            <ListGroup.Item action href={"post/" + post.Slug + "/"} className="my-3 shadow border-5">
                                <Post post={post} />
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
