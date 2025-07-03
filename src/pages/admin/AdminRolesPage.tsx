import React from 'react';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import RoleCards from '@/views/apps/roles/RoleCards';

const AdminRolesPage: React.FC = () => {
  return (
    <AdminPageLayout
      title="Quản lý Vai trò"
      description="Quản lý các vai trò và quyền hạn trong hệ thống"
    >
      <RoleCards />
    </AdminPageLayout>
  );
};

export default AdminRolesPage; 