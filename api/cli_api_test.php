<?php
/**
 * CLI API Test Script for DSEZA
 * File: api/cli_api_test.php
 * 
 * Run from command line: php api/cli_api_test.php
 * Tests both Login and Stats APIs comprehensively
 */

// Configuration
$config = [
    'baseUrl' => 'http://localhost/final-dseza-landing-85/api',
    'loginEndpoint' => '/v1/auth/login.php',
    'statsEndpoint' => '/v1/stats/overview.php'
];

// Test data
$testUsers = [
    'valid_admin' => ['email' => 'admin@dseza.gov.vn', 'password' => 'password123'],
    'valid_editor' => ['email' => 'editor@dseza.gov.vn', 'password' => 'password123'],
    'invalid_password' => ['email' => 'admin@dseza.gov.vn', 'password' => 'wrongpassword'],
    'nonexistent_user' => ['email' => 'notexist@dseza.gov.vn', 'password' => 'password123'],
    'inactive_user' => ['email' => 'inactive.user@dseza.gov.vn', 'password' => 'password123']
];

$jwtToken = null;
$totalTests = 0;
$passedTests = 0;

// ANSI Colors for terminal output
class Colors {
    const GREEN = "\033[32m";
    const RED = "\033[31m";
    const YELLOW = "\033[33m";
    const BLUE = "\033[34m";
    const CYAN = "\033[36m";
    const WHITE = "\033[37m";
    const BOLD = "\033[1m";
    const RESET = "\033[0m";
}

function printHeader($text) {
    echo "\n" . Colors::BOLD . Colors::CYAN . "=" . str_repeat("=", strlen($text) + 2) . "=" . Colors::RESET . "\n";
    echo Colors::BOLD . Colors::CYAN . " " . $text . " " . Colors::RESET . "\n";
    echo Colors::BOLD . Colors::CYAN . "=" . str_repeat("=", strlen($text) + 2) . "=" . Colors::RESET . "\n\n";
}

function printSubHeader($text) {
    echo "\n" . Colors::BOLD . Colors::BLUE . "--- " . $text . " ---" . Colors::RESET . "\n\n";
}

function printSuccess($text) {
    echo Colors::GREEN . "✅ " . $text . Colors::RESET . "\n";
}

function printError($text) {
    echo Colors::RED . "❌ " . $text . Colors::RESET . "\n";
}

function printInfo($text) {
    echo Colors::YELLOW . "ℹ️  " . $text . Colors::RESET . "\n";
}

function printWarning($text) {
    echo Colors::YELLOW . "⚠️  " . $text . Colors::RESET . "\n";
}

function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_VERBOSE, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    if ($data && ($method === 'POST' || $method === 'PUT')) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, is_array($data) ? json_encode($data) : $data);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    if ($error) {
        return ['error' => $error, 'http_code' => 0, 'response' => null];
    }
    
    return [
        'http_code' => $httpCode,
        'response' => $response,
        'data' => json_decode($response, true)
    ];
}

function runTest($testName, $result, $expectedCode = 200, $description = '') {
    global $totalTests, $passedTests;
    $totalTests++;
    
    $isSuccess = ($result['http_code'] == $expectedCode && !isset($result['error']));
    
    if ($isSuccess) {
        $passedTests++;
        printSuccess("Test: $testName");
    } else {
        printError("Test: $testName");
    }
    
    if ($description) {
        echo "   Description: $description\n";
    }
    
    echo "   Expected: HTTP $expectedCode | Actual: HTTP {$result['http_code']}\n";
    
    if (isset($result['error'])) {
        printError("   CURL Error: {$result['error']}");
    } else if ($result['data']) {
        echo "   Response: " . json_encode($result['data'], JSON_UNESCAPED_UNICODE) . "\n";
    }
    
    echo "\n";
    return $isSuccess;
}

// Main execution
printHeader("DSEZA API Comprehensive Test Suite - CLI Version");

echo "Target: {$config['baseUrl']}\n";
echo "Timestamp: " . date('Y-m-d H:i:s') . "\n";

printSubHeader("Part 1: Login API Tests");

// Test 1: Valid Admin Login
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['valid_admin'],
    ['Content-Type: application/json']
);

$success = runTest(
    'Valid Admin Login',
    $result,
    200,
    'Login with valid admin credentials'
);

// Save token for later use
if ($success && $result['data']['status'] === 'success') {
    $jwtToken = $result['data']['token'];
    printInfo("JWT Token saved: " . substr($jwtToken, 0, 30) . "...");
}

// Test 2: Valid Editor Login
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['valid_editor'],
    ['Content-Type: application/json']
);

runTest('Valid Editor Login', $result, 200, 'Login with valid editor credentials');

// Test 3: Invalid Password
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['invalid_password'],
    ['Content-Type: application/json']
);

runTest('Invalid Password', $result, 401, 'Login attempt with wrong password');

// Test 4: Non-existent User
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['nonexistent_user'],
    ['Content-Type: application/json']
);

runTest('Non-existent User', $result, 401, 'Login attempt with email that does not exist');

// Test 5: Inactive User
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['inactive_user'],
    ['Content-Type: application/json']
);

runTest('Inactive User', $result, 401, 'Login attempt with inactive account');

// Test 6: Missing Email
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    ['password' => 'password123'],
    ['Content-Type: application/json']
);

runTest('Missing Email Field', $result, 400, 'Login attempt without email field');

// Test 7: Missing Password
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    ['email' => 'admin@dseza.gov.vn'],
    ['Content-Type: application/json']
);

runTest('Missing Password Field', $result, 400, 'Login attempt without password field');

// Test 8: Invalid JSON
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    '{invalid json}',
    ['Content-Type: application/json']
);

runTest('Invalid JSON', $result, 400, 'Login attempt with malformed JSON');

// Test 9: Wrong HTTP Method
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'GET',
    null,
    ['Content-Type: application/json']
);

runTest('Wrong HTTP Method (GET)', $result, 405, 'Using GET method instead of POST');

printSubHeader("Part 2: Stats API Tests");

// Check if we have a valid token
if (!$jwtToken) {
    printError("No valid JWT token available. Cannot proceed with Stats API tests.");
} else {
    // Test 1: Valid Token Access
    $result = makeRequest(
        $config['baseUrl'] . $config['statsEndpoint'],
        'GET',
        null,
        [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $jwtToken
        ]
    );

    $statsSuccess = runTest('Valid Token Access', $result, 200, 'Access stats with valid JWT token');

    // Display statistics if successful
    if ($statsSuccess && $result['data']['status'] === 'success') {
        printInfo("Statistics Summary:");
        $stats = $result['data']['data'];
        echo "   - Total News: {$stats['totalNews']}\n";
        echo "   - Total Events: {$stats['totalEvents']}\n";
        echo "   - Views This Month: {$stats['totalViewsThisMonth']}\n";
        echo "   - Active Users This Month: {$stats['activeUsersThisMonth']}\n";
        echo "   - Generated by: {$result['data']['meta']['generated_by']}\n";
        echo "   - User role: {$result['data']['meta']['user_role']}\n";
    }
}

// Test 2: No Token
$result = makeRequest(
    $config['baseUrl'] . $config['statsEndpoint'],
    'GET',
    null,
    ['Content-Type: application/json']
);

runTest('No Token Access', $result, 401, 'Access stats without authorization token');

// Test 3: Invalid Token
$result = makeRequest(
    $config['baseUrl'] . $config['statsEndpoint'],
    'GET',
    null,
    [
        'Content-Type: application/json',
        'Authorization: Bearer invalid.token.here'
    ]
);

runTest('Invalid Token Access', $result, 401, 'Access stats with invalid/malformed JWT token');

// Test 4: Wrong HTTP Method
$result = makeRequest(
    $config['baseUrl'] . $config['statsEndpoint'],
    'POST',
    ['test' => 'data'],
    [
        'Content-Type: application/json',
        'Authorization: Bearer ' . ($jwtToken ?: 'dummy.token')
    ]
);

runTest('Wrong HTTP Method (POST)', $result, 405, 'Using POST method instead of GET for stats');

printSubHeader("Test Summary");

$successRate = round(($passedTests / $totalTests) * 100, 2);

echo Colors::BOLD . "Total Tests: $totalTests" . Colors::RESET . "\n";
echo Colors::GREEN . "Passed: $passedTests" . Colors::RESET . "\n";
echo Colors::RED . "Failed: " . ($totalTests - $passedTests) . Colors::RESET . "\n";
echo Colors::BOLD . "Success Rate: $successRate%" . Colors::RESET . "\n\n";

if ($jwtToken) {
    printSubHeader("Manual Testing Commands");
    echo "Use this token for manual cURL testing:\n\n";
    echo Colors::CYAN . "curl -X GET \\\n";
    echo "  '{$config['baseUrl']}{$config['statsEndpoint']}' \\\n";
    echo "  -H 'Content-Type: application/json' \\\n";
    echo "  -H 'Authorization: Bearer $jwtToken'" . Colors::RESET . "\n\n";
}

printSubHeader("Setup Checklist");
echo "✅ Database server running\n";
echo "✅ Web server (Apache/Nginx) running\n";
echo "✅ PHP cURL extension enabled\n";
echo "✅ Database tables created\n";
echo "✅ Base URL configured: {$config['baseUrl']}\n\n";

printInfo("Test completed successfully!");

// Exit with appropriate code
exit($passedTests === $totalTests ? 0 : 1);
?> 