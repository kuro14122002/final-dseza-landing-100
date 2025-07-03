-- api/roles_setup.sql
-- SQL script to create roles table and insert default roles

-- Create roles table
CREATE TABLE IF NOT EXISTS `roles` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    `permissions` JSON DEFAULT NULL,
    `description` text DEFAULT NULL,
    `is_active` tinyint(1) DEFAULT 1,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`),
    KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin role
INSERT IGNORE INTO `roles` (`name`, `permissions`, `description`, `is_active`) VALUES 
(
    'admin',
    JSON_OBJECT(
        'users', JSON_ARRAY('create', 'read', 'update', 'delete'),
        'roles', JSON_ARRAY('create', 'read', 'update', 'delete'),
        'news', JSON_ARRAY('create', 'read', 'update', 'delete', 'publish'),
        'events', JSON_ARRAY('create', 'read', 'update', 'delete', 'publish'),
        'categories', JSON_ARRAY('create', 'read', 'update', 'delete'),
        'media', JSON_ARRAY('upload', 'read', 'update', 'delete'),
        'documents', JSON_ARRAY('create', 'read', 'update', 'delete'),
        'translations', JSON_ARRAY('create', 'read', 'update', 'delete'),
        'system', JSON_ARRAY('read', 'update', 'backup', 'stats')
    ),
    'Administrator with full system access',
    1
);

-- Insert default editor role
INSERT IGNORE INTO `roles` (`name`, `permissions`, `description`, `is_active`) VALUES 
(
    'editor',
    JSON_OBJECT(
        'news', JSON_ARRAY('create', 'read', 'update'),
        'events', JSON_ARRAY('create', 'read', 'update'),
        'categories', JSON_ARRAY('read'),
        'media', JSON_ARRAY('upload', 'read'),
        'documents', JSON_ARRAY('create', 'read', 'update'),
        'translations', JSON_ARRAY('read', 'update')
    ),
    'Content editor with limited access',
    1
);

-- Display created roles
SELECT id, name, description, is_active, created_at FROM roles ORDER BY name; 