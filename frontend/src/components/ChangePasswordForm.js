import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';

export default function ChangePasswordForm() {

    const [oldPass] = useState('');
    const [newPass] = useState('');
    const [username] = useState('');

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    async function changePass() {
        var obj = { username: oldPass, password: newPass };
        var js = JSON.stringify(obj);

        const response = await fetch(buildPath("api/changePassword"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
            console.log("Password hass been changed!");
        }
        else {
            console.log(response.text);
        }
    }

    return (
        <>
        <Form>
            <Form.Group controlId="passChange">
                <Form.Label classname='mb-3'>Username</Form.Label>
                <Form.Control type='username' placeholder='Username' value={username}></Form.Control>

                <Form.Label className='mb-3'>Current Password</Form.Label>
                <Form.Control type='password' placeholder='Current Password' value={oldPass} />

                <Form.Label className='mb-3'>New Password</Form.Label>
                <Form.Control type='password' placeholder='New Password' value={newPass} />
            </Form.Group>
            <Button variant='primary' onClick={changePass}>
                Change Password
            </Button>
        </Form>
        </>
    )
}