import React, { useState } from 'react';

export default function Register() {

    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
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

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            }
            else {
                /*var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));
  
                setMessage('');
                window.location.href = '/cards';*/
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
        const allCheck =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

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
            console.log("Hello???");
            setPassValid(true);
        }

    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    return (
        <div id="RegisterDiv" style={{
            backgroundColor: '#4BBCD5', height: '50vh', width: '75%',
            borderRadius: '0px 15px 15px 0px', marginLeft: 0, marginTop: '10vh',
            textAlign: 'center', padding: '5vh'
        }}>
            <form onSubmit={doRegister} style={{}}>
                <h2 style={{ color: '#FFFFFF' }}>Sign Up</h2>
                <input type="text" id="registerName" placeholder="Username"
                    onChange={handleUsernameChange} /><br />
                <input type="email" id="registerEmail" placeholder="Email"
                    onChange={handleEmailChange} /><br />
                <input type="password" id="registerPassword" placeholder="Password"
                    onChange={handlePasswordChange} /><br />
                <input type="submit" id="lregisterButton" class="buttons" value="Create Account"
                    onClick={doRegister} /> <br/>
                <span className='text-light small' id='passValidSpan'></span><br />
                <span className='text-light small' id='passLengthSpan'></span><br />
                <span className='text-light small' id='passUpperSpan'></span><br />
                <span className='text-light small' id='passLowerSpan'></span><br />
                <span className='text-light small' id='passNumberSpan'></span><br />
                <span className='text-light small' id='passSpecialSpan'></span><br />
            </form>
            <span id="registerResult">{message}</span>
        </div>
    );
}
