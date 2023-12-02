import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import Form from 'react-bootstrap/Form';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ProfileHeader() {
    const { userId } = useParams();

    const [user, setUser] = useState({});
    const [userLoading, setUserLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [postNumber, setPostNumber] = useState(0);
    const [replyNumber, setReplyNumber] = useState('');
    const [statsLoading, setStatsLoading] = useState(true);

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
        const getUser = async () => {
            setUserLoading(true);

            const obj = { userId };
            const js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/getUserByUserId"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                const json = JSON.parse(await response.text());

                console.log(json);

                setUser(json.results);

                setEmail(json.results.Email);

                setUsername(json.results.Username);

                setUserLoading(false);
            }
            else {
                console.log("Could not find user!");
            }
        }

        getUser();
    }, [userId])

    useEffect(() => {
        const getStats = async () => {
            setStatsLoading(true);

            var obj = { userId };
            var js = JSON.stringify(obj);

            var response = await fetch(buildPath("api/posts/countPostsByUser"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                var json = JSON.parse(await response.text());

                console.log(json);

                setPostNumber(json.postsCount);

                console.log(postNumber);

                setStatsLoading(false);
            }
            else {
                console.log("Could not find user!");
            }

            var response = await fetch(buildPath("api/replies/countRepliesByUser"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                var json = JSON.parse(await response.text());

                console.log(json);

                setReplyNumber(json.repliesCount);

                console.log(replyNumber);

                setStatsLoading(false);
            }
            else {
                console.log("Could not find user!");
            }
        }
        
        getStats();
    }, [userId, user])

    const onEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const onUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const updateEmail = async () => {
        const obj = { userId: userId, email: email };
        const js = JSON.stringify(obj);

        const response = await fetch(buildPath("api/changeEmail"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
            console.log("Successful email change!");
        }
        else {
            console.log("Email change not successful...");
        }
    }

    const renderUserInfo = () => {
        if (userLoading || statsLoading) {
            return <Spinner animation='border' />
        }
        else {
            return (
                <Card>
                    <Container>
                        <Row>
                            <Col>
                                <Card className='shadow border-5 m-3'>
                                    <Form className='m-3'>
                                        <Form.Group className='mb-3' controlId='usernameForm'>
                                            <Form.Label>Username:</Form.Label>
                                            <Form.Control type='text' onChange={onUsernameChange} value={username} disabled={ userId == JSON.parse(localStorage.getItem('user_data')).id ? false : true }></Form.Control>
                                            <Button style={{ display: (userId == JSON.parse(localStorage.getItem('user_data')).id ? "block" : "none") }}>Change Username</Button>
                                        </Form.Group>
                                        <Form.Group className='mb-3' controlId='usernameForm' style={{ display: (userId == JSON.parse(localStorage.getItem('user_data')).id ? "block" : "none") }}>
                                            <Form.Label>Password:</Form.Label>
                                            <Form.Control type='text'></Form.Control>
                                            <Button>Change Password</Button>
                                        </Form.Group>
                                        <Form.Group className='mb-3' controlId='usernameForm'>
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type='text' onChange={onEmailChange} value={email} disabled={ userId == JSON.parse(localStorage.getItem('user_data')).id ? false : true }></Form.Control>
                                            <Button onClick={updateEmail} style={{ display: (userId == JSON.parse(localStorage.getItem('user_data')).id ? "block" : "none") }}>Change Email</Button>
                                        </Form.Group>
                                    </Form>
                                </Card>
                            </Col>
                            <Col>
                                <Card className='shadow border-5 m-3 p-2'>
                                    <Card.Title>Stats:</Card.Title>
                                    <Card.Text className='h2'>Posts: {postNumber}</Card.Text>
                                    <Card.Text className='h2'>Replies: {replyNumber}</Card.Text>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Card>
            )
        }
    }

    return (
        <>
            <div>
                {renderUserInfo()}
            </div>
        </>
    )

}
