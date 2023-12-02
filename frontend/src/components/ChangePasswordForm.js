import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

export default function ChangePasswordForm() {

    const [userId, setId] = useState('');
    const [newPass, setNewPass] = useState('');
    const [message, setMessage] = useState('');

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

        const grabUser = async () => {
            var obj = { token: JSON.parse(localStorage.getItem('token')) };
            var js = JSON.stringify(obj);

            console.log(JSON.parse(localStorage.getItem('token')));

            const response = await fetch(buildPath("api/grabUserByPassRequest"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                const json = await response.json();

                console.log(json.userId);

                setId(json.userId);
            }
            else {
                console.log(response);
            }
        }

        grabUser();

    })

    async function changePass() {
        var obj = { userId: userId, newPassword: newPass };
        var js = JSON.stringify(obj);

        console.log(newPass);

        const response = await fetch(buildPath("api/changePassword"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
            setMessage("Password changed successfully!");
        }
        else {
            setMessage("Unable to change password.");
        }
    }

    return (
        <>
            <Container>
                <Row className='justify-content-center pt-5'>
                    <Card bg='dark' data-bs-theme="dark" style={{ width: '24rem', height: '14rem' }} className='p-3'>
                        <Form className='text-center'>
                            <Form.Group controlId="passChange">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control className='mb-3' type='password' placeholder='New Password' value={newPass} onChange={e => setNewPass(e.target.value)} />
                            </Form.Group>
                            <Button variant='primary' onClick={changePass}>
                                Change Password
                            </Button>
                            <br/><a href={'/'}>Return to Login</a>
                            <br/><span>{message}</span>
                        </Form>
                    </Card>
                </Row>
            </Container>
        </>
    )
}