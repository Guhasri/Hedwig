import React, { useState } from 'react';
import { FiMenu, FiSettings, FiUser } from 'react-icons/fi';
import UserInfo from './UserInfo';
import Settings from './Settings'; 
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, onToggleTheme }) => {
  const [isUserInfoVisible, setUserInfoVisible] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  const navigate = useNavigate();

  const handleUserClick = () => {
    setUserInfoVisible(!isUserInfoVisible);
  };

  const handleSettingsClick = () => {
    setSettingsVisible(!isSettingsVisible);
    setUserInfoVisible(false); 
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__left">
        <FiMenu className="header__menuIcon" onClick={toggleSidebar} />
        <img
          // src="https://png.pngtree.com/png-clipart/20230916/original/pngtree-google-email-icon-vector-png-image_12256704.png"
          src={require('../assets/Logo-removebg3.png')}
          alt="Smail"
          className="header__logo"
        />
      </div>
      <div className="header__center">
        <input type="text" placeholder="Search mail" className="header__search" />
      </div>
      <div className="header__right">
        <FiSettings className="header__icon" onClick={handleSettingsClick} />
        <FiUser className="header__icon" onClick={handleUserClick} />
        <UserInfo
          username="Jeevan" 
          email="Jeevan261122@gmail.com" 
          onLogout={handleLogout}
          isVisible={isUserInfoVisible}
        />
        <Settings isVisible={isSettingsVisible} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  );
};

export default Header;