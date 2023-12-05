import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Eye, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function ChangePasswordForm() {

    const { token } = useParams();

    const [userId, setId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPass, setShowPass] = useState(false);

    const [showCount, setShowCount] = useState(false);
    const [showUpper, setShowUpper] = useState(false);
    const [showLower, setShowLower] = useState(false);
    const [showNum, setShowNum] = useState(false);
    const [showSpecial, setShowSpecial] = useState(false);
    const [showPassValid, setShowPassValid] = useState(false);
    const [passValid, setPassValid] = useState(false);
    const [show, setShow] = useState(false);

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

            const response = await fetch(buildPath("api/grabUserByPassRequest"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            if (response.status === 200) {
                const json = await response.json();

                setId(json.userId);
            }
            else {
                console.log(response);
            }
        }

        grabUser();

    })

    async function changePass() {

        if (!passValid)
        {
            setShowPassValid(true);
            return;
        }

        var obj = { userId: userId, newPassword: password };
        var js = JSON.stringify(obj);

        const response = await fetch(buildPath("api/changePassword"), { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
            setMessage("Password changed successfully!");
        }
        else {
            setMessage("Unable to change password.");
        }
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
            changePass();
        }
    }

    const showPassClick = (event) => {
        setShowPass((prev) => !prev);
    }

    return (
        <>
            <Container>
                <Row className='justify-content-center pt-5'>
                    <Card bg='dark' data-bs-theme="dark" style={{ width: '24rem', height: '14rem' }} className='p-3'>
                        <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={passToolTip} show={show}>
                        <Form className='text-center' onKeyUp={handleKeyPress}>
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
                        </OverlayTrigger>
                    </Card>
                </Row>
            </Container>
        </>
    )
}