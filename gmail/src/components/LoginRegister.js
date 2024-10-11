import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css'; // Import your CSS file

const LoginRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(''); // Clear previous errors
    setLoading(true); // Show loading state
    try {
      console.log('Logging in with:', { emailId: email, password: password });
      const response = await axios.post('http://localhost:1973/api/auth/login', {
        emailId: email,
        password: password,
      });

      // Handle successful login
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/app', { state: { email: response.data.user.emailId } });
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred'); // Display error message
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="login-register-container">
      <div className="form-wrapper">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Loading...</div>}
        <div className="form">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit-btn" onClick={handleLogin}>Login</button>
          <div className="toggle-message">
            Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
