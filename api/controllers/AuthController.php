<?php
// api/controllers/AuthController.php
// Authentication controller for handling auth API endpoints

require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/router.php';
require_once __DIR__ . '/../models/User.php';

class AuthController {
    private $auth;
    private $userModel;
    
    public function __construct() {
        $this->auth = new Auth();
        $this->userModel = new User();
    }
    
    // POST /api/auth/login - User login
    public function login() {
        try {
            $data = getRequestBody();
            
            // Validate required fields - support both username and email
            $identifier = null;
            if (isset($data['username'])) {
                $identifier = trim($data['username']);
            } elseif (isset($data['email'])) {
                $identifier = trim($data['email']);
            }
            
            if (!$identifier || !isset($data['password'])) {
                sendErrorResponse('Username/email and password are required', 400);
                return;
            }
            
            $username = $identifier;
            $password = trim($data['password']);
            
            if (empty($username) || empty($password)) {
                sendErrorResponse('Username and password cannot be empty', 400);
                return;
            }
            
            // Authenticate user
            $user = $this->auth->authenticate($username, $password);
            
            if (!$user) {
                sendErrorResponse('Invalid username or password', 401);
                return;
            }
            
            // Generate JWT token
            $token = $this->auth->generateToken($user['id'], $user['username'], $user['role']);
            
            sendSuccessResponse([
                'token' => $token,
                'expiresIn' => 24 * 60 * 60, // 24 hours in seconds
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ], 'Login successful');
            
        } catch (Exception $e) {
            sendErrorResponse('Login failed', 500, $e->getMessage());
        }
    }
    
    // GET /api/auth/me - Get current user info
    public function me() {
        requireAuth();
        
        try {
            $user = $GLOBALS['current_user'];
            
            sendSuccessResponse([
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
                'is_active' => $user['is_active'],
                'full_name' => $user['full_name'] ?? null,
                'avatar' => $user['avatar'] ?? null,
                'created_at' => $user['created_at'],
                'updated_at' => $user['updated_at'] ?? null
            ]);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get user info', 500, $e->getMessage());
        }
    }
    
    // POST /api/auth/verify - Verify token
    public function verify() {
        try {
            $data = getRequestBody();
            
            if (!isset($data['token'])) {
                sendErrorResponse('Token is required', 400);
                return;
            }
            
            $payload = $this->auth->verifyToken($data['token']);
            
            if (!$payload) {
                sendErrorResponse('Invalid or expired token', 401);
                return;
            }
            
            sendSuccessResponse([
                'valid' => true,
                'payload' => $payload
            ], 'Token is valid');
            
        } catch (Exception $e) {
            sendErrorResponse('Token verification failed', 500, $e->getMessage());
        }
    }
    
    // POST /api/auth/refresh - Refresh token
    public function refresh() {
        requireAuth();
        
        try {
            $user = $GLOBALS['current_user'];
            
            // Generate new token
            $token = $this->auth->generateToken($user['id'], $user['username'], $user['role']);
            
            sendSuccessResponse([
                'token' => $token,
                'expiresIn' => 24 * 60 * 60 // 24 hours in seconds
            ], 'Token refreshed successfully');
            
        } catch (Exception $e) {
            sendErrorResponse('Token refresh failed', 500, $e->getMessage());
        }
    }
    
    // POST /api/auth/logout - Logout (optional, mostly for frontend state)
    public function logout() {
        // Since JWT is stateless, logout is mainly handled on frontend
        // Here we can add token blacklisting if needed in the future
        
        sendSuccessResponse(null, 'Logged out successfully');
    }
    
    // PUT /api/user/profile - Update user profile
    public function updateProfile() {
        requireAuth();
        
        try {
            $user = $GLOBALS['current_user'];
            $userId = $user['id'];
            
            $data = getRequestBody();
            
            // Validate input data
            if (!$data) {
                sendErrorResponse('No data provided', 400);
                return;
            }
            
            $updateData = [];
            
            // Process fullName field
            if (isset($data['fullName'])) {
                $fullName = trim($data['fullName']);
                if (empty($fullName)) {
                    sendErrorResponse('Full name cannot be empty', 400);
                    return;
                }
                $updateData['full_name'] = $fullName;
            }
            
            // Process avatar field
            if (isset($data['avatar'])) {
                $avatar = trim($data['avatar']);
                // Avatar can be empty (user can remove avatar)
                $updateData['avatar'] = $avatar;
            }
            
            // Check if there's anything to update
            if (empty($updateData)) {
                sendErrorResponse('No valid fields to update', 400);
                return;
            }
            
            // Update user profile
            $updatedUser = $this->userModel->update($userId, $updateData);
            
            if (!$updatedUser) {
                sendErrorResponse('Failed to update profile', 500);
                return;
            }
            
            // Return updated user info (excluding sensitive data)
            sendSuccessResponse([
                'id' => $updatedUser['id'],
                'username' => $updatedUser['username'],
                'email' => $updatedUser['email'],
                'role' => $updatedUser['role'],
                'full_name' => $updatedUser['full_name'] ?? null,
                'avatar' => $updatedUser['avatar'] ?? null,
                'updated_at' => $updatedUser['updated_at'] ?? null
            ], 'Profile updated successfully');
            
        } catch (Exception $e) {
            error_log("Profile update error: " . $e->getMessage());
            sendErrorResponse('Failed to update profile', 500, $e->getMessage());
        }
    }
    
    // PUT /api/user/change-password - Change user password
    public function changePassword() {
        requireAuth();
        
        try {
            $user = $GLOBALS['current_user'];
            $userId = $user['id'];
            
            $data = getRequestBody();
            
            // Validate required fields
            if (!isset($data['currentPassword']) || !isset($data['newPassword']) || !isset($data['confirmPassword'])) {
                sendErrorResponse('Current password, new password, and confirm password are required', 400);
                return;
            }
            
            $currentPassword = trim($data['currentPassword']);
            $newPassword = trim($data['newPassword']);
            $confirmPassword = trim($data['confirmPassword']);
            
            // Check if fields are not empty
            if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
                sendErrorResponse('All password fields cannot be empty', 400);
                return;
            }
            
            // Check if new password and confirm password match
            if ($newPassword !== $confirmPassword) {
                sendErrorResponse('New password and confirm password do not match', 400);
                return;
            }
            
            // Check new password strength (minimum 6 characters)
            if (strlen($newPassword) < 6) {
                sendErrorResponse('New password must be at least 6 characters long', 400);
                return;
            }
            
            // Get user with password hash from database
            $userWithPassword = $this->userModel->getByUsernameWithPassword($userId);
            
            if (!$userWithPassword) {
                sendErrorResponse('User not found', 404);
                return;
            }
            
            // Verify current password
            if (!password_verify($currentPassword, $userWithPassword['password_hash'])) {
                sendErrorResponse('Current password is incorrect', 401);
                return;
            }
            
            // Check if new password is different from current password
            if (password_verify($newPassword, $userWithPassword['password_hash'])) {
                sendErrorResponse('New password must be different from current password', 400);
                return;
            }
            
            // Update password in database
            $updateResult = $this->userModel->update($userId, [
                'password' => $newPassword
            ]);
            
            if (!$updateResult) {
                sendErrorResponse('Failed to update password', 500);
                return;
            }
            
            sendSuccessResponse(null, 'Password changed successfully');
            
        } catch (Exception $e) {
            error_log("Password change error: " . $e->getMessage());
            sendErrorResponse('Failed to change password', 500, $e->getMessage());
        }
    }
}
?> 