import React, { useEffect, useState, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import Form from 'react-bootstrap/Form';
import { StanceContext } from './StanceContext';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


export default function ProfileHeader() {
    const { userId } = useParams();

    const [user, setUser] = useState({});
    const [userLoading, setUserLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [postNumber, setPostNumber] = useState(0);
    const [replyNumber, setReplyNumber] = useState('');
    const [statsLoading, setStatsLoading] = useState(true);
    const [usernameMessage, setUsernameMessage] = useState(true);
    const {stance, setStance} = useContext(StanceContext);

    const [showCount, setShowCount] = useState(false);
    const [showUpper, setShowUpper] = useState(false);
    const [showLower, setShowLower] = useState(false);
    const [showNum, setShowNum] = useState(false);
    const [showSpecial, setShowSpecial] = useState(false);
    const [showPassValid, setShowPassValid] = useState(false);
    const [passValid, setPassValid] = useState(false);
    const [show, setShow] = useState(false);

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

            var obj = { UserId: userId };
            var js = JSON.stringify(obj);

            var response = await fetch(buildPath("api/posts/countPostsByUser"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                var json = JSON.parse(await response.text());

                setPostNumber(json.postsCount);

                setStatsLoading(false);
            }
            else {
                console.log("Could not find user!");
            }

            var response = await fetch(buildPath("api/replies/countRepliesByUser"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                var json = JSON.parse(await response.text());

                setReplyNumber(json.repliesCount);

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
            setEmailMessage("Email changed successfully!");
        }
        else {
            setEmailMessage("Email change not successful...");
        }
    }

    const updateUsername = async () => {
        const obj = { userId: userId, newUsername: username };
        const js = JSON.stringify(obj);

        const response = await fetch(buildPath("api/changeUsername"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
            setUsernameMessage("Username changed successfully!");
        }
        else {
            setUsernameMessage("Unable to change username.");
        }
    }

    async function changePass() {
        var obj = { userId: userId, newPassword: password };
        var js = JSON.stringify(obj);

        if (!passValid)
        {
            setShowPassValid(true);
            return;
        }

        const response = await fetch(buildPath("api/changePassword"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
            setPasswordMessage("Password changed successfully!");
        }
        else {
            setPasswordMessage("Unable to change password.");
        }
    }

    const passToolTip = (
        <Tooltip>
            <span className='text-light' id='passValidSpan' style={{ display: showPassValid ? "inline" : "none" }}>This password is invalid!</span><br />
            <span className='text-light small' id='passLengthSpan' style={{ display: showCount ? "inline" : "none" }}>* Please make password 8 characters or more</span><br />
            <span className='text-light small' id='passUpperSpan' style={{ display: showUpper ? "inline" : "none" }}>* Please include at least 1 uppercase letter</span><br />
            <span className='text-light small' id='passLowerSpan' style={{ display: showLower ? "inline" : "none" }}>* Please include at least 1 lowercase letter</span><br />
            <span className='text-light small' id='passNumberSpan' style={{ display: showNum ? "inline" : "none" }}>* Please include at least 1 number</span><br />
            <span className='text-light small' id='passSpecialSpan' style={{ display: showSpecial ? "inline" : "none" }}>* Please include at least 1 special character</span><br />
        </Tooltip>
    )

    const onPasswordChange = (event) => {
        const validSpan = document.getElementById('passValidSpan');
        setShowPassValid(false);

        var pass = event.target.value;

        const upperCheck = /[A-Z]/g
        const lowerCheck = /[a-z]/g
        const numCheck = /[0-9]/g
        const specialCheck = /[!@#$%^&*]/g
        const allCheck =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,100}$/;

        if (pass.length < 8) {
            setShowCount(true);
            setPassValid(false);
            setShow(true);
        }
        else
            setShowCount(false);

        if (!pass.match(upperCheck)) {
            setShowUpper(true);
            setPassValid(false);
            setShow(true);
        }
        else
            setShowUpper(false);

        if (!pass.match(lowerCheck)) {
            setShowLower(true);
            setPassValid(false);
            setShow(true);
        }
        else
            setShowLower(false);

        if (!pass.match(numCheck)) {
            setShowNum(true);
            setPassValid(false);
            setShow(true);
        }
        else
            setShowNum(false);        

        if (!pass.match(specialCheck)) {
            setShowSpecial(true);
            setPassValid(false);
            setShow(true);
        }
        else
            setShowSpecial(false);   

        if (pass.match(allCheck)) {
            setPassValid(true);
            setShow(false);
        }

        setPassword(pass);

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
                                <Card className='shadow border-5 m-3 p-2'>
                                    <Card.Title>Stats:</Card.Title>
                                    <Card.Text className='h2'>Posts: {postNumber}</Card.Text>
                                    <Card.Text className='h2'>Replies: {replyNumber}</Card.Text>
                                </Card>
                            </Col>
                        {userId == JSON.parse(localStorage.getItem('user_data')).id &&
                            <Col>
                                <Card className='shadow border-5 m-3'>
                                    <Form className='m-3'>
                                        <Form.Group className='mb-3' controlId='usernameForm'>
                                            <Form.Label>Username:</Form.Label>
                                            <Form.Control type='text' onChange={onUsernameChange} value={username} disabled={ userId == JSON.parse(localStorage.getItem('user_data')).id ? false : true }></Form.Control>
                                            <Form.Text className='text-light' style={{ display: "block" }}>{usernameMessage}</Form.Text>
                                            <Button onClick={updateUsername} variant={`primary-${stance}`} style={{ display: (userId == JSON.parse(localStorage.getItem('user_data')).id ? "block" : "none") }}>Change Username</Button>
                                        </Form.Group>
                                        <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={passToolTip} show={show}>
                                        <Form.Group className='mb-3' controlId='passwordForm'>
                                            <Form.Label>Password:</Form.Label>
                                            <Form.Control type='text' onChange={onPasswordChange}></Form.Control>
                                            <Form.Text className='text-light' style={{ display: "block" }}>{passwordMessage}</Form.Text>
                                            <Button onClick={changePass} variant={`primary-${stance}`}>Change Password</Button>
                                        </Form.Group>
                                        </OverlayTrigger>
                                        <Form.Group className='mb-3' controlId='emailForm'>
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type='text' onChange={onEmailChange} value={email} disabled={ userId == JSON.parse(localStorage.getItem('user_data')).id ? false : true }></Form.Control>
                                            <Form.Text className='text-light'>{emailMessage}</Form.Text>
                                            <Button onClick={updateEmail} variant={`primary-${stance}`} style={{ display: (userId == JSON.parse(localStorage.getItem('user_data')).id ? "block" : "none") }}>Change Email</Button>
                                        </Form.Group>
                                    </Form>
                                </Card>
                            </Col>
                        }
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
