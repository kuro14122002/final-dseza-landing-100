<?php
/**
 * API Endpoint: /api/v1/stats/overview
 * Purpose: Cung cấp dữ liệu thống kê tổng quan cho Admin Dashboard
 * Method: GET
 * Authentication: Required (JWT Token)
 * Access Level: Admin/Editor
 */

// Set response headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Only GET requests are accepted.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    // Include required files
    require_once __DIR__ . '/../../core/Database.php';
    require_once __DIR__ . '/../../core/AuthMiddleware.php';

    // Initialize authentication middleware
    $authMiddleware = new AuthMiddleware();
    
    // Authenticate user - allow both Admin and Editor roles
    $currentUser = $authMiddleware->requireAuthentication();
    
    if (!$currentUser) {
        // Response already sent by middleware
        exit();
    }

    // Get database instance
    $database = Database::getInstance();
    $db = $database->getConnection();

    // Initialize statistics array
    $stats = [
        'totalNews' => 0,
        'totalEvents' => 0,
        'totalViewsThisMonth' => 15200, // Mock data - sẽ được thay thế bằng logic thực tế sau
        'activeUsersThisMonth' => 1200  // Mock data - sẽ được thay thế bằng logic thực tế sau
    ];

    // Get total news count
    try {
        $newsQuery = "SELECT COUNT(*) as total FROM news_articles";
        $newsResult = $database->fetchOne($newsQuery);
        $stats['totalNews'] = (int) $newsResult['total'];
    } catch (Exception $e) {
        // Bảng news_articles có thể chưa tồn tại
        error_log("Warning: news_articles table not found or query failed: " . $e->getMessage());
        $stats['totalNews'] = 0;
    }

    // Get total events count
    try {
        $eventsQuery = "SELECT COUNT(*) as total FROM event_articles";
        $eventsResult = $database->fetchOne($eventsQuery);
        $stats['totalEvents'] = (int) $eventsResult['total'];
    } catch (Exception $e) {
        // Bảng event_articles có thể chưa tồn tại
        error_log("Warning: event_articles table not found or query failed: " . $e->getMessage());
        $stats['totalEvents'] = 0;
    }

    // TODO: Triển khai logic thực tế cho views và active users
    // Hiện tại sử dụng dữ liệu giả lập như yêu cầu
    
    // Optional: Có thể thêm logic tính toán lượt xem thực tế từ bảng page_views
    /*
    try {
        $currentMonth = date('Y-m');
        $viewsQuery = "SELECT COUNT(*) as total FROM page_views 
                      WHERE DATE_FORMAT(view_timestamp, '%Y-%m') = ?";
        $viewsResult = $database->fetchOne($viewsQuery, [$currentMonth]);
        $stats['totalViewsThisMonth'] = (int) $viewsResult['total'];
    } catch (Exception $e) {
        // Giữ nguyên giá trị mock nếu bảng chưa có
        error_log("Info: page_views tracking not implemented yet: " . $e->getMessage());
    }
    */

    // Optional: Có thể thêm logic tính toán active users từ log đăng nhập
    /*
    try {
        $currentMonth = date('Y-m');
        $activeUsersQuery = "SELECT COUNT(DISTINCT user_id) as total FROM user_login_logs 
                            WHERE DATE_FORMAT(login_time, '%Y-%m') = ?";
        $activeUsersResult = $database->fetchOne($activeUsersQuery, [$currentMonth]);
        $stats['activeUsersThisMonth'] = (int) $activeUsersResult['total'];
    } catch (Exception $e) {
        // Giữ nguyên giá trị mock nếu bảng chưa có
        error_log("Info: user activity tracking not implemented yet: " . $e->getMessage());
    }
    */

    // Thêm metadata về user hiện tại vào response (để debug/logging)
    $responseData = [
        'status' => 'success',
        'data' => $stats,
        'meta' => [
            'generated_at' => date('c'),
            'generated_by' => $currentUser['email'],
            'user_role' => $currentUser['role']
        ]
    ];

    // Return success response
    http_response_code(200);
    echo json_encode($responseData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    // Log error
    error_log("Stats API Error: " . $e->getMessage());
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'An internal server error occurred while fetching statistics.',
        'debug' => [
            'timestamp' => date('c'),
            'error_message' => $e->getMessage()
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?> 