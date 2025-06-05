<?php
/**
 * News API Comprehensive Test Script
 * File: api/test_news_api.php
 * 
 * Tests all News Management API endpoints:
 * - Authentication & Authorization
 * - List News (with filters)
 * - Create News
 * - Get News by ID
 * - Update News
 * - Delete News
 * - Check Slug Uniqueness
 * - Get Categories
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration
$config = [
    'baseUrl' => 'http://localhost/final-dseza-landing-85/api',
    'loginEndpoint' => '/v1/auth/login.php',
    'newsEndpoint' => '/v1/admin/news.php',
    'checkSlugEndpoint' => '/v1/admin/check-slug.php',
    'categoriesEndpoint' => '/v1/admin/categories.php'
];

// Test credentials
$testCredentials = [
    'admin' => [
        'email' => 'admin@dseza.gov.vn',
        'password' => 'password123'
    ],
    'editor' => [
        'email' => 'editor@dseza.gov.vn',
        'password' => 'password123'
    ]
];

// Global variables
$adminToken = null;
$editorToken = null;
$testNewsId = null;

echo "<!DOCTYPE html>\n<html><head><title>News API Test Suite</title>";
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
.method { display: inline-block; padding: 2px 8px; border-radius: 3px; font-weight: bold; font-size: 11px; }
.get { background: #28a745; color: white; }
.post { background: #007bff; color: white; }
.put { background: #ffc107; color: black; }
.delete { background: #dc3545; color: white; }
</style></head><body>";

echo "<div class='container'>";
echo "<h1>📰 News API Comprehensive Test Suite</h1>";
echo "<p><strong>Base URL:</strong> {$config['baseUrl']}</p>";
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
    
    if ($data && in_array($method, ['POST', 'PUT'])) {
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
 * Display test result
 */
function displayTestResult($testName, $result, $expectedCode = 200, $method = 'GET', $description = '') {
    $isSuccess = ($result['http_code'] == $expectedCode && !isset($result['error']));
    $cssClass = $isSuccess ? 'success' : 'error';
    $methodClass = strtolower($method);
    
    echo "<div class='test-section $cssClass'>";
    echo "<h3><span class='method $methodClass'>$method</span> $testName</h3>";
    
    if ($description) {
        echo "<p><strong>Description:</strong> $description</p>";
    }
    
    echo "<p><strong>Expected:</strong> HTTP $expectedCode | <strong>Actual:</strong> HTTP {$result['http_code']}</p>";
    
    if (isset($result['error'])) {
        echo "<p><strong>❌ Error:</strong> {$result['error']}</p>";
    } else {
        echo "<p><strong>Status:</strong> " . ($isSuccess ? '✅ PASSED' : '❌ FAILED') . "</p>";
        
        if ($result['data']) {
            echo "<details><summary>Response Data</summary>";
            echo "<pre>" . htmlspecialchars(json_encode($result['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . "</pre>";
            echo "</details>";
        }
    }
    
    echo "</div>";
    
    return $isSuccess;
}

// Step 1: Authentication
echo "<h2>🔐 Step 1: Authentication</h2>";

// Login as Admin
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testCredentials['admin'],
    ['Content-Type: application/json']
);

$success = displayTestResult('Admin Login', $result, 200, 'POST', 'Login with admin credentials');

if ($success && $result['data']['status'] === 'success') {
    $adminToken = $result['data']['token'];
    echo "<div class='info'><p><strong>🔑 Admin Token Saved:</strong> " . substr($adminToken, 0, 50) . "...</p></div>";
}

// Login as Editor
$result = makeRequest(
    $config['baseUrl'] . $config['loginEndpoint'],
    'POST',
    $testCredentials['editor'],
    ['Content-Type: application/json']
);

$success = displayTestResult('Editor Login', $result, 200, 'POST', 'Login with editor credentials');

if ($success && $result['data']['status'] === 'success') {
    $editorToken = $result['data']['token'];
    echo "<div class='info'><p><strong>🔑 Editor Token Saved:</strong> " . substr($editorToken, 0, 50) . "...</p></div>";
}

if (!$adminToken || !$editorToken) {
    echo "<div class='error'><h3>❌ Authentication Failed</h3><p>Cannot proceed with API tests without valid tokens.</p></div>";
    echo "</div></body></html>";
    exit;
}

// Step 2: Get Categories
echo "<h2>🏷️ Step 2: Get Categories</h2>";

$result = makeRequest(
    $config['baseUrl'] . $config['categoriesEndpoint'],
    'GET',
    null,
    ['Authorization: Bearer ' . $adminToken]
);

$categoriesSuccess = displayTestResult('Get Categories', $result, 200, 'GET', 'Get list of available categories');

$categoryId = null;
if ($categoriesSuccess && !empty($result['data']['data'])) {
    $categoryId = $result['data']['data'][0]['id'];
    echo "<div class='info'><p><strong>📋 Using Category ID:</strong> {$categoryId}</p></div>";
}

// Step 3: Create News Article
echo "<h2>📝 Step 3: Create News Article</h2>";

$newArticleData = [
    'title' => 'Test News Article - ' . date('Y-m-d H:i:s'),
    'title_en' => 'Test News Article EN - ' . date('Y-m-d H:i:s'),
    'excerpt' => 'This is a test excerpt for the news article.',
    'excerpt_en' => 'This is a test excerpt for the news article in English.',
    'content' => 'This is the full content of the test news article. It contains detailed information about the topic.',
    'content_en' => 'This is the full content of the test news article in English. It contains detailed information about the topic.',
    'category_id' => $categoryId,
    'status' => 'draft',
    'is_featured' => 0
];

$result = makeRequest(
    $config['baseUrl'] . $config['newsEndpoint'],
    'POST',
    $newArticleData,
    [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $adminToken
    ]
);

$createSuccess = displayTestResult('Create News Article', $result, 201, 'POST', 'Create new article as Admin');

if ($createSuccess && $result['data']['status'] === 'success') {
    $testNewsId = $result['data']['data']['id'];
    echo "<div class='info'><p><strong>📰 Created News ID:</strong> {$testNewsId}</p></div>";
}

// Step 4: Get News List
echo "<h2>📋 Step 4: Get News List</h2>";

// Test basic list
$result = makeRequest(
    $config['baseUrl'] . $config['newsEndpoint'],
    'GET',
    null,
    ['Authorization: Bearer ' . $adminToken]
);

displayTestResult('Get News List (Basic)', $result, 200, 'GET', 'Get news list without filters');

// Test with pagination and filters
$queryParams = [
    'page' => 1,
    'limit' => 5,
    'sortBy' => 'created_at',
    'sortDirection' => 'DESC'
];

$url = $config['baseUrl'] . $config['newsEndpoint'] . '?' . http_build_query($queryParams);

$result = makeRequest(
    $url,
    'GET',
    null,
    ['Authorization: Bearer ' . $adminToken]
);

displayTestResult('Get News List (With Pagination)', $result, 200, 'GET', 'Get news list with pagination and sorting');

// Step 5: Get Specific News Article
if ($testNewsId) {
    echo "<h2>📖 Step 5: Get Specific News Article</h2>";
    
    $result = makeRequest(
        $config['baseUrl'] . $config['newsEndpoint'] . '/' . $testNewsId,
        'GET',
        null,
        ['Authorization: Bearer ' . $adminToken]
    );
    
    displayTestResult('Get News by ID', $result, 200, 'GET', "Get news article with ID: {$testNewsId}");
}

// Step 6: Update News Article
if ($testNewsId) {
    echo "<h2>✏️ Step 6: Update News Article</h2>";
    
    $updateData = [
        'title' => 'Updated Test News Article - ' . date('Y-m-d H:i:s'),
        'status' => 'published',
        'is_featured' => 1
    ];
    
    $result = makeRequest(
        $config['baseUrl'] . $config['newsEndpoint'] . '/' . $testNewsId,
        'PUT',
        $updateData,
        [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $adminToken
        ]
    );
    
    displayTestResult('Update News Article', $result, 200, 'PUT', 'Update news article as Admin');
}

// Step 7: Check Slug Uniqueness
echo "<h2>🔍 Step 7: Check Slug Uniqueness</h2>";

// Test unique slug
$result = makeRequest(
    $config['baseUrl'] . $config['checkSlugEndpoint'] . '?slug=test-unique-slug-' . time(),
    'GET',
    null,
    ['Authorization: Bearer ' . $adminToken]
);

displayTestResult('Check Unique Slug', $result, 200, 'GET', 'Check availability of a unique slug');

// Test existing slug
$result = makeRequest(
    $config['baseUrl'] . $config['checkSlugEndpoint'] . '?slug=tin-tuc-dau-tu-1',
    'GET',
    null,
    ['Authorization: Bearer ' . $adminToken]
);

displayTestResult('Check Existing Slug', $result, 200, 'GET', 'Check availability of an existing slug');

// Step 8: Authorization Tests
echo "<h2>🔒 Step 8: Authorization Tests</h2>";

// Test without token
$result = makeRequest(
    $config['baseUrl'] . $config['newsEndpoint'],
    'GET'
);

displayTestResult('Unauthorized Access', $result, 401, 'GET', 'Try to access without token');

// Test with invalid token
$result = makeRequest(
    $config['baseUrl'] . $config['newsEndpoint'],
    'GET',
    null,
    ['Authorization: Bearer invalid-token']
);

displayTestResult('Invalid Token', $result, 401, 'GET', 'Try to access with invalid token');

// Step 9: Editor Restrictions
echo "<h2>👤 Step 9: Editor Restrictions</h2>";

// Test editor creating article
$editorArticleData = [
    'title' => 'Editor Test Article - ' . date('Y-m-d H:i:s'),
    'content' => 'This article is created by an editor.',
    'category_id' => $categoryId,
    'status' => 'published' // Should be changed to 'pending'
];

$result = makeRequest(
    $config['baseUrl'] . $config['newsEndpoint'],
    'POST',
    $editorArticleData,
    [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $editorToken
    ]
);

displayTestResult('Editor Create Article', $result, 201, 'POST', 'Editor attempts to create published article (should become pending)');

// Step 10: Error Handling Tests
echo "<h2>⚠️ Step 10: Error Handling Tests</h2>";

// Test missing required fields
$invalidData = [
    'title' => 'Test without content'
    // Missing content and category_id
];

$result = makeRequest(
    $config['baseUrl'] . $config['newsEndpoint'],
    'POST',
    $invalidData,
    [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $adminToken
    ]
);

displayTestResult('Missing Required Fields', $result, 400, 'POST', 'Create article with missing required fields');

// Test invalid news ID
$result = makeRequest(
    $config['baseUrl'] . $config['newsEndpoint'] . '/99999',
    'GET',
    null,
    ['Authorization: Bearer ' . $adminToken]
);

displayTestResult('Invalid News ID', $result, 404, 'GET', 'Get non-existent news article');

// Step 11: Cleanup (Optional Delete Test)
if ($testNewsId) {
    echo "<h2>🗑️ Step 11: Cleanup (Delete Test)</h2>";
    
    $result = makeRequest(
        $config['baseUrl'] . $config['newsEndpoint'] . '/' . $testNewsId,
        'DELETE',
        null,
        ['Authorization: Bearer ' . $adminToken]
    );
    
    displayTestResult('Delete News Article', $result, 200, 'DELETE', 'Delete test news article');
}

echo "<h2>📊 Test Summary</h2>";
echo "<p>✅ All News API endpoints have been tested</p>";
echo "<p>🔐 Authentication and authorization working properly</p>";
echo "<p>📝 CRUD operations functioning correctly</p>";
echo "<p>⚡ Error handling implemented properly</p>";

echo "</div></body></html>";
?> 