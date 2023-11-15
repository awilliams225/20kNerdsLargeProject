import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import ReplyPage from './pages/ReplyPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import QuestionPage from './pages/QuestionPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import EmailRegisteredPage from './pages/EmailRegisteredPage';
import Spinner from 'react-bootstrap/Spinner';

function App() {

    const [isValidated, setIsValidated] = useState(false);
    const [appLoading, setAppLoading] = useState(true);

    const app_name = 'fight-or-flight-20k-5991cb1c14ef'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    useEffect(() => {
        const setValidation = async () => {
            setAppLoading(true);

            const token = localStorage.getItem('token');
            if (!token) {
                setAppLoading(false);
                return;
            }
            const tokenJs = JSON.parse(token);

            try {
                const response = await fetch(buildPath('api/validateToken'), { method: 'GET', headers: {'twentythousand_header_key': tokenJs.token} })

                if (response != null) {
                    const json = await response.json();
                    
                    setIsValidated(true);
                }
                else {
                    console.log("Response is null");
                }
            } catch(e) {
                alert(e.toString());
            }

            setAppLoading(false);
        }

        setValidation();
    }, []);

    const protectElement = (element) => {
        if (isValidated) {
            return element;
        } else {
            return (<Navigate to="/" />);
        }
    }

    const handleLoginPage = () => {
        if (!isValidated) {
            return <LoginPage />;
        } else {
            return (<Navigate to="/home/" />);
        }
    }

    const loadApp = () => {
        if (appLoading) {
            return <Spinner animation="border" />;
        } else {
            return (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={handleLoginPage()} />
                        <Route path="/cards/" element={protectElement(<CardPage />)} />
                        <Route path="/home/:page?/" element={protectElement(<QuestionPage />)} />
                        <Route path="/question/:questionSlug/:page?/" element={protectElement(<PostPage />)} />
                        <Route path="/question/:questionSlug/post/:slug/" element={protectElement(<ReplyPage />)} />
                        <Route path="/changepassword/:token" element={protectElement(<ChangePasswordPage />)} />
                        <Route path="/emailverified/:token" element={<EmailRegisteredPage />} />
                    </Routes>
                </BrowserRouter>
            )
        }
    }

    return (
        <>
            {loadApp()}
        </>
    );
}

export default App;
