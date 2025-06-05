<?php
/**
 * Categories API
 * File: api/v1/admin/categories.php
 * 
 * Endpoint: GET /api/v1/admin/categories
 * Returns list of categories for news articles
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include required files
require_once __DIR__ . '/../../core/Database.php';
require_once __DIR__ . '/../../core/AuthMiddleware.php';
require_once __DIR__ . '/../../core/News.php';

try {
    // Initialize middleware for authentication
    $authMiddleware = new AuthMiddleware();
    
    // Check authentication
    $user = $authMiddleware->requireAuthentication();
    
    // Check if user has required role (Admin or Editor)
    if (!in_array($user['role'], ['Admin', 'Editor'])) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Access denied. Admin or Editor role required.'
        ]);
        exit;
    }
    
    // Only allow GET method
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode([
            'status' => 'error',
            'message' => 'Method not allowed. Use GET.'
        ]);
        exit;
    }
    
    // Initialize News model and get categories
    $newsModel = new News();
    $categories = $newsModel->getCategories();
    
    echo json_encode([
        'status' => 'success',
        'data' => $categories
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?> 