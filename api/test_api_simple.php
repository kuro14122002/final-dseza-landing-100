<?php
/**
 * Simple API Test Script for DSEZA API
 * Test các endpoint API có sẵn
 */

// Bật hiển thị lỗi
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🚀 DSEZA API Testing Suite</h1>";
echo "<p>Test suite để kiểm tra các API endpoints</p>";

/**
 * Function test API endpoint
 */
function testAPI($url, $method = 'GET', $data = null, $description = '') {
    echo "<div style='border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px;'>";
    echo "<h3>🔍 Test: $description</h3>";
    echo "<strong>📍 URL:</strong> $url<br>";
    echo "<strong>📋 Method:</strong> $method<br>";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen(json_encode($data))
            ]);
            echo "<strong>📤 Data:</strong> <pre>" . htmlspecialchars(json_encode($data, JSON_PRETTY_PRINT)) . "</pre>";
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo "<strong style='color: red;'>❌ CURL Error:</strong> $error<br>";
    }
    
    echo "<strong>📊 HTTP Status:</strong> ";
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "<span style='color: green;'>✅ $httpCode</span><br>";
    } else {
        echo "<span style='color: red;'>❌ $httpCode</span><br>";
    }
    
    echo "<strong>📄 Response:</strong><br>";
    echo "<pre style='background: #f5f5f5; padding: 10px; border-radius: 3px; max-height: 300px; overflow-y: auto;'>";
    echo htmlspecialchars($response);
    echo "</pre>";
    
    // Thử parse JSON
    $jsonData = json_decode($response, true);
    if (json_last_error() === JSON_ERROR_NONE && $jsonData) {
        echo "<strong>🔍 Parsed JSON:</strong><br>";
        echo "<pre style='background: #e8f5e8; padding: 10px; border-radius: 3px; max-height: 200px; overflow-y: auto;'>";
        print_r($jsonData);
        echo "</pre>";
    }
    
    echo "</div>";
    return [$httpCode, $response];
}

// Base URL
$baseUrl = 'http://localhost/final-dseza-landing-85';

echo "<h2>📍 Available Tests</h2>";

// Test 1: API Info
testAPI("$baseUrl/api/", 'GET', null, 'API Information Endpoint');

// Test 2: API Index
testAPI("$baseUrl/api/index.php", 'GET', null, 'API Index Page');

// Test 3: Login API - Valid credentials
testAPI("$baseUrl/api/v1/auth/login.php", 'POST', [
    'email' => 'admin@dseza.gov.vn',
    'password' => 'password123'
], 'Login API - Valid Admin Credentials');

// Test 4: Login API - Invalid credentials
testAPI("$baseUrl/api/v1/auth/login.php", 'POST', [
    'email' => 'admin@dseza.gov.vn',
    'password' => 'wrongpassword'
], 'Login API - Invalid Password');

// Test 5: Login API - Missing data
testAPI("$baseUrl/api/v1/auth/login.php", 'POST', [
    'email' => 'admin@dseza.gov.vn'
], 'Login API - Missing Password');

// Test 6: Stats API (nếu có)
testAPI("$baseUrl/api/v1/stats/", 'GET', null, 'Stats API Endpoint');

echo "<h2>📝 Test Summary</h2>";
echo "<p>✅ Các test đã hoàn thành. Kiểm tra kết quả ở trên.</p>";
echo "<p><strong>Lưu ý:</strong></p>";
echo "<ul>";
echo "<li>Đảm bảo XAMPP MySQL đang chạy</li>";
echo "<li>Database 'dseza_db' đã được tạo và có dữ liệu</li>";
echo "<li>Các file API trong thư mục api/ đang hoạt động</li>";
echo "</ul>";

// Kiểm tra PHP extensions
echo "<h3>🔧 PHP Configuration Check</h3>";
echo "<p><strong>PHP Version:</strong> " . PHP_VERSION . "</p>";
echo "<p><strong>cURL Extension:</strong> " . (extension_loaded('curl') ? '✅ Enabled' : '❌ Disabled') . "</p>";
echo "<p><strong>PDO Extension:</strong> " . (extension_loaded('pdo') ? '✅ Enabled' : '❌ Disabled') . "</p>";
echo "<p><strong>PDO MySQL:</strong> " . (extension_loaded('pdo_mysql') ? '✅ Enabled' : '❌ Disabled') . "</p>";
?> 