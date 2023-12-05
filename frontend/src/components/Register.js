import React, { useState, useRef } from 'react';
import { Eye, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ToolTip from 'react-bootstrap/ToolTip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export default function Register() {

    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState('');
    const [passValid, setPassValid] = useState(false);
    const [show, setShow] = useState(false);

    const [showCount, setShowCount] = useState(false);
    const [showUpper, setShowUpper] = useState(false);
    const [showLower, setShowLower] = useState(false);
    const [showNum, setShowNum] = useState(false);
    const [showSpecial, setShowSpecial] = useState(false);
    const [showPassValid, setShowPassValid] = useState(false);

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
            setShowPassValid(true);
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

    const handleKeyPress = (event) => {
        event.preventDefault();
        if (event.key == 'Enter') {
            doRegister();
        }
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

    return (
        <>
            <h2 className='h2'>Signup</h2>
            <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={passToolTip} show={show}>
            <Form onKeyUp={handleKeyPress}>
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
            </OverlayTrigger>
            <span id="registerResult">{message}</span>
            
        </>
    );
}
