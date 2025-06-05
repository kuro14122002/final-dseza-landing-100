<?php
/**
 * Test Database Connection
 * Kiểm tra kết nối database và cấu hình
 */

// Bật hiển thị lỗi
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🔍 Database Connection Test</h1>";

// Test 1: Kiểm tra config file
echo "<h2>📋 Test 1: Config File</h2>";
$configPath = __DIR__ . '/config/database.php';
if (file_exists($configPath)) {
    echo "✅ Config file exists: $configPath<br>";
    $config = require $configPath;
    echo "<strong>Database Config:</strong><br>";
    echo "<pre>";
    print_r([
        'host' => $config['host'],
        'port' => $config['port'],
        'database' => $config['database'],
        'username' => $config['username'],
        'password' => str_repeat('*', strlen($config['password'])) // Hide password
    ]);
    echo "</pre>";
} else {
    echo "❌ Config file not found: $configPath<br>";
    exit;
}

// Test 2: Test basic MySQL connection
echo "<h2>🔌 Test 2: Basic MySQL Connection</h2>";
try {
    $dsn = "mysql:host={$config['host']};port={$config['port']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password']);
    echo "✅ Basic MySQL connection successful<br>";
    
    // Test 3: Check if database exists
    echo "<h2>🗄️ Test 3: Database Existence</h2>";
    $stmt = $pdo->prepare("SHOW DATABASES LIKE ?");
    $stmt->execute([$config['database']]);
    $dbExists = $stmt->fetch();
    
    if ($dbExists) {
        echo "✅ Database '{$config['database']}' exists<br>";
        
        // Test 4: Connect to specific database
        echo "<h2>🔗 Test 4: Database Connection</h2>";
        $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
        $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
        echo "✅ Connected to database '{$config['database']}'<br>";
        
        // Test 5: Check tables
        echo "<h2>📊 Test 5: Database Tables</h2>";
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (empty($tables)) {
            echo "⚠️ No tables found in database<br>";
            echo "<p><strong>Suggestion:</strong> Run the database setup SQL file to create tables.</p>";
        } else {
            echo "✅ Found " . count($tables) . " tables:<br>";
            echo "<ul>";
            foreach ($tables as $table) {
                echo "<li>$table</li>";
            }
            echo "</ul>";
            
            // Test 6: Check users table specifically
            if (in_array('users_admin', $tables)) {
                echo "<h2>👥 Test 6: Users Admin Table</h2>";
                $stmt = $pdo->query("SELECT COUNT(*) as count FROM users_admin");
                $result = $stmt->fetch();
                echo "✅ Users table has {$result['count']} records<br>";
                
                if ($result['count'] > 0) {
                    $stmt = $pdo->query("SELECT id, email, role, is_active FROM users_admin LIMIT 5");
                    $users = $stmt->fetchAll();
                    echo "<strong>Sample users:</strong><br>";
                    echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
                    echo "<tr><th>ID</th><th>Email</th><th>Role</th><th>Active</th></tr>";
                    foreach ($users as $user) {
                        echo "<tr>";
                        echo "<td>{$user['id']}</td>";
                        echo "<td>{$user['email']}</td>";
                        echo "<td>{$user['role']}</td>";
                        echo "<td>" . ($user['is_active'] ? 'Yes' : 'No') . "</td>";
                        echo "</tr>";
                    }
                    echo "</table>";
                }
            } else {
                echo "❌ Users Admin table (users_admin) not found<br>";
            }
        }
        
    } else {
        echo "❌ Database '{$config['database']}' does not exist<br>";
        echo "<p><strong>Solution:</strong> Create the database first:</p>";
        echo "<pre>CREATE DATABASE {$config['database']} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;</pre>";
    }
    
} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "<br>";
    echo "<p><strong>Common solutions:</strong></p>";
    echo "<ul>";
    echo "<li>Make sure XAMPP MySQL is running</li>";
    echo "<li>Check username and password in config</li>";
    echo "<li>Verify database name is correct</li>";
    echo "<li>Check if user has proper permissions</li>";
    echo "</ul>";
}

// Test 7: Test Database class
echo "<h2>🏗️ Test 7: Database Class</h2>";
try {
    require_once __DIR__ . '/core/Database.php';
    $db = Database::getInstance();
    echo "✅ Database class loaded successfully<br>";
    
    $connection = $db->getConnection();
    echo "✅ Database connection through class successful<br>";
    
} catch (Exception $e) {
    echo "❌ Database class error: " . $e->getMessage() . "<br>";
}

echo "<h2>📝 Summary</h2>";
echo "<p>Database test completed. Check results above for any issues.</p>";
?> 