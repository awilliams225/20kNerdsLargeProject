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

            obj = { userId: json.id, email: email};
            js = JSON.stringify(obj);

            const forgResponse = await fetch(buildPath("api/forgotPassword"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (forgResponse.status === 201) {
                const emailJson = JSON.parse(await forgResponse.text());
                setText('An email has been sent!');
            }
            else {
                setText('This email is invalid!');
            }
        }
        else {
            console.log(response);
        }
    }


    return (
        <>
        <Button className='mt-2' variant='outline-secondary' onClick={handleShow}>
            Forgot Password?
        </Button>
        <Modal show={show} onHide={handleClose} data-bs-theme="dark">
                <Card bg="dark">
                    <Card.Header>Forgot your password?</Card.Header>
                    <Card.Body className='text-center'>
                        <Form className="m-3">
                            <Form.Group className='mb-5' controlId='formEmail'>
                                <Form.Label>Please Enter Your Email</Form.Label>
                                <Form.Control name='email' type='email' placeholder='Enter your email...' onChange={handleChange}/>
                            </Form.Group>
                            <span id='forgPassSpan'>{ spanText }</span>
                        </Form>
                        <Button variant="primary" onClick={handleClick}>Send Email</Button>
                        <Button variant="danger" className='ms-2' onClick={handleClose}>Close</Button>
                    </Card.Body>
                </Card>
            </Modal>
        </>
    )
}