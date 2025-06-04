<?php

/**
 * Authentication Middleware cho DSEZA Admin API
 * File: api/core/AuthMiddleware.php
 * 
 * Middleware này kiểm tra JWT token trong request header
 * và xác thực người dùng trước khi cho phép truy cập các API được bảo vệ
 */

require_once __DIR__ . '/AuthHelper.php';
require_once __DIR__ . '/User.php';

class AuthMiddleware
{
    private $authHelper;
    private $userModel;

    public function __construct()
    {
        $this->authHelper = new AuthHelper();
        $this->userModel = new User();
    }

    /**
     * Kiểm tra và xác thực JWT token
     * 
     * @return array|false Trả về thông tin user nếu hợp lệ, false nếu không
     */
    public function authenticate()
    {
        try {
            // Lấy token từ header
            $token = $this->authHelper->extractTokenFromHeader();
            
            if (!$token) {
                $this->sendUnauthorizedResponse('Authorization header missing or invalid format.');
                return false;
            }

            // Xác thực token
            $decoded = $this->authHelper->verifyToken($token);
            
            if (!$decoded) {
                $this->sendUnauthorizedResponse('Invalid or expired token.');
                return false;
            }

            // Kiểm tra user còn tồn tại và active trong database
            $user = $this->userModel->findById($decoded['user_id']);
            
            if (!$user) {
                $this->sendUnauthorizedResponse('User not found.');
                return false;
            }

            if (!$this->userModel->isActive($user)) {
                $this->sendUnauthorizedResponse('User account is inactive.');
                return false;
            }

            // Trả về thông tin user từ token
            return [
                'id' => $decoded['user_id'],
                'email' => $decoded['email'],
                'role' => $decoded['role'],
                'full_name' => $decoded['full_name'] ?? null
            ];

        } catch (Exception $e) {
            error_log("Authentication error: " . $e->getMessage());
            $this->sendUnauthorizedResponse('Authentication failed.');
            return false;
        }
    }

    /**
     * Kiểm tra quyền truy cập dựa trên role
     * 
     * @param array $user Thông tin user
     * @param array $allowedRoles Các role được phép truy cập
     * @return bool
     */
    public function checkPermission($user, $allowedRoles = ['Admin', 'Editor'])
    {
        if (!$user || !isset($user['role'])) {
            return false;
        }

        return in_array($user['role'], $allowedRoles);
    }

    /**
     * Middleware chỉ cho phép Admin truy cập
     * 
     * @return array|false
     */
    public function requireAdmin()
    {
        $user = $this->authenticate();
        
        if (!$user) {
            return false;
        }

        if (!$this->checkPermission($user, ['Admin'])) {
            $this->sendForbiddenResponse('Admin access required.');
            return false;
        }

        return $user;
    }

    /**
     * Middleware cho phép cả Admin và Editor truy cập
     * 
     * @return array|false
     */
    public function requireAuthentication()
    {
        return $this->authenticate();
    }

    /**
     * Gửi response 401 Unauthorized
     */
    private function sendUnauthorizedResponse($message = 'Unauthorized')
    {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => $message,
            'code' => 401
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Gửi response 403 Forbidden
     */
    private function sendForbiddenResponse($message = 'Access denied')
    {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => $message,
            'code' => 403
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Utility method để lấy current user mà không bắt buộc authentication
     * Trả về null nếu không có token hoặc token không hợp lệ
     * 
     * @return array|null
     */
    public function getCurrentUser()
    {
        try {
            return $this->authHelper->getCurrentUser();
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Kiểm tra xem user hiện tại có phải là owner của resource không
     * 
     * @param array $user Thông tin user
     * @param int $resourceUserId ID của user sở hữu resource
     * @return bool
     */
    public function isOwnerOrAdmin($user, $resourceUserId)
    {
        if (!$user) {
            return false;
        }

        // Admin có thể truy cập tất cả
        if ($user['role'] === 'Admin') {
            return true;
        }

        // User chỉ có thể truy cập resource của chính mình
        return $user['id'] == $resourceUserId;
    }
}

/**
 * Helper functions để sử dụng nhanh trong các API endpoints
 */

/**
 * Yêu cầu authentication và trả về user info
 * 
 * @return array User information
 */
function requireAuth() {
    $middleware = new AuthMiddleware();
    return $middleware->requireAuthentication();
}

/**
 * Yêu cầu Admin permission
 * 
 * @return array User information
 */
function requireAdmin() {
    $middleware = new AuthMiddleware();
    return $middleware->requireAdmin();
}

/**
 * Lấy current user (không bắt buộc authentication)
 * 
 * @return array|null User information hoặc null
 */
function getCurrentUser() {
    $middleware = new AuthMiddleware();
    return $middleware->getCurrentUser();
}

?> 