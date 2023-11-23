import React, { useState } from 'react';
import ForgotPasswordModal from '../components/ForgotPasswordModal'

export default function Login() {

    var loginName;
    var loginPassword;

    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
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

    const doLogin = async event => {
        event.preventDefault();

        const validSpan = document.getElementById('passValidSpan');

        if (!passValid)
        {
            validSpan.innerHTML = 'This password is invalid!';
            return;
        }

        var obj = { login: username, password: password };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/login'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
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

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
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

    return (
        <div id="LoginDiv" style={{
            backgroundColor: '#1A1A20', height: '50vh', width: '75%',
            borderRadius: '15px 0px 0px 15px', textAlign: 'center',
            padding: '5vh', marginLeft: 'auto', marginRight: 0, marginTop: '10vh'
        }}>
            <form onSubmit={doLogin} style={{}}>
                <h2 style={{ color: '#FFFFFF' }}>Login</h2>
                <input type="text" id="loginName" placeholder="Username"
                    onChange={handleUsernameChange} /><br />
                <input type="password" id="loginPassword" placeholder="Password"
                    onChange={handlePasswordChange} /><br />
                <input type="submit" id="loginButton" class="buttons" value="Do It"
                    onClick={doLogin} />
                <br />
                <ForgotPasswordModal />
                <span className='text-light small' id='passValidSpan'></span><br />
                <span className='text-light small' id='passLengthSpan'></span><br />
                <span className='text-light small' id='passUpperSpan'></span><br />
                <span className='text-light small' id='passLowerSpan'></span><br />
                <span className='text-light small' id='passNumberSpan'></span><br />
                <span className='text-light small' id='passSpecialSpan'></span><br />
            </form>
            <span id="loginResult">{message}</span>
        </div>
    );
}
