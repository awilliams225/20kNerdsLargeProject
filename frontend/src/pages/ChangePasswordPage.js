import React from 'react';

import ChangePasswordForm from '../components/ChangePasswordForm';

const ChangePasswordPage = () => {
    return (
        <div style={{
            backgroundSize: "cover",
            backgroundImage:`url(${require('../images/background.png')})`, 
            width:"100%", 
            height:"100vh", 
            backgroundPosition: "center",
            backgroundRepeat: "repeat-y"
            }}>
            <ChangePasswordForm />
        </div>
    )
}

export default ChangePasswordPage;