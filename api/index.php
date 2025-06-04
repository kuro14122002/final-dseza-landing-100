<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// API Information
$apiInfo = [
    'name' => 'DSEZA Admin Panel API',
    'version' => '1.0.0',
    'description' => 'API for DSEZA Investment Hub Admin Panel Authentication',
    'endpoints' => [
        'POST /api/admin/auth/login' => 'Admin login endpoint',
    ],
    'documentation' => 'See README.md for detailed documentation',
    'status' => 'active',
    'timestamp' => date('Y-m-d H:i:s')
];

echo json_encode($apiInfo, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?> 