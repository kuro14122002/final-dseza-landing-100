<?php
// api/models/Role.php
// Role model for handling roles database operations

require_once __DIR__ . '/../config/database.php';

class Role {
    private $db;
    
    public function __construct() {
        $this->db = getDatabase();
    }
    
    // Get all roles
    public function getAll() {
        try {
            $sql = "SELECT id, name, permissions, description, is_active, created_at, updated_at FROM roles ORDER BY name ASC";
            $stmt = $this->db->query($sql);
            $roles = $stmt->fetchAll();
            
            // Decode permissions JSON for each role
            foreach ($roles as &$role) {
                $role['permissions'] = json_decode($role['permissions'], true) ?? [];
            }
            
            return $roles;
        } catch (Exception $e) {
            error_log("Error getting all roles: " . $e->getMessage());
            throw new Exception("Failed to fetch roles");
        }
    }
    
    // Get role by ID
    public function getById($id) {
        try {
            $sql = "SELECT id, name, permissions, description, is_active, created_at, updated_at FROM roles WHERE id = ?";
            $stmt = $this->db->query($sql, [$id]);
            $role = $stmt->fetch();
            
            if ($role) {
                $role['permissions'] = json_decode($role['permissions'], true) ?? [];
            }
            
            return $role;
        } catch (Exception $e) {
            error_log("Error getting role by ID: " . $e->getMessage());
            return false;
        }
    }
    
    // Get role by name
    public function getByName($name) {
        try {
            $sql = "SELECT id, name, permissions, description, is_active, created_at, updated_at FROM roles WHERE name = ?";
            $stmt = $this->db->query($sql, [$name]);
            $role = $stmt->fetch();
            
            if ($role) {
                $role['permissions'] = json_decode($role['permissions'], true) ?? [];
            }
            
            return $role;
        } catch (Exception $e) {
            error_log("Error getting role by name: " . $e->getMessage());
            return false;
        }
    }
    
    // Create new role
    public function create($data) {
        try {
            // Validate required fields
            if (empty($data['name'])) {
                throw new Exception("Role name is required");
            }
            
            // Check if role name already exists
            if ($this->getByName($data['name'])) {
                throw new Exception("Role name already exists");
            }
            
            // Prepare permissions
            $permissions = isset($data['permissions']) ? json_encode($data['permissions']) : json_encode([]);
            
            $sql = "INSERT INTO roles (name, permissions, description, is_active) VALUES (?, ?, ?, ?)";
            
            $stmt = $this->db->query($sql, [
                $data['name'],
                $permissions,
                $data['description'] ?? '',
                $data['is_active'] ?? true
            ]);
            
            $roleId = $this->db->lastInsertId();
            return $this->getById($roleId);
            
        } catch (Exception $e) {
            error_log("Error creating role: " . $e->getMessage());
            throw new Exception("Failed to create role: " . $e->getMessage());
        }
    }
    
    // Update role
    public function update($id, $data) {
        try {
            // Check if role exists
            $existingRole = $this->getById($id);
            if (!$existingRole) {
                throw new Exception("Role not found");
            }
            
            $fields = [];
            $params = [];
            
            if (isset($data['name'])) {
                // Check if new name already exists (excluding current role)
                $existingByName = $this->getByName($data['name']);
                if ($existingByName && $existingByName['id'] != $id) {
                    throw new Exception("Role name already exists");
                }
                $fields[] = "name = ?";
                $params[] = $data['name'];
            }
            
            if (isset($data['permissions'])) {
                $fields[] = "permissions = ?";
                $params[] = json_encode($data['permissions']);
            }
            
            if (isset($data['description'])) {
                $fields[] = "description = ?";
                $params[] = $data['description'];
            }
            
            if (isset($data['is_active'])) {
                $fields[] = "is_active = ?";
                $params[] = $data['is_active'];
            }
            
            if (empty($fields)) {
                return $this->getById($id);
            }
            
            $fields[] = "updated_at = CURRENT_TIMESTAMP";
            $params[] = $id;
            
            $sql = "UPDATE roles SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $this->db->query($sql, $params);
            
            return $this->getById($id);
            
        } catch (Exception $e) {
            error_log("Error updating role: " . $e->getMessage());
            throw new Exception("Failed to update role: " . $e->getMessage());
        }
    }
    
    // Delete role
    public function delete($id) {
        try {
            // Check if role exists
            $role = $this->getById($id);
            if (!$role) {
                throw new Exception("Role not found");
            }
            
            // Check if role is being used by any users
            if ($this->isRoleInUse($id)) {
                throw new Exception("Cannot delete role: it is currently assigned to users");
            }
            
            $sql = "DELETE FROM roles WHERE id = ?";
            $stmt = $this->db->query($sql, [$id]);
            
            return $stmt->rowCount() > 0;
            
        } catch (Exception $e) {
            error_log("Error deleting role: " . $e->getMessage());
            throw new Exception("Failed to delete role: " . $e->getMessage());
        }
    }
    
    // Check if role is being used by users
    private function isRoleInUse($roleId) {
        try {
            // Get role name to check against users table
            $role = $this->getById($roleId);
            if (!$role) {
                return false;
            }
            
            $sql = "SELECT COUNT(*) as count FROM users WHERE role = ?";
            $stmt = $this->db->query($sql, [$role['name']]);
            $result = $stmt->fetch();
            
            return $result['count'] > 0;
            
        } catch (Exception $e) {
            error_log("Error checking role usage: " . $e->getMessage());
            return true; // Assume it's in use to prevent accidental deletion
        }
    }
    
    // Check if role name exists
    public function nameExists($name, $excludeId = null) {
        try {
            $sql = "SELECT id FROM roles WHERE name = ?";
            $params = [$name];
            
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
    
    // Get users count for each role
    public function getRoleStats() {
        try {
            $sql = "SELECT r.id, r.name, COUNT(u.id) as user_count 
                    FROM roles r 
                    LEFT JOIN users u ON u.role = r.name 
                    GROUP BY r.id, r.name 
                    ORDER BY r.name";
            $stmt = $this->db->query($sql);
            return $stmt->fetchAll();
        } catch (Exception $e) {
            error_log("Error getting role stats: " . $e->getMessage());
            return [];
        }
    }
}
?>
