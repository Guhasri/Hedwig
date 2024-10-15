// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import DraftsList from './components/DraftsList';
import StarredEmails from './components/StarredEmails';
import BinEmails from './components/BinEmails'; // Import the BinEmails component
import AllMails from './components/AllMails';
import LoginRegister from './components/LoginRegister'; // Import AllMails component
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route
          path="/app"
          element={
            <div className={`app ${isDarkTheme ? 'dark-theme' : ''}`}>
              <Header toggleSidebar={toggleSidebar} onToggleTheme={toggleTheme} />
              <div className="app__body">
                {isSidebarOpen && <Sidebar />}
                <MainContent /> {/* MainContent will handle the inbox */}
              </div>
            </div>
          }
        />
        <Route
          path="/drafts"
          element={
            <div className={`app ${isDarkTheme ? 'dark-theme' : ''}`}>
              <Header toggleSidebar={toggleSidebar} onToggleTheme={toggleTheme} />
              <div className="app__body">
                {isSidebarOpen && <Sidebar />}
                <DraftsList /> {/* DraftsList will handle drafts */}
              </div>
            </div>
          }
        />
        <Route
          path="/starred"
          element={
            <div className={`app ${isDarkTheme ? 'dark-theme' : ''}`}>
              <Header toggleSidebar={toggleSidebar} onToggleTheme={toggleTheme} />
              <div className="app__body">
                {isSidebarOpen && <Sidebar />}
                <StarredEmails /> {/* Component to display starred emails */}
              </div>
            </div>
          }
        />
        <Route
          path="/bin"
          element={
            <div className={`app ${isDarkTheme ? 'dark-theme' : ''}`}>
              <Header toggleSidebar={toggleSidebar} onToggleTheme={toggleTheme} />
              <div className="app__body">
                {isSidebarOpen && <Sidebar />}
                <BinEmails /> {/* Component to display bin emails */}
              </div>
            </div>
          }
        />
        <Route
          path="/all-mails" // Route for All Mails
          element={
            <div className={`app ${isDarkTheme ? 'dark-theme' : ''}`}>
              <Header toggleSidebar={toggleSidebar} onToggleTheme={toggleTheme} />
              <div className="app__body">
                {isSidebarOpen && <Sidebar />}
                <AllMails /> {/* Component to display all mails */}
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
