import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { cn } from '@/lib/utils';

const AdminLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ProtectedRoute>
      <div className={cn(
        "min-h-screen flex",
        theme === 'dark' ? 'bg-dseza-dark-main-bg' : 'bg-slate-50'
      )}>
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <AdminHeader />
          
          {/* Page Content */}
          <main className={cn(
            "flex-1 p-6",
            theme === 'dark' ? 'bg-dseza-dark-main-bg' : 'bg-slate-50'
          )}>
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout; 