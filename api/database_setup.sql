-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS dseza_investment_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dseza_investment_hub;

-- Create users_admin table
DROP TABLE IF EXISTS users_admin;

CREATE TABLE users_admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Editor') NOT NULL DEFAULT 'Editor',
    full_name VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample admin users for testing
-- Password for all test accounts: "password123"
-- Hash generated using PHP: password_hash("password123", PASSWORD_BCRYPT)

INSERT INTO users_admin (email, password_hash, role, full_name, is_active) VALUES
('admin@dseza.gov.vn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'System Administrator', 1),
('editor@dseza.gov.vn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Editor', 'Content Editor', 1),
('manager@dseza.gov.vn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Project Manager', 1),
('test.editor@dseza.gov.vn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Editor', 'Test Editor Account', 1),
('inactive.user@dseza.gov.vn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Editor', 'Inactive User', 0);

-- Display created users
SELECT 
    id,
    email,
    role,
    full_name,
    is_active,
    created_at
FROM users_admin
ORDER BY id;

-- Test queries
SELECT 'Total users created:' as info, COUNT(*) as count FROM users_admin;
SELECT 'Active users:' as info, COUNT(*) as count FROM users_admin WHERE is_active = 1;
SELECT 'Admin users:' as info, COUNT(*) as count FROM users_admin WHERE role = 'Admin';
SELECT 'Editor users:' as info, COUNT(*) as count FROM users_admin WHERE role = 'Editor'; 