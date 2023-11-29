import React from 'react';

import EmailVerified from '../components/EmailVerified';
import Container from 'react-bootstrap/esm/Container';

const EmailRegisteredPage = () => {
    return (
        <div style={{ height: '100vh', width: '100vw'}}>
            <div style={{
                backgroundColor: '#FFFFFF',
                height: '100vh', width: '50vw', float: 'right'
            }}>
                <h1 style={{ color: '#4BBCD5' }}>
                    R FLIGHT</h1>
            </div>
            <div style={{ position: 'absolute', top: '25%', left: '36%' }}>
                <EmailVerified />
            </div>
            <div style={{
                backgroundColor: '#FF0000',
                height: '100vh', width: '50vw', float: 'left'
            }}>
                <h1 style={{ textAlign: 'right', color: '#FFFFFF' }}>
                    FIGHT O</h1>
            </div>
        </div>
    )
}

export default EmailRegisteredPage;