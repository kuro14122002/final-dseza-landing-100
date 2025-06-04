import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  const clearAuthData = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminUserToken');
  };

  const redirectToLogin = () => {
    clearAuthData();
    navigate('/admin/login', { replace: true });
  };

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    const adminToken = localStorage.getItem('adminUserToken');
    
    if (!adminUser || !adminToken) {
      // Redirect to login if not authenticated
      redirectToLogin();
      return;
    }

    try {
      const user = JSON.parse(adminUser);
      // Check if user data is valid
      if (!user.email || !user.loginTime) {
        redirectToLogin();
        return;
      }

      // Optional: Check if session is expired (e.g., 24 hours)
      const loginTime = new Date(user.loginTime);
      const now = new Date();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (now.getTime() - loginTime.getTime() > sessionDuration) {
        redirectToLogin();
        return;
      }

      // Optional: Validate JWT token with backend (uncomment if needed)
      // validateTokenWithBackend(adminToken);
    } catch (error) {
      // Invalid JSON in localStorage
      redirectToLogin();
      return;
    }
  }, [navigate]);

  // Optional function to validate token with backend
  const validateTokenWithBackend = async (token: string) => {
    try {
      const API_VALIDATE_URL = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost/api'}/v1/auth/validate.php`;
      
      const response = await fetch(API_VALIDATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        redirectToLogin();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      // Don't redirect on network errors, only on auth failures
    }
  };

  // Check authentication state
  const adminUser = localStorage.getItem('adminUser');
  const adminToken = localStorage.getItem('adminUserToken');
  
  if (!adminUser || !adminToken) {
    return null; // Will redirect via useEffect
  }

  try {
    const user = JSON.parse(adminUser);
    if (!user.email || !user.loginTime) {
      return null; // Will redirect via useEffect
    }
  } catch {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute; 