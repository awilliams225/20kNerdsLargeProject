import React from 'react';

import EmailVerified from '../components/EmailVerified';

const EmailRegisteredPage = () => {
    return (
        <div style={{backgroundColor: '#FFFFFF', height: '100vh', width: '100vw'}} className='d-flex flex-column justify-content-center align-items-center'>
            <div>
                <EmailVerified />
            </div>
        </div>
    )
}

export default EmailRegisteredPage;