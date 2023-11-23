import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

export default function EmailVerified() {

    const [userId, setId] = useState('');

    const { token } = useParams();

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
            var obj = { token: token };
            var js = JSON.stringify(obj);

            console.log(token);

            const response = await fetch(buildPath("api/grabUserByEmailVerificationRequest"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                const json = await response.json();

                console.log(json.userId);

                obj = { userId: json.userId };
                js = JSON.stringify(obj);

                const regResponse = await fetch(buildPath("api/makeUserRegistered"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

                if (regResponse.status === 200) {
                    console.log("User is registered now!");
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

    })

    return (
        <>
        <Card bg='dark' data-bs-theme="dark" style={{ width: '24rem', height: '16rem' }}>
            <Card.Body>
                <Card.Title>You May Now Join The Fight!</Card.Title>
                <Card.Text>
                    Your email has now been verified!
                    Click the button below to be taken back
                    to our login page, and begin fighting!
                    ...or flighting!
                </Card.Text>
            </Card.Body>
            <Button variant='primary' href={buildPath('')}>
                Go To Login
            </Button>
        </Card>
        </>
    )
}