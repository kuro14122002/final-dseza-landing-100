<?php
/**
 * Comprehensive API Test Script
 * File: api/comprehensive_api_test.php
 * 
 * Tests both Login API and Stats API with all required scenarios:
 * - Login API: Success (Admin/Editor), Wrong password, Non-existent email, Inactive account, Missing fields
 * - Stats API: Valid token, No token, Invalid token
 * - Saves JWT token for reuse between tests
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration
$config = [
    'baseUrl' => 'http://localhost/final-dseza-landing-85/api',  // Adjust this to your server URL
    'loginEndpoint' => '/v1/auth/login.php',
    'statsEndpoint' => '/v1/stats/overview.php'
];

// Test data for various scenarios
$testUsers = [
    'valid_admin' => [
        'email' => 'admin@dseza.gov.vn',
        'password' => 'password123'
    ],
    'valid_editor' => [
        'email' => 'editor@dseza.gov.vn', 
        'password' => 'password123'
    ],
    'invalid_password' => [
        'email' => 'admin@dseza.gov.vn',
        'password' => 'wrongpassword'
    ],
    'nonexistent_user' => [
        'email' => 'notexist@dseza.gov.vn',
        'password' => 'password123'
    ],
    'inactive_user' => [
        'email' => 'inactive.user@dseza.gov.vn',
        'password' => 'password123'
    ]
];

// Global variable to store JWT token
$jwtToken = null;

echo "<!DOCTYPE html>\n<html><head><title>DSEZA API Comprehensive Test</title>";
echo "<style>
body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
.container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
.test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
.success { background: #d4edda; border-color: #c3e6cb; color: #155724; }
.error { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
.warning { background: #fff3cd; border-color: #ffeaa7; color: #856404; }
.info { background: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px; }
h1, h2, h3 { color: #333; }
.token-display { word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px; }
</style></head><body>";

echo "<div class='container'>";
echo "<h1>🔐 DSEZA API Comprehensive Test Suite</h1>";
echo "<p><strong>Target:</strong> {$config['baseUrl']}</p>";
echo "<p><strong>Timestamp:</strong> " . date('Y-m-d H:i:s') . "</p>";

/**
 * Make HTTP request using cURL
 */
function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
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

/**
 * Display test result in formatted HTML
 */
function displayTestResult($testName, $result, $expectedCode = 200, $description = '') {
    $isSuccess = ($result['http_code'] == $expectedCode && !isset($result['error']));
    $cssClass = $isSuccess ? 'success' : 'error';
    
    echo "<div class='test-section $cssClass'>";
    echo "<h3>🧪 Test: $testName</h3>";
    
    if ($description) {
        echo "<p><strong>Description:</strong> $description</p>";
    }
    
    echo "<p><strong>Expected HTTP Code:</strong> $expectedCode</p>";
    echo "<p><strong>Actual HTTP Code:</strong> {$result['http_code']}</p>";
    
    if (isset($result['error'])) {
        echo "<p><strong>❌ CURL Error:</strong> {$result['error']}</p>";
    } else {
        echo "<p><strong>✅ Status:</strong> " . ($isSuccess ? 'PASSED' : 'FAILED') . "</p>";
        
        if ($result['data']) {
            echo "<p><strong>Response Data:</strong></p>";
            echo "<pre>" . htmlspecialchars(json_encode($result['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . "</pre>";
        } else {
            echo "<p><strong>Raw Response:</strong></p>";
            echo "<pre>" . htmlspecialchars($result['response']) . "</pre>";
        }
    }
    
    echo "</div>";
    
    return $isSuccess;
}

echo "<h2>📋 Part 1: Login API Tests</h2>";

// Test 1: Valid Admin Login
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['valid_admin'],
    ['Content-Type: application/json']
);

$success = displayTestResult(
    'Valid Admin Login',
    $result,
    200,
    'Login with valid admin credentials'
);

// Save token for later use
if ($success && $result['data']['status'] === 'success') {
    $jwtToken = $result['data']['token'];
    echo "<div class='info'>";
    echo "<h4>🔑 JWT Token Saved</h4>";
    echo "<div class='token-display'>" . substr($jwtToken, 0, 50) . "...</div>";
    echo "</div>";
}

// Test 2: Valid Editor Login
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['valid_editor'],
    ['Content-Type: application/json']
);

displayTestResult(
    'Valid Editor Login',
    $result,
    200,
    'Login with valid editor credentials'
);

// Test 3: Invalid Password
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['invalid_password'],
    ['Content-Type: application/json']
);

displayTestResult(
    'Invalid Password',
    $result,
    401,
    'Login attempt with wrong password'
);

// Test 4: Non-existent User
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['nonexistent_user'],
    ['Content-Type: application/json']
);

displayTestResult(
    'Non-existent User',
    $result,
    401,
    'Login attempt with email that does not exist'
);

// Test 5: Inactive User
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testUsers['inactive_user'],
    ['Content-Type: application/json']
);

displayTestResult(
    'Inactive User',
    $result,
    401,
    'Login attempt with inactive account'
);

// Test 6: Missing Email
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    ['password' => 'password123'],
    ['Content-Type: application/json']
);

displayTestResult(
    'Missing Email Field',
    $result,
    400,
    'Login attempt without email field'
);

// Test 7: Missing Password
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    ['email' => 'admin@dseza.gov.vn'],
    ['Content-Type: application/json']
);

displayTestResult(
    'Missing Password Field',
    $result,
    400,
    'Login attempt without password field'
);

// Test 8: Invalid JSON
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    '{invalid json}',
    ['Content-Type: application/json']
);

displayTestResult(
    'Invalid JSON',
    $result,
    400,
    'Login attempt with malformed JSON'
);

// Test 9: Wrong HTTP Method
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'GET',
    null,
    ['Content-Type: application/json']
);

displayTestResult(
    'Wrong HTTP Method (GET)',
    $result,
    405,
    'Using GET method instead of POST'
);

echo "<h2>📊 Part 2: Stats API Tests</h2>";

// Check if we have a valid token from login
if (!$jwtToken) {
    echo "<div class='error'>";
    echo "<h3>❌ No Valid JWT Token Available</h3>";
    echo "<p>Cannot proceed with Stats API tests because login failed.</p>";
    echo "</div>";
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

    $statsSuccess = displayTestResult(
        'Valid Token Access',
        $result,
        200,
        'Access stats with valid JWT token'
    );

    // Verify statistics data if successful
    if ($statsSuccess && $result['data']['status'] === 'success') {
        echo "<div class='info'>";
        echo "<h4>📈 Statistics Summary</h4>";
        $stats = $result['data']['data'];
        echo "<ul>";
        echo "<li><strong>Total News:</strong> {$stats['totalNews']}</li>";
        echo "<li><strong>Total Events:</strong> {$stats['totalEvents']}</li>";
        echo "<li><strong>Views This Month:</strong> {$stats['totalViewsThisMonth']}</li>";
        echo "<li><strong>Active Users This Month:</strong> {$stats['activeUsersThisMonth']}</li>";
        echo "</ul>";
        echo "<p><strong>Generated by:</strong> {$result['data']['meta']['generated_by']}</p>";
        echo "<p><strong>User role:</strong> {$result['data']['meta']['user_role']}</p>";
        echo "</div>";
    }
}

// Test 2: No Token
$result = makeRequest(
    $config['baseUrl'] . $config['statsEndpoint'],
    'GET',
    null,
    ['Content-Type: application/json']
);

displayTestResult(
    'No Token Access',
    $result,
    401,
    'Access stats without authorization token'
);

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

displayTestResult(
    'Invalid Token Access',
    $result,
    401,
    'Access stats with invalid/malformed JWT token'
);

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

displayTestResult(
    'Wrong HTTP Method (POST)',
    $result,
    405,
    'Using POST method instead of GET for stats'
);

// Test 5: Expired Token Simulation (using malformed token)
$result = makeRequest(
    $config['baseUrl'] . $config['statsEndpoint'],
    'GET',
    null,
    [
        'Content-Type: application/json',
        'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.expired.token'
    ]
);

displayTestResult(
    'Expired/Malformed Token',
    $result,
    401,
    'Access stats with expired or malformed token'
);

echo "<h2>🗃️ Part 3: Database Verification</h2>";

// Simple database connection test (if accessible)
echo "<div class='info'>";
echo "<h3>💾 Database Statistics Verification</h3>";
echo "<p>To verify that the statistics returned by the API match the actual database records:</p>";
echo "<ol>";
echo "<li>Connect to your MySQL database</li>";
echo "<li>Run: <code>SELECT COUNT(*) FROM news_articles;</code></li>";
echo "<li>Run: <code>SELECT COUNT(*) FROM event_articles;</code></li>";
echo "<li>Compare with the values returned by the Stats API above</li>";
echo "</ol>";
echo "<p><strong>Note:</strong> Views and Active Users are currently mock data as per API implementation.</p>";
echo "</div>";

echo "<h2>🏁 Summary</h2>";

echo "<div class='info'>";
echo "<h3>✅ Test Suite Completed</h3>";
echo "<p><strong>Saved JWT Token:</strong> " . ($jwtToken ? "Available for further testing" : "Not available") . "</p>";
echo "<p><strong>Token Preview:</strong> " . ($jwtToken ? substr($jwtToken, 0, 30) . "..." : "N/A") . "</p>";

if ($jwtToken) {
    echo "<h4>🔧 Using Token for Manual Testing:</h4>";
    echo "<p>You can use this token for manual cURL testing:</p>";
    echo "<pre>";
    echo "# Stats API with valid token:\n";
    echo "curl -X GET \\\n";
    echo "  '{$config['baseUrl']}{$config['statsEndpoint']}' \\\n";
    echo "  -H 'Content-Type: application/json' \\\n";
    echo "  -H 'Authorization: Bearer {$jwtToken}'";
    echo "</pre>";
}

echo "<h4>📚 Additional Testing with External Tools:</h4>";
echo "<ul>";
echo "<li><strong>Postman:</strong> Import endpoints and use saved token from environment variables</li>";
echo "<li><strong>Insomnia:</strong> Create requests with Bearer token authentication</li>";
echo "<li><strong>cURL:</strong> Use the commands shown above</li>";
echo "</ul>";

echo "<h4>🔍 Setup Checklist:</h4>";
echo "<ul>";
echo "<li>✅ Database server running</li>";
echo "<li>✅ Web server (Apache/Nginx) running</li>";
echo "<li>✅ PHP cURL extension enabled</li>";
echo "<li>✅ Database tables created (run database_setup.sql and database_setup_extended.sql)</li>";
echo "<li>✅ Base URL configured correctly: {$config['baseUrl']}</li>";
echo "</ul>";
echo "</div>";

echo "</div>"; // container
echo "</body></html>";
?> 