<?php
/**
 * Test script cho Login API
 * File: api/test_login_api.php
 * 
 * Chạy script này để test API login hoạt động đúng không
 */

// Bật hiển thị lỗi cho debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>DSEZA Admin Login API Test</h2>";

/**
 * Function để test API login
 */
function testLoginAPI($email, $password, $description) {
    echo "<h3>Test: $description</h3>";
    
    // Dữ liệu test
    $postData = json_encode([
        'email' => $email,
        'password' => $password
    ]);
    
    // Cấu hình CURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/final-dseza-landing-85/api/v1/auth/login.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($postData)
    ]);
    
    // Thực hiện request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Hiển thị kết quả
    echo "<strong>Request Data:</strong><br>";
    echo "<pre>" . htmlspecialchars($postData) . "</pre>";
    
    echo "<strong>HTTP Status Code:</strong> $httpCode<br>";
    
    echo "<strong>Response:</strong><br>";
    echo "<pre>" . htmlspecialchars($response) . "</pre>";
    
    // Parse JSON response
    $responseData = json_decode($response, true);
    if ($responseData) {
        echo "<strong>Parsed Response:</strong><br>";
        echo "<pre>" . print_r($responseData, true) . "</pre>";
    }
    
    echo "<hr>";
}

// Test cases
echo "<h3>Chạy các test cases:</h3>";

// Test 1: Valid login
testLoginAPI('admin@dseza.gov.vn', 'password123', 'Valid Admin Login');

// Test 2: Valid editor login
testLoginAPI('editor@dseza.gov.vn', 'password123', 'Valid Editor Login');

// Test 3: Invalid password
testLoginAPI('admin@dseza.gov.vn', 'wrongpassword', 'Invalid Password');

// Test 4: Invalid email
testLoginAPI('notexist@dseza.gov.vn', 'password123', 'Non-existent User');

// Test 5: Inactive user
testLoginAPI('inactive.user@dseza.gov.vn', 'password123', 'Inactive User');

// Test 6: Missing email
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/final-dseza-landing-85/api/v1/auth/login.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['password' => 'password123']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

echo "<h3>Test: Missing Email Field</h3>";
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<strong>HTTP Status Code:</strong> $httpCode<br>";
echo "<strong>Response:</strong><br>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";

echo "<hr>";

// Test 7: Invalid JSON
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/final-dseza-landing-85/api/v1/auth/login.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, '{invalid json}');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

echo "<h3>Test: Invalid JSON</h3>";
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<strong>HTTP Status Code:</strong> $httpCode<br>";
echo "<strong>Response:</strong><br>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";

echo "<h3>Test hoàn thành!</h3>";
echo "<p><strong>Lưu ý:</strong> Để chạy được test này, bạn cần:</p>";
echo "<ul>";
echo "<li>Đã setup database với file database_setup.sql</li>";
echo "<li>PHP có extension curl enabled</li>";
echo "<li>Web server đang chạy (Apache/Nginx)</li>";
echo "<li>URL localhost phù hợp với cấu hình của bạn</li>";
echo "</ul>";
?> 