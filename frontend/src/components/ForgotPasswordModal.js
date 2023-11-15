import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function ForgotPasswordModal() {

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [spanText, setText] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const handleChange = (event) => {
        setEmail(event.target.value);
    }

    const handleClick = async () => {
        var obj = { email: email }
        var js = JSON.stringify(obj);

        const response = await fetch(buildPath("api/getUserByEmail"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
            const json = await response.json();

            console.log(json.id);

            obj = { userId: json.id, email: email};
            js = JSON.stringify(obj);

            const forgResponse = await fetch(buildPath("api/forgotPassword"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (forgResponse.status === 200) {
                setText("You've been sent an email!");
            }
            else {
                console.log(forgResponse);
            }
        }
        else {
            console.log(response);
        }
    }


    return (
        <>
        <Button onClick={handleShow}>
            Forgot Password
        </Button>
        <Modal show={show} data-bs-theme="dark">
                <Card bg="dark">
                    <Card.Header>Forgot your password?</Card.Header>
                    <Card.Body>
                        <Form className="m-3">
                            <Form.Group className='mb-5' controlId='formEmail'>
                                <Form.Label>Please Enter Your Email</Form.Label>
                                <Form.Control name='email' type='email' placeholder='Enter your email...' onChange={handleChange}/>
                            </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={handleClick}>Send Email</Button>
                        <span id='forgPassSpan'>{ spanText }</span>
                    </Card.Body>
                </Card>
            </Modal>
        </>
    )
}