import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  // Simple auth check - you can improve this later
  const isAuthenticated = localStorage.getItem('admin_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Temporary simple sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-4">
            <div className="px-4 py-2">
              <a href="/admin/dashboard" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
                Dashboard
              </a>
              <a href="/admin/news" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
                News
              </a>
              <a href="/admin/documents" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
                Documents
              </a>
            </div>
          </nav>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          {/* Temporary simple header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
            </div>
          </header>
          
          {/* Page content */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 