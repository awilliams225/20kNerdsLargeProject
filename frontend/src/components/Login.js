import React, { useEffect, useState } from 'react';
import ForgotPasswordModal from '../components/ForgotPasswordModal'
import { Eye, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function Login() {

    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
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

        document.addEventListener("keydown", handleKeyPress);

        document.removeEventListener("keydown", handleKeyPress);

    }, [])

    const doLogin = async event => {
        event.preventDefault();

        if (username == '' && password == '')
        {
            setMessage('Please enter a username and password!');
            return;
        }

        var obj = { login: username, password: password };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/login'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.error != '') {
                setMessage(res.error);
            }
            else {
                var user = { firstName: res.firstName, lastName: res.lastName, id: res.id };
                localStorage.setItem('user_data', JSON.stringify(user));

                var tokenObj = { userId: res.id };
                var tokenJs = JSON.stringify(tokenObj);

                const tokenResponse = await fetch(buildPath('api/generateToken'),
                    { method: 'POST', body: tokenJs, headers: { 'Content-Type': 'application/json' } });
                
                var tokenRes = JSON.parse(await tokenResponse.text());

                var tokenData = { token: tokenRes.token };
                localStorage.setItem('token', JSON.stringify(tokenData));

                setMessage('');
                window.location.href = '/home/';
            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    const handleKeyPress = (event) => {
        if (event.key == 'Enter') {
            doLogin();
        }
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
       setPassword(event.target.value);
    }

    const showPassClick = (event) => {
        setShowPass((prev) => !prev);
    }

    return (
        <>
            <h2 className='h2 text-white'>Login</h2>
            <Form>
                <Form.Control type='username' placeholder='Username' onChange={handleUsernameChange} />
                <InputGroup className='mt-2'>
                    <Form.Control type={showPass ? 'text' : 'password'} placeholder='Password' onChange={handlePasswordChange} />
                    <InputGroup.Text onClick={showPassClick}>
                        { showPass ? <EyeSlashFill/> : <EyeFill /> }
                    </InputGroup.Text>
                </InputGroup>
                <Button className='mt-2' variant='primary' onClick={doLogin}>Login</Button>
            </Form>
            <ForgotPasswordModal /> <br />
            <span className='text-light' id="loginResult">{message}</span>
        </>
    );
}
