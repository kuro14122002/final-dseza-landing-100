<?php
// api/database_setup_roles.php
// Script to create roles table and insert default roles

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/config/database.php';

try {
    echo "Connecting to database...\n";
    $db = getDatabase();
    echo "✓ Database connection successful\n";
    
    echo "Creating roles table...\n";
    
    // Create roles table
    $createTableSQL = "
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
    ";
    
    $db->query($createTableSQL);
    echo "✓ Roles table created successfully\n";
    
    // Check if default roles exist
    echo "Checking existing roles...\n";
    $checkAdminSQL = "SELECT COUNT(*) as count FROM roles WHERE name = 'admin'";
    $stmt = $db->query($checkAdminSQL);
    $adminExists = $stmt->fetch()['count'] > 0;
    
    $checkEditorSQL = "SELECT COUNT(*) as count FROM roles WHERE name = 'editor'";
    $stmt = $db->query($checkEditorSQL);
    $editorExists = $stmt->fetch()['count'] > 0;
    
    // Insert default roles if they don't exist
    if (!$adminExists) {
        echo "Creating admin role...\n";
        $adminPermissions = json_encode([
            'users' => ['create', 'read', 'update', 'delete'],
            'roles' => ['create', 'read', 'update', 'delete'],
            'news' => ['create', 'read', 'update', 'delete', 'publish'],
            'events' => ['create', 'read', 'update', 'delete', 'publish'],
            'categories' => ['create', 'read', 'update', 'delete'],
            'media' => ['upload', 'read', 'update', 'delete'],
            'documents' => ['create', 'read', 'update', 'delete'],
            'translations' => ['create', 'read', 'update', 'delete'],
            'system' => ['read', 'update', 'backup', 'stats']
        ]);
        
        $insertAdminSQL = "INSERT INTO roles (name, permissions, description, is_active) VALUES (?, ?, ?, ?)";
        $db->query($insertAdminSQL, [
            'admin',
            $adminPermissions,
            'Administrator with full system access',
            1
        ]);
        echo "✓ Default admin role created\n";
    } else {
        echo "✓ Admin role already exists\n";
    }
    
    if (!$editorExists) {
        echo "Creating editor role...\n";
        $editorPermissions = json_encode([
            'news' => ['create', 'read', 'update'],
            'events' => ['create', 'read', 'update'],
            'categories' => ['read'],
            'media' => ['upload', 'read'],
            'documents' => ['create', 'read', 'update'],
            'translations' => ['read', 'update']
        ]);
        
        $insertEditorSQL = "INSERT INTO roles (name, permissions, description, is_active) VALUES (?, ?, ?, ?)";
        $db->query($insertEditorSQL, [
            'editor',
            $editorPermissions,
            'Content editor with limited access',
            1
        ]);
        echo "✓ Default editor role created\n";
    } else {
        echo "✓ Editor role already exists\n";
    }
    
    // Display current roles
    echo "\nCurrent roles in database:\n";
    $rolesSQL = "SELECT id, name, description, is_active FROM roles ORDER BY name";
    $stmt = $db->query($rolesSQL);
    $roles = $stmt->fetchAll();
    
    foreach ($roles as $role) {
        $status = $role['is_active'] ? 'Active' : 'Inactive';
        echo "- ID: {$role['id']}, Name: {$role['name']}, Status: {$status}\n";
        echo "  Description: {$role['description']}\n\n";
    }
    
    echo "Roles table setup completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error setting up roles table: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}
?> 