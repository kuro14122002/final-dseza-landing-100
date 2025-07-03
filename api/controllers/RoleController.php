<?php
// api/controllers/RoleController.php
// Role controller for handling role management operations

require_once __DIR__ . '/../models/Role.php';
require_once __DIR__ . '/../core/auth.php';
require_once __DIR__ . '/../core/router.php';

class RoleController {
    private $roleModel;
    
    public function __construct() {
        $this->roleModel = new Role();
    }
    
    // GET /api/roles - Get all roles
    public function index() {
        try {
            // Require admin authorization
            requireAuth('admin');
            
            $roles = $this->roleModel->getAll();
            
            sendSuccessResponse($roles, 'Roles retrieved successfully');
            
        } catch (Exception $e) {
            error_log("RoleController::index error: " . $e->getMessage());
            sendErrorResponse($e->getMessage(), 500);
        }
    }
    
    // GET /api/roles/{id} - Get specific role
    public function show($id) {
        try {
            // Require admin authorization
            requireAuth('admin');
            
            if (!is_numeric($id)) {
                sendErrorResponse('Invalid role ID', 400);
                return;
            }
            
            $role = $this->roleModel->getById($id);
            
            if (!$role) {
                sendErrorResponse('Role not found', 404);
                return;
            }
            
            sendSuccessResponse($role, 'Role retrieved successfully');
            
        } catch (Exception $e) {
            error_log("RoleController::show error: " . $e->getMessage());
            sendErrorResponse($e->getMessage(), 500);
        }
    }
    
    // POST /api/roles - Create new role
    public function store() {
        try {
            // Require admin authorization
            requireAuth('admin');
            
            $data = getRequestBody();
            
            if (!$data) {
                sendErrorResponse('Invalid request data', 400);
                return;
            }
            
            // Validate required fields
            if (empty($data['name'])) {
                sendErrorResponse('Role name is required', 400);
                return;
            }
            
            // Validate role name format
            if (!preg_match('/^[a-zA-Z0-9_-]+$/', $data['name'])) {
                sendErrorResponse('Role name can only contain letters, numbers, hyphens and underscores', 400);
                return;
            }
            
            // Validate permissions if provided
            if (isset($data['permissions']) && !is_array($data['permissions'])) {
                sendErrorResponse('Permissions must be an array', 400);
                return;
            }
            
            $role = $this->roleModel->create($data);
            
            sendSuccessResponse($role, 'Role created successfully', 201);
            
        } catch (Exception $e) {
            error_log("RoleController::store error: " . $e->getMessage());
            
            // Check for specific error types
            if (strpos($e->getMessage(), 'already exists') !== false) {
                sendErrorResponse($e->getMessage(), 409);
            } else {
                sendErrorResponse($e->getMessage(), 500);
            }
        }
    }
    
    // PUT /api/roles/{id} - Update role
    public function update($id) {
        try {
            // Require admin authorization
            requireAuth('admin');
            
            if (!is_numeric($id)) {
                sendErrorResponse('Invalid role ID', 400);
                return;
            }
            
            $data = getRequestBody();
            
            if (!$data) {
                sendErrorResponse('Invalid request data', 400);
                return;
            }
            
            // Validate role name format if provided
            if (isset($data['name']) && !preg_match('/^[a-zA-Z0-9_-]+$/', $data['name'])) {
                sendErrorResponse('Role name can only contain letters, numbers, hyphens and underscores', 400);
                return;
            }
            
            // Validate permissions if provided
            if (isset($data['permissions']) && !is_array($data['permissions'])) {
                sendErrorResponse('Permissions must be an array', 400);
                return;
            }
            
            $role = $this->roleModel->update($id, $data);
            
            if (!$role) {
                sendErrorResponse('Role not found', 404);
                return;
            }
            
            sendSuccessResponse($role, 'Role updated successfully');
            
        } catch (Exception $e) {
            error_log("RoleController::update error: " . $e->getMessage());
            
            // Check for specific error types
            if (strpos($e->getMessage(), 'not found') !== false) {
                sendErrorResponse($e->getMessage(), 404);
            } elseif (strpos($e->getMessage(), 'already exists') !== false) {
                sendErrorResponse($e->getMessage(), 409);
            } else {
                sendErrorResponse($e->getMessage(), 500);
            }
        }
    }
    
    // DELETE /api/roles/{id} - Delete role
    public function destroy($id) {
        try {
            // Require admin authorization
            requireAuth('admin');
            
            if (!is_numeric($id)) {
                sendErrorResponse('Invalid role ID', 400);
                return;
            }
            
            // Prevent deletion of default roles
            $role = $this->roleModel->getById($id);
            if (!$role) {
                sendErrorResponse('Role not found', 404);
                return;
            }
            
            // Protect default system roles
            $protectedRoles = ['admin', 'editor'];
            if (in_array($role['name'], $protectedRoles)) {
                sendErrorResponse('Cannot delete system role: ' . $role['name'], 403);
                return;
            }
            
            $success = $this->roleModel->delete($id);
            
            if (!$success) {
                sendErrorResponse('Failed to delete role', 500);
                return;
            }
            
            sendSuccessResponse(null, 'Role deleted successfully');
            
        } catch (Exception $e) {
            error_log("RoleController::destroy error: " . $e->getMessage());
            
            // Check for specific error types
            if (strpos($e->getMessage(), 'not found') !== false) {
                sendErrorResponse($e->getMessage(), 404);
            } elseif (strpos($e->getMessage(), 'assigned to users') !== false) {
                sendErrorResponse($e->getMessage(), 409);
            } else {
                sendErrorResponse($e->getMessage(), 500);
            }
        }
    }
    
    // GET /api/roles/stats - Get role statistics
    public function stats() {
        try {
            // Require admin authorization
            requireAuth('admin');
            
            $stats = $this->roleModel->getRoleStats();
            
            sendSuccessResponse($stats, 'Role statistics retrieved successfully');
            
        } catch (Exception $e) {
            error_log("RoleController::stats error: " . $e->getMessage());
            sendErrorResponse($e->getMessage(), 500);
        }
    }
    
    // PUT /api/roles/{id}/toggle - Toggle role active status
    public function toggleStatus($id) {
        try {
            // Require admin authorization
            requireAuth('admin');
            
            if (!is_numeric($id)) {
                sendErrorResponse('Invalid role ID', 400);
                return;
            }
            
            $role = $this->roleModel->getById($id);
            if (!$role) {
                sendErrorResponse('Role not found', 404);
                return;
            }
            
            // Calculate new status first
            $newStatus = $role['is_active'] ? 0 : 1;
            
            // Protect default system roles from being disabled (only prevent disabling, allow enabling)
            $protectedRoles = ['admin', 'editor'];
            if (in_array($role['name'], $protectedRoles) && $role['is_active'] && $newStatus == 0) {
                sendErrorResponse('Cannot disable system role: ' . $role['name'], 403);
                return;
            }
            
            $updatedRole = $this->roleModel->update($id, [
                'is_active' => $newStatus
            ]);
            
            sendSuccessResponse($updatedRole, 'Role status updated successfully');
            
        } catch (Exception $e) {
            error_log("RoleController::toggleStatus error: " . $e->getMessage());
            sendErrorResponse($e->getMessage(), 500);
        }
    }
}
?>
