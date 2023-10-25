import React from 'react';
import "bootstrap/dist/css/bootstrap.css"

import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import Register from '../components/Register';

const LoginPage = () => {
    return (
        <div>
            <div style={{
                backgroundColor: '#FFFFFF',
                height: '100vh', width: '50vw', float: 'right'
            }}>
                <h1 style={{color: '#4BBCD5'}}>
                    R FLIGHT</h1>
                <Register />
            </div>
            <div style={{
                backgroundColor: '#FF0000',
                height: '100vh', width: '50vw'
            }}>
                <h1 style={{float: 'right', color: '#FFFFFF'}}>
                    FIGHT O</h1>
                <Login />
            </div>
        </div>
    );
};

export default LoginPage;
