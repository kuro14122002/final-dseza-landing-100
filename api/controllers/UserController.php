<?php
// api/controllers/UserController.php
// User Controller for handling user management operations

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../core/auth.php';

class UserController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new User();
    }
    
    // GET /api/users - Get all users with pagination and search
    public function index() {
        try {
            // Require admin authentication
            requireAuth('admin');
            
            // Get query parameters
            $params = [
                'page' => $_GET['page'] ?? 1,
                'limit' => $_GET['limit'] ?? 10,
                'search' => $_GET['search'] ?? '',
                'role' => $_GET['role'] ?? '',
                'status' => $_GET['status'] ?? '',
                'sortBy' => $_GET['sortBy'] ?? 'created_at',
                'sortDirection' => $_GET['sortDirection'] ?? 'DESC'
            ];
            
            $result = $this->userModel->getAll($params);
            
            sendSuccessResponse($result, 'Users retrieved successfully');
            
        } catch (Exception $e) {
            sendErrorResponse($e->getMessage(), 500);
        }
    }
    
    // GET /api/users/{id} - Get user by ID
    public function show($id) {
        try {
            requireAuth('admin');
            
            if (!is_numeric($id)) {
                sendErrorResponse('Invalid user ID', 400);
                return;
            }
            
            $user = $this->userModel->getById($id);
            
            if (!$user) {
                sendErrorResponse('User not found', 404);
                return;
            }
            
            sendSuccessResponse($user, 'User retrieved successfully');
            
        } catch (Exception $e) {
            sendErrorResponse($e->getMessage(), 500);
        }
    }
    
    // POST /api/users - Create new user
    public function store() {
        try {
            requireAuth('admin');
            
            $data = getRequestBody();
            
            // Validate required fields
            $requiredFields = ['username', 'email', 'password'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty(trim($data[$field]))) {
                    sendErrorResponse("Field '$field' is required", 400);
                    return;
                }
            }
            
            // Validate input data
            $validationErrors = $this->validateUserData($data);
            if (!empty($validationErrors)) {
                sendErrorResponse('Validation failed', 400, $validationErrors);
                return;
            }
            
            // Check if username already exists
            if ($this->userModel->usernameExists($data['username'])) {
                sendErrorResponse('Username already exists', 400);
                return;
            }
            
            // Check if email already exists
            if ($this->userModel->emailExists($data['email'])) {
                sendErrorResponse('Email already exists', 400);
                return;
            }
            
            // Sanitize and prepare data
            $userData = [
                'username' => trim($data['username']),
                'email' => trim($data['email']),
                'password' => $data['password'],
                'role' => isset($data['role']) ? trim($data['role']) : 'editor',
                'is_active' => isset($data['is_active']) ? (bool)$data['is_active'] : true,
                'full_name' => isset($data['full_name']) ? trim($data['full_name']) : null
            ];
            
            $user = $this->userModel->create($userData);
            
            sendSuccessResponse($user, 'User created successfully', 201);
            
        } catch (Exception $e) {
            sendErrorResponse($e->getMessage(), 500);
        }
    }
    
    // PUT /api/users/{id} - Update user
    public function update($id) {
        try {
            requireAuth('admin');
            
            if (!is_numeric($id)) {
                sendErrorResponse('Invalid user ID', 400);
                return;
            }
            
            $data = getRequestBody();
            
            if (empty($data)) {
                sendErrorResponse('No data provided for update', 400);
                return;
            }
            
            // Check if user exists
            $existingUser = $this->userModel->getById($id);
            if (!$existingUser) {
                sendErrorResponse('User not found', 404);
                return;
            }
            
            // Get current user ID for permission checks
            $currentUserId = isset($GLOBALS['current_user']) ? $GLOBALS['current_user']['id'] : null;
            
            // Validate input data (excluding password for updates)
            $validationErrors = $this->validateUserData($data, true, $id);
            if (!empty($validationErrors)) {
                sendErrorResponse('Validation failed', 400, $validationErrors);
                return;
            }
            
            // Check username uniqueness if being updated
            if (isset($data['username']) && $this->userModel->usernameExists($data['username'], $id)) {
                sendErrorResponse('Username already exists', 400);
                return;
            }
            
            // Check email uniqueness if being updated
            if (isset($data['email']) && $this->userModel->emailExists($data['email'], $id)) {
                sendErrorResponse('Email already exists', 400);
                return;
            }
            
            // Prepare update data (exclude password from general updates)
            $updateData = [];
            $allowedFields = ['username', 'email', 'role', 'is_active', 'full_name', 'avatar'];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateData[$field] = $field === 'is_active' ? (bool)$data[$field] : trim($data[$field]);
                }
            }
            
            if (empty($updateData)) {
                sendErrorResponse('No valid fields provided for update', 400);
                return;
            }
            
            $user = $this->userModel->update($id, $updateData, $currentUserId);
            
            sendSuccessResponse($user, 'User updated successfully');
            
        } catch (Exception $e) {
            sendErrorResponse($e->getMessage(), 500);
        }
    }
    
    // DELETE /api/users/{id} - Delete user
    public function destroy($id) {
        try {
            requireAuth('admin');
            
            if (!is_numeric($id)) {
                sendErrorResponse('Invalid user ID', 400);
                return;
            }
            
            // Get current user ID for permission checks
            $currentUserId = isset($GLOBALS['current_user']) ? $GLOBALS['current_user']['id'] : null;
            
            $success = $this->userModel->delete($id, $currentUserId);
            
            if ($success) {
                sendSuccessResponse(null, 'User deleted successfully');
            } else {
                sendErrorResponse('Failed to delete user', 500);
            }
            
        } catch (Exception $e) {
            sendErrorResponse($e->getMessage(), 400);
        }
    }
    
    // PUT /api/users/{id}/toggle - Toggle user status
    public function toggleStatus($id) {
        try {
            requireAuth('admin');
            
            if (!is_numeric($id)) {
                sendErrorResponse('Invalid user ID', 400);
                return;
            }
            
            // Get current user ID for permission checks
            $currentUserId = isset($GLOBALS['current_user']) ? $GLOBALS['current_user']['id'] : null;
            
            $user = $this->userModel->toggleStatus($id, $currentUserId);
            
            sendSuccessResponse($user, 'User status updated successfully');
            
        } catch (Exception $e) {
            sendErrorResponse($e->getMessage(), 400);
        }
    }
    
    // GET /api/users/stats - Get user statistics
    public function stats() {
        try {
            requireAuth('admin');
            
            $stats = $this->userModel->getStats();
            
            sendSuccessResponse($stats, 'User statistics retrieved successfully');
            
        } catch (Exception $e) {
            sendErrorResponse($e->getMessage(), 500);
        }
    }
    
    // PUT /api/users/{id}/password - Change user password
    public function changePassword($id) {
        try {
            requireAuth('admin');
            
            if (!is_numeric($id)) {
                sendErrorResponse('Invalid user ID', 400);
                return;
            }
            
            $data = getRequestBody();
            
            if (!isset($data['password']) || empty(trim($data['password']))) {
                sendErrorResponse('Password is required', 400);
                return;
            }
            
            // Validate password
            $password = trim($data['password']);
            if (strlen($password) < 6) {
                sendErrorResponse('Password must be at least 6 characters long', 400);
                return;
            }
            
            // Get current user ID for permission checks
            $currentUserId = isset($GLOBALS['current_user']) ? $GLOBALS['current_user']['id'] : null;
            
            $user = $this->userModel->update($id, ['password' => $password], $currentUserId);
            
            if ($user) {
                sendSuccessResponse(null, 'Password updated successfully');
            } else {
                sendErrorResponse('User not found', 404);
            }
            
        } catch (Exception $e) {
            sendErrorResponse($e->getMessage(), 500);
        }
    }
    
    // Private helper method to validate user data
    private function validateUserData($data, $isUpdate = false, $excludeId = null) {
        $errors = [];
        
        // Validate username
        if (isset($data['username'])) {
            $username = trim($data['username']);
            if (empty($username)) {
                $errors['username'] = 'Username is required';
            } elseif (!preg_match('/^[a-zA-Z0-9_-]+$/', $username)) {
                $errors['username'] = 'Username can only contain letters, numbers, hyphens and underscores';
            } elseif (strlen($username) < 3 || strlen($username) > 50) {
                $errors['username'] = 'Username must be between 3 and 50 characters';
            }
        }
        
        // Validate email
        if (isset($data['email'])) {
            $email = trim($data['email']);
            if (empty($email)) {
                $errors['email'] = 'Email is required';
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'Invalid email format';
            }
        }
        
        // Validate password (only for create operations)
        if (!$isUpdate && isset($data['password'])) {
            $password = $data['password'];
            if (strlen($password) < 6) {
                $errors['password'] = 'Password must be at least 6 characters long';
            }
        }
        
        // Validate role
        if (isset($data['role'])) {
            $validRoles = ['admin', 'editor'];
            if (!in_array($data['role'], $validRoles)) {
                $errors['role'] = 'Invalid role. Must be one of: ' . implode(', ', $validRoles);
            }
        }
        
        // Validate full_name
        if (isset($data['full_name']) && !empty($data['full_name'])) {
            if (strlen(trim($data['full_name'])) > 100) {
                $errors['full_name'] = 'Full name must not exceed 100 characters';
            }
        }
        
        return $errors;
    }
}
?>
