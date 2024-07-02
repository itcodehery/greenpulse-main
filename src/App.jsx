import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import PublishPage from './PublishPage';
import PostPage from './PostPage';
import DonationPage from './DonationPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/publish" element={<PublishPage />} />
        <Route path="/post/:author/:permlink" element={<PostPage />} />
        <Route path="/donate" element={<DonationPage />} />
        {/* Additional routes can be added here in the future */}
      </Routes>
    </Router>
  );
}

export default App;