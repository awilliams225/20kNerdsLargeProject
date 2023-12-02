import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function EmailVerified() {

    const [userId, setId] = useState('');
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');

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

        const verifyUser = async () => {

            const token = localStorage.getItem('token');
            if (!token) {
                setTitle('Oops!');
                setText('It looks like your email has expired, or there was an error.');
                return;
            }
            const tokenJs = JSON.parse(token);

            var obj = { token: tokenJs };
            var js = JSON.stringify(obj);

            const response = await fetch(buildPath("api/grabUserByEmailVerificationRequest"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                const json = await response.json();

                obj = { userId: json.userId };
                js = JSON.stringify(obj);

                console.log(json.userId);

                const tokenResponse = await fetch(buildPath("api/validateToken"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json', 'twentythousand_header_key': tokenJs}});

                if (tokenResponse.status === 200) {
                    console.log("Token was validated!");
                }
                else {
                    setTitle('Oops!');
                    setText('It looks like your email has expired, or there was an error.');
                    return;
                }

                const regResponse = await fetch(buildPath("api/makeUserRegistered"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

                if (regResponse.status === 200) {
                    setTitle('You May Now Join The Fight!');
                    setText('Your email has now been verified! Click the button below to be taken back to our login page, and begin fighting! ...or flighting!')
                }
                else {
                    console.log(regResponse);
                }
            }
            else {
                console.log(response);
            }

        }

        verifyUser();

    }, [])

    return (
        <>
            <Container>
                <Row className='justify-content-center pt-5'>
                    <Card bg='dark' data-bs-theme="dark" style={{ width: '24rem', height: '16rem' }} className='p-3'>
                        <Card.Body>
                            <Card.Title>{title}</Card.Title>
                            <Card.Text>
                                {text}
                            </Card.Text>
                        </Card.Body>
                        <Button variant='primary' href='/'>
                            Go To Login
                        </Button>
                    </Card>
                </Row>
            </Container>
        </>
    )
}