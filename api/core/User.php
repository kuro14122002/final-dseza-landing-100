<?php

require_once __DIR__ . '/Database.php';

class User
{
    private $db;
    private $table = 'users_admin';

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Find user by email
     */
    public function findByEmail($email)
    {
        $sql = "SELECT * FROM {$this->table} WHERE email = ? LIMIT 1";
        return $this->db->fetchOne($sql, [$email]);
    }

    /**
     * Find user by ID
     */
    public function findById($id)
    {
        $sql = "SELECT * FROM {$this->table} WHERE id = ? LIMIT 1";
        return $this->db->fetchOne($sql, [$id]);
    }

    /**
     * Verify user password
     */
    public function verifyPassword($password, $hashedPassword)
    {
        return password_verify($password, $hashedPassword);
    }

    /**
     * Check if user is active
     */
    public function isActive($user)
    {
        return isset($user['is_active']) && $user['is_active'] == 1;
    }

    /**
     * Create new user (for testing purposes)
     */
    public function create($data)
    {
        $sql = "INSERT INTO {$this->table} (email, password_hash, role, full_name, is_active, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())";
        
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
        
        $params = [
            $data['email'],
            $hashedPassword,
            $data['role'] ?? 'Editor',
            $data['full_name'] ?? null,
            $data['is_active'] ?? 1
        ];

        try {
            $this->db->query($sql, $params);
            return $this->db->lastInsertId();
        } catch (Exception $e) {
            error_log("User creation failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update user last login
     */
    public function updateLastLogin($userId)
    {
        $sql = "UPDATE {$this->table} SET updated_at = NOW() WHERE id = ?";
        try {
            $this->db->query($sql, [$userId]);
            return true;
        } catch (Exception $e) {
            error_log("Update last login failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user for JWT payload (without sensitive data)
     */
    public function getUserForToken($user)
    {
        return [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'full_name' => $user['full_name'] ?? null
        ];
    }

    /**
     * Validate email format
     */
    public function isValidEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Check if password meets requirements
     */
    public function isValidPassword($password)
    {
        // At least 8 characters
        return strlen($password) >= 8;
    }
} 