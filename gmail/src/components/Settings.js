import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ isVisible, onToggleTheme, isDarkTheme }) => {
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log('Change Password:', { oldPassword, newPassword, confirmPassword });
    // Reset fields after submission
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordModalVisible(false);
  };

  if (!isVisible) return null;

  const themeClass = isDarkTheme ? 'dark-theme' : '';

  return (
    <div className={`settings ${themeClass}`}>
      <div className="settings-options">
        <button 
          className="settings-button"
          onClick={() => setChangePasswordModalVisible(true)}
        >
          Change Password
        </button>
        <button 
          className="settings-button"
          onClick={onToggleTheme}
        >
          Switch Theme
        </button>
      </div>

      {isChangePasswordModalVisible && (
        <div className={`modal-overlay ${themeClass}`}>
          <div className="modal-content">
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label htmlFor="old-password">Old Password</label>
                <input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setChangePasswordModalVisible(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;