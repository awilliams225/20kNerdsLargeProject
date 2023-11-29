import React from 'react';
import "bootstrap/dist/css/bootstrap.css"

import LoginTitle from '../components/LoginTitle';
import LoginBox from '../components/LoginBox';

const LoginPage = () => {
    return (
        <div style={{
            backgroundSize: "cover",
            backgroundImage:`url(${require('../images/background.png')})`, 
            width:"100%", 
            height:"100vh", 
            backgroundPosition: "center",
            backgroundRepeat: "repeat-y"
            }}>
            <LoginTitle />
            <LoginBox />
        </div>
    );
}

export default LoginPage;
