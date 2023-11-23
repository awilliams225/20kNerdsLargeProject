import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import ReplyPage from './pages/ReplyPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import QuestionPage from './pages/QuestionPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import EmailRegisteredPage from './pages/EmailRegisteredPage';
import ProfileMainPage from './pages/ProfileMainPage';
import ProfilePostPage from './pages/ProfilePostPage';
import ProfileReplyPage from './pages/ProfileReplyPage';
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

            const userData = localStorage.getItem('user_data');
            if (!userData) {
                setAppLoading(false);
                return;
            }
            const userId = JSON.parse(userData).id;
    
            var obj = { userId: userId };
            var js = JSON.stringify(obj);

            try {
                const response = await fetch(buildPath('api/validateToken'), { method: 'POST', body: js, headers: {'twentythousand_header_key': tokenJs.token, 'Content-Type': 'application/json'} })

                if (response.status === 401) {
                    console.log("An error occurred while validating your user");
                } else if (response.status !== 200) {
                    console.log("An unknown error occurred while validating your login");
                } else {
                    setIsValidated(true);
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
            document.body.style.backgroundColor = "#f07841";
            return (
                <div data-bs-theme="fight">
                    {element}
                </div>
            );
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
                        <Route path="/user/:userId/" element={protectElement(<ProfileMainPage />)} />
                        <Route path="/user/:userId/posts/:page?/" element={protectElement(<ProfilePostPage />)} />
                        <Route path="/user/:userId/replies/:page?/" element={protectElement(<ProfileReplyPage />)} />
                        <Route path="/changepassword/:token" element={<ChangePasswordPage />} />
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
