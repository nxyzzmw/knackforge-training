import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import users from '../../data/users.json';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Footer from '../../components/layout/Footer';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const user = users.find(
      (u) => u.email === email && u.status === 'Active'
    );

    if (!user) {
      setError('Invalid or inactive user');
      return;
    }

    setError('');
    login(user);
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <div className="login-brand">
          <img className="login-logo" src="/vite.svg" alt="Logo" />
          <span className="login-brand-text">ADMIN PORTAL</span>
        </div>
        <button
          className="login-theme-toggle"
          type="button"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </button>
      </div>

      <div className="login-card">
        <h4 className="login-title">Login</h4>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>Login</button>
      </div>
      <div className="login-footer">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
