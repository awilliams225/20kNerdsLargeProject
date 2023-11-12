import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import PostPage from './pages/PostPage';
import ForumPage from './pages/ForumPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import QuestionPage from './pages/QuestionPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import EmailRegisteredPage from './pages/EmailRegisteredPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cards/" element={<CardPage />} />
        <Route path="/home/:page?/" element={<QuestionPage />}/>
        <Route path="/question/:questionSlug/:page?/" element={<ForumPage />}/>
        <Route path="/question/:questionSlug/post/:slug/:page?/" element={<PostPage />}/>
        <Route path="/changepassword/:token" element={<ChangePasswordPage/>} />
        <Route path="/emailverified/:token" element={<EmailRegisteredPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
