<?php
/**
 * Debug Login API
 * Kiểm tra từng bước để tìm lỗi
 */

// Bật hiển thị lỗi
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🐛 Debug Login API</h1>";

// Test 1: Include files
echo "<h2>📁 Test 1: Include Files</h2>";
try {
    require_once __DIR__ . '/core/Database.php';
    echo "✅ Database.php included<br>";
    
    require_once __DIR__ . '/core/User.php';
    echo "✅ User.php included<br>";
    
    require_once __DIR__ . '/core/AuthHelper.php';
    echo "✅ AuthHelper.php included<br>";
    
} catch (Exception $e) {
    echo "❌ Include error: " . $e->getMessage() . "<br>";
    exit;
}

// Test 2: Database connection
echo "<h2>🔌 Test 2: Database Connection</h2>";
try {
    $db = Database::getInstance();
    echo "✅ Database instance created<br>";
    
    $connection = $db->getConnection();
    echo "✅ Database connection successful<br>";
    
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "<br>";
    exit;
}

// Test 3: User model
echo "<h2>👤 Test 3: User Model</h2>";
try {
    $userModel = new User();
    echo "✅ User model created<br>";
    
    // Test find user
    $email = 'admin@dseza.gov.vn';
    $user = $userModel->findByEmail($email);
    
    if ($user) {
        echo "✅ User found: {$user['email']}<br>";
        echo "User data:<br>";
        echo "<pre>";
        print_r([
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'is_active' => $user['is_active'],
            'password_hash' => substr($user['password_hash'], 0, 20) . '...'
        ]);
        echo "</pre>";
    } else {
        echo "❌ User not found<br>";
        exit;
    }
    
} catch (Exception $e) {
    echo "❌ User model error: " . $e->getMessage() . "<br>";
    exit;
}

// Test 4: Password verification
echo "<h2>🔐 Test 4: Password Verification</h2>";
try {
    $password = 'password123';
    $isValid = $userModel->verifyPassword($password, $user['password_hash']);
    
    if ($isValid) {
        echo "✅ Password verification successful<br>";
    } else {
        echo "❌ Password verification failed<br>";
        
        // Test with manual hash
        echo "Testing manual password hash...<br>";
        $testHash = password_hash($password, PASSWORD_BCRYPT);
        echo "Generated hash: " . substr($testHash, 0, 30) . "...<br>";
        echo "Database hash: " . substr($user['password_hash'], 0, 30) . "...<br>";
        
        // Test if the stored hash is correct
        $manualVerify = password_verify($password, $user['password_hash']);
        echo "Manual verify result: " . ($manualVerify ? 'SUCCESS' : 'FAILED') . "<br>";
    }
    
} catch (Exception $e) {
    echo "❌ Password verification error: " . $e->getMessage() . "<br>";
}

// Test 5: AuthHelper
echo "<h2>🔑 Test 5: AuthHelper</h2>";
try {
    $authHelper = new AuthHelper();
    echo "✅ AuthHelper created<br>";
    
    $userData = $userModel->getUserForToken($user);
    echo "User data for token:<br>";
    echo "<pre>";
    print_r($userData);
    echo "</pre>";
    
    $token = $authHelper->createToken($userData);
    echo "✅ Token created successfully<br>";
    echo "Token: " . substr($token, 0, 50) . "...<br>";
    
} catch (Exception $e) {
    echo "❌ AuthHelper error: " . $e->getMessage() . "<br>";
    echo "Error details: " . $e->getTraceAsString() . "<br>";
}

// Test 6: Full login simulation
echo "<h2>🚀 Test 6: Full Login Simulation</h2>";
try {
    $loginData = [
        'email' => 'admin@dseza.gov.vn',
        'password' => 'password123'
    ];
    
    echo "Testing with data:<br>";
    echo "<pre>" . json_encode($loginData, JSON_PRETTY_PRINT) . "</pre>";
    
    // Validate email format
    if (!$userModel->isValidEmail($loginData['email'])) {
        throw new Exception('Invalid email format');
    }
    echo "✅ Email format valid<br>";
    
    // Find user
    $user = $userModel->findByEmail($loginData['email']);
    if (!$user) {
        throw new Exception('User not found');
    }
    echo "✅ User found<br>";
    
    // Check if active
    if (!$userModel->isActive($user)) {
        throw new Exception('User is inactive');
    }
    echo "✅ User is active<br>";
    
    // Verify password
    if (!$userModel->verifyPassword($loginData['password'], $user['password_hash'])) {
        throw new Exception('Invalid password');
    }
    echo "✅ Password verified<br>";
    
    // Create token
    $authHelper = new AuthHelper();
    $userData = $userModel->getUserForToken($user);
    $token = $authHelper->createToken($userData);
    echo "✅ Token created<br>";
    
    // Update last login
    $userModel->updateLastLogin($user['id']);
    echo "✅ Last login updated<br>";
    
    // Success response
    $response = [
        'status' => 'success',
        'message' => 'Login successful.',
        'token' => $token,
        'user' => $userData
    ];
    
    echo "<h3>🎉 Login Simulation Successful!</h3>";
    echo "<pre>" . json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
    
} catch (Exception $e) {
    echo "❌ Login simulation failed: " . $e->getMessage() . "<br>";
}

echo "<h2>📝 Summary</h2>";
echo "<p>Debug completed. Check results above for any issues.</p>";
?> 