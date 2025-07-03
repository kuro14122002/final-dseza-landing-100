<?php
// api/models/User.php
// User model for handling admin users database operations

require_once __DIR__ . '/../config/database.php';

class User {
    private $db;
    
    public function __construct() {
        $this->db = getDatabase();
    }
    
    // Get all users with pagination and search
    public function getAll($params = []) {
        try {
            $page = isset($params['page']) ? max(1, intval($params['page'])) : 1;
            $limit = isset($params['limit']) ? max(1, min(100, intval($params['limit']))) : 10;
            $search = isset($params['search']) ? trim($params['search']) : '';
            $role = isset($params['role']) ? trim($params['role']) : '';
            $status = isset($params['status']) ? trim($params['status']) : '';
            $sortBy = isset($params['sortBy']) ? $params['sortBy'] : 'created_at';
            $sortDirection = isset($params['sortDirection']) && strtoupper($params['sortDirection']) === 'ASC' ? 'ASC' : 'DESC';
            
            $offset = ($page - 1) * $limit;
            
            // Build WHERE conditions
            $whereConditions = [];
            $whereParams = [];
            
            if (!empty($search)) {
                $whereConditions[] = "(username LIKE ? OR email LIKE ? OR full_name LIKE ?)";
                $searchTerm = "%$search%";
                $whereParams[] = $searchTerm;
                $whereParams[] = $searchTerm;
                $whereParams[] = $searchTerm;
            }
            
            if (!empty($role)) {
                $whereConditions[] = "role = ?";
                $whereParams[] = $role;
            }
            
            if ($status !== '') {
                if ($status === 'active') {
                    $whereConditions[] = "is_active = 1";
                } elseif ($status === 'inactive') {
                    $whereConditions[] = "is_active = 0";
                }
            }
            
            $whereClause = '';
            if (!empty($whereConditions)) {
                $whereClause = ' WHERE ' . implode(' AND ', $whereConditions);
            }
            
            // Validate sort column
            $allowedSortColumns = ['id', 'username', 'email', 'role', 'full_name', 'is_active', 'created_at', 'updated_at'];
            if (!in_array($sortBy, $allowedSortColumns)) {
                $sortBy = 'created_at';
            }
            
            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM users" . $whereClause;
            $countStmt = $this->db->query($countSql, $whereParams);
            $totalCount = $countStmt->fetch()['total'];
            
            // Get users data
            $sql = "SELECT id, username, email, role, is_active, full_name, avatar, created_at, updated_at 
                    FROM users" . $whereClause . " 
                    ORDER BY $sortBy $sortDirection 
                    LIMIT ? OFFSET ?";
            
            $params = array_merge($whereParams, [$limit, $offset]);
            $stmt = $this->db->query($sql, $params);
            $users = $stmt->fetchAll();
            
            return [
                'data' => $users,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => intval($totalCount),
                    'totalPages' => ceil($totalCount / $limit),
                    'hasNext' => $page < ceil($totalCount / $limit),
                    'hasPrev' => $page > 1
                ]
            ];
            
        } catch (Exception $e) {
            error_log("Error getting all users: " . $e->getMessage());
            throw new Exception("Failed to get users list");
        }
    }
    
    // Get user by username or email
    public function getByUsername($identifier) {
        try {
            $sql = "SELECT id, username, email, password_hash, role, is_active, full_name, avatar, created_at, updated_at FROM users WHERE username = ? OR email = ?";
            $stmt = $this->db->query($sql, [$identifier, $identifier]);
            return $stmt->fetch();
        } catch (Exception $e) {
            error_log("Error getting user by username/email: " . $e->getMessage());
            return false;
        }
    }
    
    // Get user by ID
    public function getById($id) {
        try {
            $sql = "SELECT id, username, email, role, is_active, full_name, avatar, created_at, updated_at FROM users WHERE id = ?";
            $stmt = $this->db->query($sql, [$id]);
            return $stmt->fetch();
        } catch (Exception $e) {
            error_log("Error getting user by ID: " . $e->getMessage());
            return false;
        }
    }
    
    // Get user by ID with password hash (for password change functionality)
    public function getByUsernameWithPassword($id) {
        try {
            $sql = "SELECT id, username, email, password_hash, role, is_active FROM users WHERE id = ?";
            $stmt = $this->db->query($sql, [$id]);
            return $stmt->fetch();
        } catch (Exception $e) {
            error_log("Error getting user with password by ID: " . $e->getMessage());
            return false;
        }
    }
    
    // Create new user
    public function create($data) {
        try {
            $sql = "INSERT INTO users (username, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)";
            $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
            
            $stmt = $this->db->query($sql, [
                $data['username'],
                $data['email'],
                $passwordHash,
                $data['role'] ?? 'editor',
                $data['is_active'] ?? true
            ]);
            
            $userId = $this->db->lastInsertId();
            return $this->getById($userId);
            
        } catch (Exception $e) {
            error_log("Error creating user: " . $e->getMessage());
            throw new Exception("Failed to create user");
        }
    }
    
    // Check if user is super admin
    public function isSuperAdmin($userId) {
        try {
            $user = $this->getById($userId);
            return $user && $user['username'] === 'admin' && $user['role'] === 'admin';
        } catch (Exception $e) {
            return false;
        }
    }
    
    // Update user
    public function update($id, $data, $currentUserId = null) {
        try {
            // Get the user being updated
            $targetUser = $this->getById($id);
            if (!$targetUser) {
                throw new Exception("User not found");
            }
            
            // Get current user info to check permissions
            $currentUser = null;
            if ($currentUserId) {
                $currentUser = $this->getById($currentUserId);
            }
            
            // Protect super admin username from being changed
            if ($targetUser['username'] === 'admin' && isset($data['username']) && $data['username'] !== 'admin') {
                throw new Exception("Cannot change super admin username");
            }
            
            // Role change restrictions
            if (isset($data['role'])) {
                // Cannot change super admin role
                if ($targetUser['username'] === 'admin') {
                    throw new Exception("Cannot change super admin role");
                }
                
                // Only super admin can change roles of other admins
                if ($targetUser['role'] === 'admin') {
                    if (!$currentUser || $currentUser['username'] !== 'admin') {
                        throw new Exception("Only super admin can change admin user roles");
                    }
                }
            }
            
            $fields = [];
            $params = [];
            
            if (isset($data['username'])) {
                $fields[] = "username = ?";
                $params[] = $data['username'];
            }
            
            if (isset($data['email'])) {
                $fields[] = "email = ?";
                $params[] = $data['email'];
            }
            
            if (isset($data['password'])) {
                $fields[] = "password_hash = ?";
                $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
            }
            
            if (isset($data['role'])) {
                $fields[] = "role = ?";
                $params[] = $data['role'];
            }
            
            if (isset($data['is_active'])) {
                $fields[] = "is_active = ?";
                $params[] = $data['is_active'];
            }
            
            if (isset($data['full_name'])) {
                $fields[] = "full_name = ?";
                $params[] = $data['full_name'];
            }
            
            if (isset($data['avatar'])) {
                $fields[] = "avatar = ?";
                $params[] = $data['avatar'];
            }
            
            if (empty($fields)) {
                return $this->getById($id);
            }
            
            $fields[] = "updated_at = CURRENT_TIMESTAMP";
            $params[] = $id;
            
            $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $this->db->query($sql, $params);
            
            return $this->getById($id);
            
        } catch (Exception $e) {
            error_log("Error updating user: " . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }
    
    // Verify password - support both username and email
    public function verifyPassword($identifier, $password) {
        $user = $this->getByUsername($identifier);
        if ($user && $user['is_active'] && password_verify($password, $user['password_hash'])) {
            return $user;
        }
        return false;
    }
    
    // Check if username exists
    public function usernameExists($username, $excludeId = null) {
        try {
            $sql = "SELECT id FROM users WHERE username = ?";
            $params = [$username];
            
            if ($excludeId) {
                $sql .= " AND id != ?";
                $params[] = $excludeId;
            }
            
            $stmt = $this->db->query($sql, $params);
            return $stmt->fetch() !== false;
            
        } catch (Exception $e) {
            return false;
        }
    }
    
    // Check if email exists
    public function emailExists($email, $excludeId = null) {
        try {
            $sql = "SELECT id FROM users WHERE email = ?";
            $params = [$email];
            
            if ($excludeId) {
                $sql .= " AND id != ?";
                $params[] = $excludeId;
            }
            
            $stmt = $this->db->query($sql, $params);
            return $stmt->fetch() !== false;
            
        } catch (Exception $e) {
            return false;
        }
    }
    
    // Delete user
    public function delete($id, $currentUserId = null) {
        try {
            // Check if user exists
            $user = $this->getById($id);
            if (!$user) {
                throw new Exception("User not found");
            }
            
            // Get current user info to check permissions
            $currentUser = null;
            if ($currentUserId) {
                $currentUser = $this->getById($currentUserId);
            }
            
            // Never allow deleting super admin (username = 'admin')
            if ($user['username'] === 'admin') {
                throw new Exception("Cannot delete super admin account");
            }
            
            // Check permission for deleting admin users
            if ($user['role'] === 'admin') {
                // If current user is not authenticated or doesn't exist
                if (!$currentUser) {
                    throw new Exception("Authentication required to delete admin users");
                }
                
                // Only super admin or other admin can delete admin users
                if ($currentUser['role'] !== 'admin') {
                    throw new Exception("Only admin users can delete other admin users");
                }
                
                // Log the admin deletion for audit trail
                error_log("Admin user deletion: User ID {$currentUser['id']} ({$currentUser['username']}) deleted admin user ID {$id} ({$user['username']})");
            }
            
            $sql = "DELETE FROM users WHERE id = ?";
            $stmt = $this->db->query($sql, [$id]);
            
            return $stmt->rowCount() > 0;
            
        } catch (Exception $e) {
            error_log("Error deleting user: " . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }
    
    // Get user statistics
    public function getStats() {
        try {
            $sql = "SELECT 
                        COUNT(*) as total_users,
                        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
                        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_users,
                        COUNT(DISTINCT role) as total_roles
                    FROM users";
            
            $stmt = $this->db->query($sql);
            return $stmt->fetch();
            
        } catch (Exception $e) {
            error_log("Error getting user stats: " . $e->getMessage());
            return [
                'total_users' => 0,
                'active_users' => 0,
                'inactive_users' => 0,
                'total_roles' => 0
            ];
        }
    }
    
    // Toggle user status
    public function toggleStatus($id, $currentUserId = null) {
        try {
            $user = $this->getById($id);
            if (!$user) {
                throw new Exception("User not found");
            }
            
            // Get current user info to check permissions
            $currentUser = null;
            if ($currentUserId) {
                $currentUser = $this->getById($currentUserId);
            }
            
            // Cannot disable super admin
            if ($user['username'] === 'admin') {
                throw new Exception("Cannot disable super admin account");
            }
            
            // Check permission for toggling admin users status
            if ($user['role'] === 'admin') {
                // If current user is not authenticated or doesn't exist
                if (!$currentUser) {
                    throw new Exception("Authentication required to change admin user status");
                }
                
                // Only admin users can change other admin users status
                if ($currentUser['role'] !== 'admin') {
                    throw new Exception("Only admin users can change other admin users status");
                }
                
                // Log the admin status change for audit trail
                $action = $user['is_active'] ? 'disabled' : 'enabled';
                error_log("Admin status change: User ID {$currentUser['id']} ({$currentUser['username']}) {$action} admin user ID {$id} ({$user['username']})");
            }
            
            $newStatus = $user['is_active'] ? 0 : 1;
            $sql = "UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            $stmt = $this->db->query($sql, [$newStatus, $id]);
            
            return $this->getById($id);
            
        } catch (Exception $e) {
            error_log("Error toggling user status: " . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }
}
?> 