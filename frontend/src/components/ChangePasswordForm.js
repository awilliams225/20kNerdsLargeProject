import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

export default function ChangePasswordForm() {

    const [userId, setId] = useState('');
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');

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

        const grabUser = async () => {
            var obj = { token: token };
            var js = JSON.stringify(obj);

            console.log(token);

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
        var obj = { userId: userId, oldPassword: oldPass, newPassword: newPass };
        var js = JSON.stringify(obj);

        console.log(newPass);

        const response = await fetch(buildPath("api/changePassword"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
            console.log("Password has been changed!");
        }
        else {
            console.log(response.text);
        }
    }

    return (
        <>
        <Form>
            <Form.Group controlId="passChange">
                <Form.Label className='mb-3'>Current Password</Form.Label>
                <Form.Control type='password' placeholder='Current Password' value={oldPass} onChange={ e => setOldPass(e.target.value) } />

                <Form.Label className='mb-3'>New Password</Form.Label>
                <Form.Control type='password' placeholder='New Password' value={newPass} onChange={ e => setNewPass(e.target.value) } />
            </Form.Group>
            <Button variant='primary' onClick={changePass}>
                Change Password
            </Button>
        </Form>
        </>
    )
}