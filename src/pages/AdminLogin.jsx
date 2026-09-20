import React, { useState } from 'react';
import { loginAdmin } from '../services/adminService';
import './AdminLogin.css';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginAdmin(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="page admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="admin-login-badge">✦ Authorized Access Only ✦</span>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">
            Sign in with your JYC Technical club admin credentials to manage events, lectures, and community doubts.
          </p>
        </div>

        {error && (
          <div className="admin-login-error">{error}</div>
        )}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-login-group">
            <label className="admin-login-label" htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              className="admin-login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@jyc.ac.in"
              required
              autoComplete="email"
            />
          </div>

          <div className="admin-login-group">
            <label className="admin-login-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="admin-login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-dim)',
          margin: 0
        }}>
          This portal is restricted to designated club leads and coordinators.
        </p>
      </div>
    </div>
  );
}
