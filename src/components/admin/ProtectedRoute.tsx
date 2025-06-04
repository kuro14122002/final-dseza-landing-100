import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    
    if (!adminUser) {
      // Redirect to login if not authenticated
      navigate('/admin/login', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(adminUser);
      // Check if user data is valid
      if (!user.email || !user.loginTime) {
        localStorage.removeItem('adminUser');
        navigate('/admin/login', { replace: true });
        return;
      }

      // Optional: Check if session is expired (e.g., 24 hours)
      const loginTime = new Date(user.loginTime);
      const now = new Date();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (now.getTime() - loginTime.getTime() > sessionDuration) {
        localStorage.removeItem('adminUser');
        navigate('/admin/login', { replace: true });
        return;
      }
    } catch (error) {
      // Invalid JSON in localStorage
      localStorage.removeItem('adminUser');
      navigate('/admin/login', { replace: true });
      return;
    }
  }, [navigate]);

  // Check authentication state
  const adminUser = localStorage.getItem('adminUser');
  if (!adminUser) {
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