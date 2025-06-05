<?php
/**
 * Check Slug Uniqueness API
 * File: api/v1/admin/check-slug.php
 * 
 * Endpoint: GET /api/v1/admin/check-slug
 * Query params: 
 * - slug: The slug to check
 * - excludeId: (optional) Article ID to exclude from check (for editing)
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
    
    // Get parameters
    $slug = $_GET['slug'] ?? '';
    $excludeId = !empty($_GET['excludeId']) ? intval($_GET['excludeId']) : null;
    
    // Validate slug parameter
    if (empty($slug)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Slug parameter is required.'
        ]);
        exit;
    }
    
    // Validate slug format
    if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
        echo json_encode([
            'status' => 'success',
            'is_unique' => false,
            'message' => 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.'
        ]);
        exit;
    }
    
    // Initialize News model and check uniqueness
    $newsModel = new News();
    $isUnique = $newsModel->isSlugUnique($slug, $excludeId);
    
    echo json_encode([
        'status' => 'success',
        'is_unique' => $isUnique,
        'slug' => $slug,
        'message' => $isUnique ? 'Slug is available.' : 'Slug is already taken.'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?> 