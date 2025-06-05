<?php
/**
 * Quick Login API Test
 * Test the fixed login functionality
 */

// Test login via curl
$url = 'http://localhost/final-dseza-landing-85/api/v1/auth/login.php';
$data = json_encode([
    'email' => 'admin@dseza.gov.vn',
    'password' => 'password123'
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data)
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "<h1>🚀 Quick Login Test</h1>";
echo "<p><strong>URL:</strong> $url</p>";
echo "<p><strong>Data:</strong> $data</p>";
echo "<p><strong>HTTP Code:</strong> $httpCode</p>";
echo "<p><strong>Response:</strong></p>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";

if ($httpCode == 200) {
    $responseData = json_decode($response, true);
    if ($responseData && $responseData['status'] === 'success') {
        echo "<h2>✅ LOGIN SUCCESS!</h2>";
        echo "<p>Token: " . substr($responseData['token'], 0, 50) . "...</p>";
    } else {
        echo "<h2>❌ Login failed in response</h2>";
    }
} else {
    echo "<h2>❌ HTTP Error: $httpCode</h2>";
}

// Test editor login too
echo "<hr>";
$data2 = json_encode([
    'email' => 'editor@dseza.gov.vn',
    'password' => 'password123'
]);

$ch2 = curl_init();
curl_setopt($ch2, CURLOPT_URL, $url);
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_POST, true);
curl_setopt($ch2, CURLOPT_POSTFIELDS, $data2);
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data2)
]);

$response2 = curl_exec($ch2);
$httpCode2 = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
curl_close($ch2);

echo "<h1>🔑 Editor Login Test</h1>";
echo "<p><strong>Data:</strong> $data2</p>";
echo "<p><strong>HTTP Code:</strong> $httpCode2</p>";
echo "<p><strong>Response:</strong></p>";
echo "<pre>" . htmlspecialchars($response2) . "</pre>";

if ($httpCode2 == 200) {
    $responseData2 = json_decode($response2, true);
    if ($responseData2 && $responseData2['status'] === 'success') {
        echo "<h2>✅ EDITOR LOGIN SUCCESS!</h2>";
    } else {
        echo "<h2>❌ Editor login failed in response</h2>";
    }
} else {
    echo "<h2>❌ HTTP Error: $httpCode2</h2>";
}

echo "<h2>📋 Summary</h2>";
echo "<p>Both admin and editor should now be able to login with password: <code>password123</code></p>";
?> 