<?php
/**
 * Fix Password Hashes for All Users
 * This script updates all user passwords to use "password123" with proper hashing
 */

require_once __DIR__ . '/core/Database.php';

// Get database connection
$db = Database::getInstance();
$pdo = $db->getConnection();

// New password for all users
$newPassword = 'password123';
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

echo "<h1>🔧 Fixing User Passwords</h1>";
echo "<p><strong>New password for all users:</strong> {$newPassword}</p>";
echo "<p><strong>Hash:</strong> {$hashedPassword}</p>";

try {
    // Update all users with the new password hash
    $stmt = $pdo->prepare("UPDATE users_admin SET password_hash = ? WHERE 1=1");
    $success = $stmt->execute([$hashedPassword]);
    
    if ($success) {
        $rowCount = $stmt->rowCount();
        echo "<p>✅ Successfully updated {$rowCount} user passwords</p>";
        
        // Display updated users
        $stmt = $pdo->query("SELECT id, email, role, is_active FROM users_admin ORDER BY id");
        $users = $stmt->fetchAll();
        
        echo "<h2>📋 Updated Users:</h2>";
        echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
        echo "<tr><th>ID</th><th>Email</th><th>Role</th><th>Active</th><th>Test Login</th></tr>";
        
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>{$user['id']}</td>";
            echo "<td>{$user['email']}</td>";
            echo "<td>{$user['role']}</td>";
            echo "<td>" . ($user['is_active'] ? 'Yes' : 'No') . "</td>";
            
            // Test login for each user
            if ($user['is_active']) {
                $testData = json_encode([
                    'email' => $user['email'],
                    'password' => $newPassword
                ]);
                echo "<td><code style='font-size: 11px;'>{$testData}</code></td>";
            } else {
                echo "<td>Inactive</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
        
        echo "<h2>🧪 Test Verification</h2>";
        
        // Test the password verification
        $stmt = $pdo->prepare("SELECT email, password_hash FROM users_admin WHERE email = ?");
        $stmt->execute(['admin@dseza.gov.vn']);
        $adminUser = $stmt->fetch();
        
        if ($adminUser) {
            $verifyResult = password_verify($newPassword, $adminUser['password_hash']);
            echo "<p><strong>Password verification test for admin@dseza.gov.vn:</strong> " . 
                 ($verifyResult ? "✅ SUCCESS" : "❌ FAILED") . "</p>";
        }
        
    } else {
        echo "<p>❌ Failed to update passwords</p>";
    }
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
}

echo "<h2>🚀 Next Steps</h2>";
echo "<ul>";
echo "<li>Test the login API with email and password: <code>password123</code></li>";
echo "<li>Run the comprehensive API test again</li>";
echo "<li>All active users should now be able to login with the same password</li>";
echo "</ul>";

?> 