<?php
/**
 * News Management API
 * File: api/v1/admin/news.php
 * 
 * Endpoints:
 * GET     /api/v1/admin/news         - List news with pagination/filtering
 * POST    /api/v1/admin/news         - Create new news article
 * GET     /api/v1/admin/news/{id}    - Get specific news article
 * PUT     /api/v1/admin/news/{id}    - Update news article
 * DELETE  /api/v1/admin/news/{id}    - Delete news article
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1); // Set to 1 for debugging

// Include required files
require_once __DIR__ . '/../../core/Database.php';
require_once __DIR__ . '/../../core/AuthMiddleware.php';
require_once __DIR__ . '/../../core/News.php';

try {
    // Initialize middleware for authentication
    $authMiddleware = new AuthMiddleware();
    
    // Check authentication for all requests
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
    
    // Initialize News model
    $newsModel = new News();
    
    // Get request method and parse URL
    $method = $_SERVER['REQUEST_METHOD'];
    $requestUri = $_SERVER['REQUEST_URI'];
    
    // Extract path after /api/v1/admin/news
    $basePath = '/final-dseza-landing-85/api/v1/admin/news';
    if (strpos($requestUri, $basePath) === false) {
        // Try alternative base path
        $basePath = '/api/v1/admin/news';
    }
    
    $path = str_replace($basePath, '', parse_url($requestUri, PHP_URL_PATH));
    $pathParts = array_filter(explode('/', $path));
    
    // Get news ID if provided in URL
    $newsId = !empty($pathParts) ? intval($pathParts[0]) : null;
    
    switch ($method) {
        case 'GET':
            if ($newsId) {
                // GET /api/v1/admin/news/{id} - Get specific news article
                $news = $newsModel->getById($newsId);
                
                if ($news) {
                    echo json_encode([
                        'status' => 'success',
                        'data' => $news
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'News article not found.'
                    ]);
                }
            } else {
                // GET /api/v1/admin/news - List news with filters
                $filters = [
                    'page' => intval($_GET['page'] ?? 1),
                    'limit' => min(intval($_GET['limit'] ?? 10), 50), // Max 50 items per page
                    'searchTerm' => $_GET['searchTerm'] ?? '',
                    'categoryId' => !empty($_GET['categoryId']) ? intval($_GET['categoryId']) : null,
                    'status' => $_GET['status'] ?? '',
                    'authorId' => !empty($_GET['authorId']) ? intval($_GET['authorId']) : null,
                    'sortBy' => $_GET['sortBy'] ?? 'publish_date',
                    'sortDirection' => $_GET['sortDirection'] ?? 'DESC'
                ];
                
                // If user is Editor, only show their own articles unless they're viewing published ones
                if ($user['role'] === 'Editor' && empty($filters['status'])) {
                    $filters['authorId'] = $user['user_id'];
                }
                
                $result = $newsModel->getList($filters);
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $result['data'],
                    'pagination' => $result['pagination']
                ]);
            }
            break;
            
        case 'POST':
            if ($newsId) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid request. Use PUT for updates.'
                ]);
                break;
            }
            
            // POST /api/v1/admin/news - Create new news article
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid JSON input.'
                ]);
                break;
            }
            
            // Validate required fields
            $required = ['title', 'content', 'category_id'];
            $missing = [];
            
            foreach ($required as $field) {
                if (empty($input[$field])) {
                    $missing[] = $field;
                }
            }
            
            if (!empty($missing)) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required fields: ' . implode(', ', $missing)
                ]);
                break;
            }
            
            // Set author info from authenticated user
            $input['author_id'] = $user['user_id'];
            $input['author_name'] = $user['full_name'] ?? $user['email'];
            
            // Default status based on user role
            if (empty($input['status'])) {
                $input['status'] = ($user['role'] === 'Admin') ? 'published' : 'pending';
            }
            
            // Only Admin can set status to published directly
            if ($input['status'] === 'published' && $user['role'] !== 'Admin') {
                $input['status'] = 'pending';
            }
            
            try {
                $newArticle = $newsModel->create($input);
                
                if ($newArticle) {
                    http_response_code(201);
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'News article created successfully.',
                        'data' => $newArticle
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Failed to create news article.'
                    ]);
                }
            } catch (Exception $e) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ]);
            }
            break;
            
        case 'PUT':
            if (!$newsId) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'News ID is required for updates.'
                ]);
                break;
            }
            
            // PUT /api/v1/admin/news/{id} - Update news article
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid JSON input.'
                ]);
                break;
            }
            
            // Check if article exists and get current data
            $existingArticle = $newsModel->getById($newsId);
            if (!$existingArticle) {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'News article not found.'
                ]);
                break;
            }
            
            // Check permissions: Editor can only edit their own articles
            if ($user['role'] === 'Editor' && $existingArticle['author_id'] != $user['user_id']) {
                http_response_code(403);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'You can only edit your own articles.'
                ]);
                break;
            }
            
            // Only Admin can change status to published
            if (isset($input['status']) && $input['status'] === 'published' && $user['role'] !== 'Admin') {
                unset($input['status']);
            }
            
            try {
                $updatedArticle = $newsModel->update($newsId, $input);
                
                if ($updatedArticle) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'News article updated successfully.',
                        'data' => $updatedArticle
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Failed to update news article.'
                    ]);
                }
            } catch (Exception $e) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ]);
            }
            break;
            
        case 'DELETE':
            if (!$newsId) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'News ID is required for deletion.'
                ]);
                break;
            }
            
            // DELETE /api/v1/admin/news/{id} - Delete news article
            $existingArticle = $newsModel->getById($newsId);
            if (!$existingArticle) {
                http_response_code(404);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'News article not found.'
                ]);
                break;
            }
            
            // Check permissions: Only Admin or article author can delete
            if ($user['role'] !== 'Admin' && $existingArticle['author_id'] != $user['user_id']) {
                http_response_code(403);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'You can only delete your own articles.'
                ]);
                break;
            }
            
            $success = $newsModel->delete($newsId);
            
            if ($success) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'News article deleted successfully.'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to delete news article.'
                ]);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode([
                'status' => 'error',
                'message' => 'Method not allowed.'
            ]);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?> 