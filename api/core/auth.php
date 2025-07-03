<?php
// api/core/auth.php
// Authentication and JWT handling

require_once __DIR__ . '/../config/database.php';

class Auth {
    private $secret_key = "dseza_portal_jwt_secret_key_2025";
    private $algorithm = 'HS256';
    private $db;
    
    public function __construct() {
        $this->db = getDatabase();
    }
    
    // Generate JWT token
    public function generateToken($userId, $username, $role) {
        $header = json_encode(['typ' => 'JWT', 'alg' => $this->algorithm]);
        $payload = json_encode([
            'user_id' => $userId,
            'username' => $username,
            'role' => $role,
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ]);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secret_key, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    // Verify JWT token
    public function verifyToken($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }
        
        list($header, $payload, $signature) = $parts;
        
        // Verify signature
        $expectedSignature = hash_hmac('sha256', $header . "." . $payload, $this->secret_key, true);
        $expectedBase64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));
        
        if ($signature !== $expectedBase64Signature) {
            return false;
        }
        
        // Decode and verify payload
        $decodedPayload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
        
        if (!$decodedPayload || $decodedPayload['exp'] < time()) {
            return false;
        }
        
        return $decodedPayload;
    }
    
    // Get token from request headers
    public function getTokenFromRequest() {
        // Try to get Authorization header using $_SERVER (more reliable)
        $authHeader = null;
        
        // Check for Authorization header in various formats
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        } elseif (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            }
        } elseif (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            }
        }
        
        if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            return $token;
        }
        return null;
    }
    
    // Authenticate user - support both username and email
    public function authenticate($identifier, $password) {
        try {
            $sql = "SELECT id, username, email, password_hash, role, is_active FROM users WHERE (username = ? OR email = ?) AND is_active = 1";
            $stmt = $this->db->query($sql, [$identifier, $identifier]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password_hash'])) {
                return [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ];
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Authentication error: " . $e->getMessage());
            return false;
        }
    }
    
    // Get current user from token
    public function getCurrentUser() {
        $token = $this->getTokenFromRequest();
        if (!$token) {
            return null;
        }
        
        $payload = $this->verifyToken($token);
        if (!$payload) {
            return null;
        }
        
        try {
            $sql = "SELECT id, username, email, role, is_active, created_at FROM users WHERE id = ? AND is_active = 1";
            $stmt = $this->db->query($sql, [$payload['user_id']]);
            $user = $stmt->fetch();
            
            // Add default values for missing columns
            if ($user) {
                $user['full_name'] = null;
                $user['avatar'] = null;
                $user['updated_at'] = null;
            }
            
            return $user;
        } catch (Exception $e) {
            error_log("Database error in getCurrentUser: " . $e->getMessage());
            return null;
        }
    }
    
    // Check if user has required role
    public function hasRole($requiredRole) {
        $user = $this->getCurrentUser();
        if (!$user) {
            return false;
        }
        
        $roles = ['editor', 'admin'];
        $userRoleIndex = array_search($user['role'], $roles);
        $requiredRoleIndex = array_search($requiredRole, $roles);
        
        return $userRoleIndex !== false && $userRoleIndex >= $requiredRoleIndex;
    }
}

// Middleware function to protect routes
function requireAuth($role = 'editor') {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    if (!$user) {
        sendErrorResponse('Authentication required', 401);
        exit;
    }
    
    if (!$auth->hasRole($role)) {
        sendErrorResponse('Insufficient permissions', 403);
        exit;
    }
    
    // Store user in global variable for use in controllers
    $GLOBALS['current_user'] = $user;
}

// Middleware function for optional auth
function optionalAuth() {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    if ($user) {
        $GLOBALS['current_user'] = $user;
    }
}
?> 