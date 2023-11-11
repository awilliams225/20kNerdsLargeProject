import React, { useState } from 'react';

export default function Login() {

    var loginName;
    var loginPassword;

    const [message, setMessage] = useState('');

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

        var obj = { login: loginName.value, password: loginPassword.value };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/login'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user = { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));
                console.log(JSON.stringify(user));
                console.log(JSON.parse(JSON.stringify(user)));

                setMessage('');
                window.location.href = '/home';
            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    return (
        <div id="LoginDiv" style={{
            backgroundColor: '#1A1A20', height: '50vh', width: '75%',
            borderRadius: '15px 0px 0px 15px', textAlign: 'center',
            padding: '5vh', marginLeft: 'auto', marginRight: 0, marginTop: '10vh'
        }}>
            <form onSubmit={doLogin} style={{}}>
                <h2 style={{ color: '#FFFFFF' }}>Login</h2>
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
}
