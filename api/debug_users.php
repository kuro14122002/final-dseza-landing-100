<?php
/**
 * Debug Users Script
 * Check and create test users for API testing
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🔍 Users Debug & Setup</h1>";

try {
    // Include required files
    require_once __DIR__ . '/core/Database.php';
    require_once __DIR__ . '/core/User.php';

    $database = Database::getInstance();
    $userModel = new User();

    echo "<h2>📋 Step 1: Check Users Table</h2>";
    
    // Check if users table exists
    $checkTableQuery = "SHOW TABLES LIKE 'users'";
    $result = $database->query($checkTableQuery);
    
    if ($result->rowCount() > 0) {
        echo "✅ Users table exists<br>";
        
        // Check current users
        $usersQuery = "SELECT id, email, role, is_active, created_at FROM users";
        $users = $database->fetchAll($usersQuery);
        
        echo "<h3>Current Users:</h3>";
        if (empty($users)) {
            echo "❌ No users found in database<br>";
        } else {
            echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
            echo "<tr><th>ID</th><th>Email</th><th>Role</th><th>Active</th><th>Created</th></tr>";
            foreach ($users as $user) {
                echo "<tr>";
                echo "<td>{$user['id']}</td>";
                echo "<td>{$user['email']}</td>";
                echo "<td>{$user['role']}</td>";
                echo "<td>" . ($user['is_active'] ? 'Yes' : 'No') . "</td>";
                echo "<td>{$user['created_at']}</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    } else {
        echo "❌ Users table does not exist<br>";
        echo "<p><strong>Action needed:</strong> Run database setup scripts first!</p>";
        exit;
    }

    echo "<h2>🔧 Step 2: Create Test Users</h2>";

    // Test users data
    $testUsers = [
        [
            'email' => 'admin@dseza.gov.vn',
            'password' => 'password123',
            'role' => 'admin',
            'full_name' => 'Administrator',
            'is_active' => 1
        ],
        [
            'email' => 'editor@dseza.gov.vn',
            'password' => 'password123',
            'role' => 'editor',
            'full_name' => 'Editor User',
            'is_active' => 1
        ],
        [
            'email' => 'inactive.user@dseza.gov.vn',
            'password' => 'password123',
            'role' => 'editor',
            'full_name' => 'Inactive User',
            'is_active' => 0
        ]
    ];

    foreach ($testUsers as $userData) {
        echo "<h3>Creating user: {$userData['email']}</h3>";
        
        // Check if user already exists
        $existingUser = $userModel->findByEmail($userData['email']);
        
        if ($existingUser) {
            echo "⚠️ User already exists. Updating password...<br>";
            
            // Update existing user
            $passwordHash = password_hash($userData['password'], PASSWORD_DEFAULT);
            $updateQuery = "UPDATE users SET password_hash = ?, role = ?, full_name = ?, is_active = ?, updated_at = NOW() WHERE email = ?";
            $database->execute($updateQuery, [
                $passwordHash,
                $userData['role'],
                $userData['full_name'],
                $userData['is_active'],
                $userData['email']
            ]);
            
            echo "✅ User updated successfully<br>";
        } else {
            echo "🆕 Creating new user...<br>";
            
            // Create new user
            $passwordHash = password_hash($userData['password'], PASSWORD_DEFAULT);
            $insertQuery = "INSERT INTO users (email, password_hash, role, full_name, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
            $database->execute($insertQuery, [
                $userData['email'],
                $passwordHash,
                $userData['role'],
                $userData['full_name'],
                $userData['is_active']
            ]);
            
            echo "✅ User created successfully<br>";
        }
    }

    echo "<h2>🧪 Step 3: Test Login Credentials</h2>";
    
    // Test login for each user
    foreach ($testUsers as $userData) {
        echo "<h3>Testing login: {$userData['email']}</h3>";
        
        $user = $userModel->findByEmail($userData['email']);
        
        if ($user) {
            $passwordCheck = password_verify($userData['password'], $user['password_hash']);
            $isActive = $userModel->isActive($user);
            
            echo "📧 Email: {$userData['email']}<br>";
            echo "🔒 Password check: " . ($passwordCheck ? "✅ PASS" : "❌ FAIL") . "<br>";
            echo "🟢 Active status: " . ($isActive ? "✅ ACTIVE" : "❌ INACTIVE") . "<br>";
            echo "👤 Role: {$user['role']}<br>";
            
            if ($passwordCheck && $isActive) {
                echo "🎉 <strong>Login should work!</strong><br>";
            } else {
                echo "❌ <strong>Login will fail</strong><br>";
            }
        } else {
            echo "❌ User not found in database<br>";
        }
        
        echo "<br>";
    }

    echo "<h2>✅ Step 4: Final Check</h2>";
    
    // Final users count
    $countQuery = "SELECT COUNT(*) as total FROM users WHERE is_active = 1";
    $countResult = $database->fetchOne($countQuery);
    
    echo "<p><strong>Total active users:</strong> {$countResult['total']}</p>";
    echo "<p><strong>Ready for API testing!</strong></p>";
    
    echo "<h3>🔗 Next Steps:</h3>";
    echo "<ul>";
    echo "<li><a href='comprehensive_api_test.php'>Run Comprehensive API Test</a></li>";
    echo "<li><a href='test_login_api.php'>Test Login API Only</a></li>";
    echo "<li><a href='cli_api_test.php'>CLI Test (run in terminal)</a></li>";
    echo "</ul>";

} catch (Exception $e) {
    echo "<h2>❌ Error</h2>";
    echo "<p><strong>Error message:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>File:</strong> " . $e->getFile() . "</p>";
    echo "<p><strong>Line:</strong> " . $e->getLine() . "</p>";
    
    echo "<h3>🔧 Troubleshooting:</h3>";
    echo "<ul>";
    echo "<li>Check if MySQL server is running</li>";
    echo "<li>Verify database credentials in config/database.php</li>";
    echo "<li>Run database setup scripts first</li>";
    echo "<li>Check PHP error logs</li>";
    echo "</ul>";
}
?> 