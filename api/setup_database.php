<?php
/**
 * Database Setup Script
 * Tự động tạo database và tables từ file SQL
 */

// Bật hiển thị lỗi
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🛠️ Database Setup</h1>";

// Đọc config
$config = require __DIR__ . '/config/database.php';

echo "<h2>📋 Configuration</h2>";
echo "<p><strong>Host:</strong> {$config['host']}</p>";
echo "<p><strong>Database:</strong> {$config['database']}</p>";
echo "<p><strong>Username:</strong> {$config['username']}</p>";

try {
    // Kết nối MySQL (không chỉ định database)
    echo "<h2>🔌 Connecting to MySQL...</h2>";
    $dsn = "mysql:host={$config['host']};port={$config['port']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Connected to MySQL server<br>";

    // Đọc và thực thi SQL file
    echo "<h2>📄 Reading SQL file...</h2>";
    $sqlFile = __DIR__ . '/database_setup.sql';
    
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: $sqlFile");
    }
    
    $sql = file_get_contents($sqlFile);
    echo "✅ SQL file loaded<br>";
    
    // Tách các câu lệnh SQL
    echo "<h2>⚡ Executing SQL commands...</h2>";
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^\s*--/', $stmt);
        }
    );
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($statements as $statement) {
        if (empty(trim($statement))) continue;
        
        try {
            $pdo->exec($statement);
            $successCount++;
            
            // Hiển thị thông tin về câu lệnh đã thực thi
            $firstWord = strtoupper(strtok(trim($statement), ' '));
            switch ($firstWord) {
                case 'CREATE':
                    if (strpos($statement, 'DATABASE') !== false) {
                        echo "✅ Database created<br>";
                    } elseif (strpos($statement, 'TABLE') !== false) {
                        preg_match('/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i', $statement, $matches);
                        $tableName = $matches[1] ?? 'unknown';
                        echo "✅ Table '$tableName' created<br>";
                    }
                    break;
                case 'INSERT':
                    preg_match('/INSERT INTO\s+(\w+)/i', $statement, $matches);
                    $tableName = $matches[1] ?? 'unknown';
                    echo "✅ Data inserted into '$tableName'<br>";
                    break;
                case 'USE':
                    preg_match('/USE\s+(\w+)/i', $statement, $matches);
                    $dbName = $matches[1] ?? 'unknown';
                    echo "✅ Using database '$dbName'<br>";
                    break;
                case 'DROP':
                    preg_match('/DROP TABLE\s+(?:IF EXISTS\s+)?(\w+)/i', $statement, $matches);
                    $tableName = $matches[1] ?? 'unknown';
                    echo "✅ Table '$tableName' dropped<br>";
                    break;
            }
            
        } catch (PDOException $e) {
            $errorCount++;
            echo "❌ Error executing statement: " . $e->getMessage() . "<br>";
            echo "<pre style='background: #ffe6e6; padding: 5px; font-size: 12px;'>" . 
                 htmlspecialchars(substr($statement, 0, 100)) . "...</pre>";
        }
    }
    
    echo "<h2>📊 Summary</h2>";
    echo "<p>✅ Successful statements: $successCount</p>";
    echo "<p>❌ Failed statements: $errorCount</p>";
    
    if ($errorCount === 0) {
        echo "<div style='background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
        echo "<h3>🎉 Database setup completed successfully!</h3>";
        echo "<p>You can now test the API endpoints.</p>";
        echo "</div>";
        
        // Kiểm tra dữ liệu đã tạo
        echo "<h2>👥 Verification: Check Users</h2>";
        try {
            $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
            $pdo = new PDO($dsn, $config['username'], $config['password']);
            
            $stmt = $pdo->query("SELECT id, email, role, full_name, is_active FROM users_admin ORDER BY id");
            $users = $stmt->fetchAll();
            
            echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
            echo "<tr style='background: #f0f0f0;'><th>ID</th><th>Email</th><th>Role</th><th>Full Name</th><th>Active</th></tr>";
            foreach ($users as $user) {
                $activeStatus = $user['is_active'] ? '✅ Yes' : '❌ No';
                echo "<tr>";
                echo "<td>{$user['id']}</td>";
                echo "<td>{$user['email']}</td>";
                echo "<td>{$user['role']}</td>";
                echo "<td>{$user['full_name']}</td>";
                echo "<td>$activeStatus</td>";
                echo "</tr>";
            }
            echo "</table>";
            
            echo "<h3>🔑 Test Credentials</h3>";
            echo "<p>You can use these credentials to test the login API:</p>";
            echo "<ul>";
            echo "<li><strong>Admin:</strong> admin@dseza.gov.vn / password123</li>";
            echo "<li><strong>Editor:</strong> editor@dseza.gov.vn / password123</li>";
            echo "<li><strong>Manager:</strong> manager@dseza.gov.vn / password123</li>";
            echo "</ul>";
            
        } catch (Exception $e) {
            echo "⚠️ Could not verify users: " . $e->getMessage();
        }
    }
    
} catch (Exception $e) {
    echo "<div style='background: #ffe6e6; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
    echo "<h3>❌ Setup Failed</h3>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "<p><strong>Common solutions:</strong></p>";
    echo "<ul>";
    echo "<li>Make sure XAMPP MySQL is running</li>";
    echo "<li>Check if MySQL root user has no password (default XAMPP setup)</li>";
    echo "<li>Verify the database name in config matches the SQL file</li>";
    echo "</ul>";
    echo "</div>";
}

echo "<h2>🔗 Next Steps</h2>";
echo "<p>After successful setup, you can:</p>";
echo "<ul>";
echo "<li><a href='test_database.php'>Test Database Connection</a></li>";
echo "<li><a href='test_api_simple.php'>Test API Endpoints</a></li>";
echo "<li><a href='v1/auth/login.php'>Try Login API directly</a></li>";
echo "</ul>";
?> 