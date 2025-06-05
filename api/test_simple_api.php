<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing News API directly...\n";

// First get a token
$loginData = json_encode([
    'email' => 'admin@dseza.gov.vn',
    'password' => 'password123'
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/final-dseza-landing-85/api/v1/auth/login.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Login response: HTTP $httpCode\n";
echo $response . "\n";

$loginResult = json_decode($response, true);
if (!$loginResult || $loginResult['status'] !== 'success') {
    echo "Login failed!\n";
    exit;
}

$token = $loginResult['token'];
echo "Token: " . substr($token, 0, 50) . "...\n";

// Now test news API
echo "\nTesting News API...\n";

$ch2 = curl_init();
curl_setopt($ch2, CURLOPT_URL, 'http://localhost/final-dseza-landing-85/api/v1/admin/news.php');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $token]);

$newsResponse = curl_exec($ch2);
$newsHttpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
curl_close($ch2);

echo "News API response: HTTP $newsHttpCode\n";
echo $newsResponse . "\n";

?> 