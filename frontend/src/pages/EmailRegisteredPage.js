import React from 'react';

import EmailVerified from '../components/EmailVerified';
import Container from 'react-bootstrap/esm/Container';

const EmailRegisteredPage = () => {
    return (
        <div style={{
            backgroundSize: "cover",
            backgroundImage:`url(${require('../images/background.png')})`, 
            width:"100%", 
            height:"100vh", 
            backgroundPosition: "center",
            backgroundRepeat: "repeat-y"
            }}>
            <EmailVerified />
        </div>
    )
}

export default EmailRegisteredPage;