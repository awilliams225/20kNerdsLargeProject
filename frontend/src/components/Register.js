//import React from 'react';
import React, { useState } from 'react';

function Login() {
    var loginName;
    var loginPassword;

    const [message, setMessage] = useState('');

    const doLogin = async event => {
        event.preventDefault();
        //alert('doIt() ' + loginName.value + ' ' + loginPassword.value);

        var obj = { login: loginName.value, password: loginPassword.value };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch('http://localhost:5001/api/login',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user = { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/cards';
            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    return (
        <div id="LoginDiv" style={{backgroundColor: '#4BBCD5', height: '50vh', width: '75%',
           borderRadius: '0px 15px 15px 0px', margin: '10vh 0px'}}>
            <form onSubmit={doLogin} style={{marginTop: '40px'}}>
                <span id="inner-title" style={{color: '#FFFFFF', marginTop: '20px'}}>Sign Up</span><br />
                <input type="text" id="loginName" placeholder="Username"
                    ref={(c) => loginName = c} /><br />
                <input type="password" id="loginPassword" placeholder="Password"
                    ref={(c) => loginPassword = c} /><br />
                <input type="submit" id="loginButton" class="buttons" value="Do It"
                    onClick={doLogin} />
            </form>
            <span id="loginResult">{message}</span>
        </div>
    );
};

export default Login;
