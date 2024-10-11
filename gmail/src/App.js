import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import LoginRegister from './components/LoginRegister';
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
                <MainContent />
              </div>
            </div>
          }
        />
        {/* Redirect to login if no route matches */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;