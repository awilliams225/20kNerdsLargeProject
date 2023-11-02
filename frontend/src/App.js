import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import PostPage from './pages/PostPage';
import ForumPage from './pages/ForumPage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cards" element={<CardPage />} />
        <Route path="/question/:questionId" element={<ForumPage />}/>
        <Route path="/question/:questionId/post/:slug" element={<PostPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
