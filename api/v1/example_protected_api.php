<?php
/**
 * Example Protected API Endpoint
 * File: api/v1/example_protected_api.php
 * 
 * Đây là ví dụ về cách sử dụng AuthMiddleware để bảo vệ API endpoints
 */

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Include middleware
require_once __DIR__ . '/../core/AuthMiddleware.php';

/**
 * Helper function để gửi JSON response
 */
function sendResponse($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Route handling dựa trên method và path
    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_SERVER['REQUEST_URI'] ?? '/';
    
    switch ($method) {
        case 'GET':
            // Endpoint này yêu cầu authentication (Admin hoặc Editor)
            $user = requireAuth();
            
            // Nếu requireAuth() không trả về false, có nghĩa là user đã được xác thực
            sendResponse(200, [
                'status' => 'success',
                'message' => 'Access granted to protected resource',
                'user' => $user,
                'data' => [
                    'resource_id' => 123,
                    'resource_name' => 'Protected Data',
                    'access_time' => date('Y-m-d H:i:s')
                ]
            ]);
            break;
            
        case 'POST':
            // Endpoint này chỉ cho phép Admin truy cập
            $user = requireAdmin();
            
            // Parse request body
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            sendResponse(200, [
                'status' => 'success',
                'message' => 'Admin-only action completed',
                'user' => $user,
                'received_data' => $data,
                'timestamp' => date('Y-m-d H:i:s')
            ]);
            break;
            
        case 'PUT':
            // Endpoint này dùng AuthMiddleware class trực tiếp
            $middleware = new AuthMiddleware();
            $user = $middleware->requireAuthentication();
            
            if (!$user) {
                // Middleware đã gửi error response, exit
                break;
            }
            
            // Kiểm tra permission cụ thể
            if (!$middleware->checkPermission($user, ['Admin'])) {
                sendResponse(403, [
                    'status' => 'error',
                    'message' => 'Only Admin can perform this action'
                ]);
            }
            
            sendResponse(200, [
                'status' => 'success',
                'message' => 'Resource updated successfully',
                'user' => $user
            ]);
            break;
            
        case 'DELETE':
            // Endpoint này cho phép user xóa resource của chính mình, hoặc Admin xóa bất kỳ
            $user = requireAuth();
            
            // Giả sử resource_id từ URL parameter
            $resourceUserId = 2; // Trong thực tế, lấy từ database dựa trên resource_id
            
            $middleware = new AuthMiddleware();
            if (!$middleware->isOwnerOrAdmin($user, $resourceUserId)) {
                sendResponse(403, [
                    'status' => 'error',
                    'message' => 'You can only delete your own resources'
                ]);
            }
            
            sendResponse(200, [
                'status' => 'success',
                'message' => 'Resource deleted successfully',
                'user' => $user
            ]);
            break;
            
        default:
            sendResponse(405, [
                'status' => 'error',
                'message' => 'Method not allowed'
            ]);
    }
    
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    sendResponse(500, [
        'status' => 'error',
        'message' => 'Internal server error'
    ]);
}

/**
 * CÁCH SỬ DỤNG:
 * 
 * 1. Lấy token từ login API:
 *    POST /api/v1/auth/login.php
 *    {"email": "admin@dseza.gov.vn", "password": "password123"}
 * 
 * 2. Sử dụng token để truy cập protected endpoint:
 *    GET /api/v1/example_protected_api.php
 *    Headers: Authorization: Bearer your_token_here
 * 
 * 3. Test với CURL:
 *    curl -X GET http://localhost/api/v1/example_protected_api.php \
 *      -H "Authorization: Bearer your_token_here"
 * 
 * 4. Test với JavaScript:
 *    fetch('/api/v1/example_protected_api.php', {
 *        headers: {
 *            'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
 *        }
 *    })
 *    .then(response => response.json())
 *    .then(data => console.log(data));
 */
?> 