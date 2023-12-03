import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Eye, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';

export default function ChangePasswordForm() {

    const [userId, setId] = useState('');
    const [newPass, setNewPass] = useState('');
    const [message, setMessage] = useState('');
    const [showPass, setShowPass] = useState(false);

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

    const showPassClick = (event) => {
        setShowPass((prev) => !prev);
    }

    const handlePasswordChange = (event) => {
        setNewPass(event.target.value);
    }

    return (
        <>
            <Container>
                <Row className='justify-content-center pt-5'>
                    <Card bg='dark' data-bs-theme="dark" style={{ width: '24rem', height: '14rem' }} className='p-3'>
                        <Form className='text-center'>
                            <InputGroup className='mt-3 mb-3'>
                                <Form.Control type={showPass ? 'text' : 'password'} placeholder='Password' onChange={handlePasswordChange} />
                                <InputGroup.Text onClick={showPassClick}>
                                    {showPass ? <EyeSlashFill /> : <EyeFill />}
                                </InputGroup.Text>
                            </InputGroup>
                            <Button variant='primary' onClick={changePass}>
                                Change Password
                            </Button>
                            <br /><a href={'/'}>Return to Login</a>
                            <br /><span>{message}</span>
                        </Form>
                    </Card>
                </Row>
            </Container>
        </>
    )
}