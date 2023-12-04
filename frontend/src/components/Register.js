import React, { useState, useRef } from 'react';
import { Eye, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function Register() {

    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState('');
    const [passValid, setPassValid] = useState(false);

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const doRegister = async event => {
        event.preventDefault();

        const validSpan = document.getElementById('passValidSpan');

        if (!passValid)
        {
            validSpan.innerHTML = 'This password is invalid!';
            return;
        }

        var obj = {
            username: username, password: password,
            email: email
        };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/register'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.error != '') {
                setMessage(res.error);
            }
            else {
                var emailObj = { email: email, userId: res.userId };
                var emailJs = JSON.stringify(emailObj);

                const emailResponse = await fetch(buildPath('api/registerWithEmail'), { method: 'POST', body: emailJs, headers: { 'Content-Type': 'application/json' } });
                const emailJson = JSON.parse(await emailResponse.text());

                if (emailResponse.status === 201)
                {
                    setMessage('A registration email has been sent!');
                    localStorage.setItem('token', JSON.stringify(emailJson.token));
                }
                else
                {
                    console.log("Email didn't exist.");
                }
            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    const handlePasswordChange = (event) => {
        const validSpan = document.getElementById('passValidSpan');
        validSpan.innerHTML = '';

        var pass = event.target.value;

        const lengthSpan = document.getElementById('passLengthSpan');
        const upperSpan = document.getElementById('passUpperSpan');
        const lowerSpan = document.getElementById('passLowerSpan');
        const numSpan = document.getElementById('passNumberSpan');
        const specialSpan = document.getElementById('passSpecialSpan');

        const upperCheck = /[A-Z]/g
        const lowerCheck = /[a-z]/g
        const numCheck = /[0-9]/g
        const specialCheck = /[!@#$%^&*]/g
        const allCheck =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,100}$/;

        if (pass.length < 8) {
            lengthSpan.innerHTML = '* Please make password 8 characters or more';
            setPassValid(false);
        }
        else
            lengthSpan.innerHTML = '';

        if (!pass.match(upperCheck)) {
            upperSpan.innerHTML = '* Please include at least 1 uppercase letter';
            setPassValid(false);
        }
        else
            upperSpan.innerHTML = '';

        if (!pass.match(lowerCheck)) {
            lowerSpan.innerHTML = '* Please include at least 1 lowercase letter';
            setPassValid(false);
        }
        else
            lowerSpan.innerHTML = '';

        if (!pass.match(numCheck)) {
            numSpan.innerHTML = '* Please include at least 1 number';
            setPassValid(false);
        }
        else
            numSpan.innerHTML = '';        

        if (!pass.match(specialCheck)) {
            specialSpan.innerHTML = '* Please include at least 1 special character';
            setPassValid(false);
        }
        else
            specialSpan.innerHTML = '';   

        if (pass.match(allCheck)) {
            setPassValid(true);
        }

        setPassword(pass);

    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const showPassClick = (event) => {
        setShowPass((prev) => !prev);
    }

    return (
        <>
            <h2 className='h2'>Signup</h2>
            <Form>
                <Form.Control type='username' placeholder='Username' onChange={handleUsernameChange}/>
                <InputGroup className='mt-2'>
                    <Form.Control type={showPass ? 'text' : 'password'} placeholder='Password' onChange={handlePasswordChange} />
                    <InputGroup.Text onClick={showPassClick}>
                        { showPass ? <EyeSlashFill/> : <EyeFill /> }
                    </InputGroup.Text>
                </InputGroup>
                <Form.Control className='mt-2' type='email' placeholder='Email' onChange={handleEmailChange}/>
                <Button className='mt-2' variant='primary' onClick={doRegister}>Register</Button>
            </Form>
            <span id="registerResult">{message}</span>
            <span className='text-light small' id='passValidSpan'></span><br />
            <span className='text-light small' id='passLengthSpan'></span><br />
            <span className='text-light small' id='passUpperSpan'></span><br />
            <span className='text-light small' id='passLowerSpan'></span><br />
            <span className='text-light small' id='passNumberSpan'></span><br />
            <span className='text-light small' id='passSpecialSpan'></span><br />
        </>
    );
}
