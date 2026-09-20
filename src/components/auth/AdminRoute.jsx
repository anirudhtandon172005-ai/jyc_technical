import React, { useEffect, useState } from 'react';
import { getAdminSession, logoutAdmin } from '../../services/adminService';
import AdminLogin from '../../pages/AdminLogin';

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const checkAuth = async () => {
    setLoading(true);
    const s = await getAdminSession();
    setSession(s);
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();

    // Auto-logout when leaving the admin page
    return () => {
      logoutAdmin();
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-accent)'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'var(--jyc-gold)',
          boxShadow: '0 0 20px var(--jyc-gold)',
          animation: 'pulseGlow 1s infinite alternate'
        }} />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLoginSuccess={checkAuth} />;
  }

  return children;
}
