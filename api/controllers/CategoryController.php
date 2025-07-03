<?php
// api/controllers/CategoryController.php
// Category controller for handling category API endpoints

require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../core/router.php';
require_once __DIR__ . '/../core/auth.php';

class CategoryController {
    private $categoryModel;
    
    public function __construct() {
        $this->categoryModel = new Category();
    }
    
    // GET /api/categories - Get all categories
    public function index() {
        try {
            $type = $_GET['type'] ?? null;
            $active = isset($_GET['active']) ? filter_var($_GET['active'], FILTER_VALIDATE_BOOLEAN) : true;
            $page = intval($_GET['page'] ?? 1);
            $limit = intval($_GET['limit'] ?? 50);
            
            $result = $this->categoryModel->getAll($type, $active, $page, $limit);
            
            sendSuccessResponse($result);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get categories', 500, $e->getMessage());
        }
    }
    
    // GET /api/categories/{id} - Get single category
    public function show($id) {
        try {
            // Check if ID is numeric (ID) or string (slug)
            $bySlug = !is_numeric($id);
            
            $category = $this->categoryModel->getById($id, $bySlug);
            
            if (!$category) {
                sendErrorResponse('Category not found', 404);
                return;
            }
            
            sendSuccessResponse($category);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get category', 500, $e->getMessage());
        }
    }
    
    // POST /api/categories - Create new category (Admin only)
    public function store() {
        requireAuth('admin');
        
        try {
            $data = getRequestBody();
            
            // Validate required fields
            $requiredFields = ['name'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty(trim($data[$field]))) {
                    sendErrorResponse("Field '$field' is required", 400);
                    return;
                }
            }
            
            // Generate slug if not provided
            if (!isset($data['slug']) || empty($data['slug'])) {
                $data['slug'] = $this->categoryModel->generateSlug($data['name']);
            } else {
                // Check if slug is unique
                if ($this->categoryModel->slugExists($data['slug'])) {
                    sendErrorResponse('Slug already exists', 400);
                    return;
                }
            }
            
            // Validate type
            $validTypes = ['document_field', 'issuing_agency', 'issuing_level', 'news_category', 'slideshow_location'];
            if (isset($data['type']) && !in_array($data['type'], $validTypes)) {
                sendErrorResponse('Invalid category type', 400);
                return;
            }
            
            $category = $this->categoryModel->create($data);
            
            sendSuccessResponse($category, 'Category created successfully', 201);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to create category', 500, $e->getMessage());
        }
    }
    
    // PUT /api/categories/{id} - Update category (Admin only)
    public function update($id) {
        requireAuth('admin');
        
        try {
            $data = getRequestBody();
            
            // Check if category exists
            $existingCategory = $this->categoryModel->getById($id);
            if (!$existingCategory) {
                sendErrorResponse('Category not found', 404);
                return;
            }
            
            // Validate required fields if provided
            if (isset($data['name']) && empty(trim($data['name']))) {
                sendErrorResponse('Category name cannot be empty', 400);
                return;
            }
            
            // Check if slug is unique (excluding current category)
            if (isset($data['slug']) && $this->categoryModel->slugExists($data['slug'], $id)) {
                sendErrorResponse('Slug already exists', 400);
                return;
            }
            
            // Validate type
            $validTypes = ['document_field', 'issuing_agency', 'issuing_level', 'news_category', 'slideshow_location'];
            if (isset($data['type']) && !in_array($data['type'], $validTypes)) {
                sendErrorResponse('Invalid category type', 400);
                return;
            }
            
            $category = $this->categoryModel->update($id, $data);
            
            sendSuccessResponse($category, 'Category updated successfully');
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to update category', 500, $e->getMessage());
        }
    }
    
    // DELETE /api/categories/{id} - Delete category (Admin only)
    public function destroy($id) {
        requireAuth('admin');
        
        try {
            // Check if category exists
            $existingCategory = $this->categoryModel->getById($id);
            if (!$existingCategory) {
                sendErrorResponse('Category not found', 404);
                return;
            }
            
            $deleted = $this->categoryModel->delete($id);
            
            if ($deleted) {
                sendSuccessResponse(null, 'Category deleted successfully', 204);
            } else {
                sendErrorResponse('Failed to delete category', 500);
            }
            
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'existing articles') !== false) {
                sendErrorResponse($e->getMessage(), 400);
            } else {
                sendErrorResponse('Failed to delete category', 500, $e->getMessage());
            }
        }
    }
    
    // GET /api/categories/type/{type} - Get categories by type
    public function byType($type) {
        try {
            $validTypes = ['document_field', 'issuing_agency', 'issuing_level', 'news_category', 'slideshow_location'];
            if (!in_array($type, $validTypes)) {
                sendErrorResponse('Invalid category type', 400);
                return;
            }
            
            $active = isset($_GET['active']) ? filter_var($_GET['active'], FILTER_VALIDATE_BOOLEAN) : true;
            
            $categories = $this->categoryModel->getByType($type, $active);
            
            sendSuccessResponse($categories);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get categories by type', 500, $e->getMessage());
        }
    }
    
    // PUT /api/categories/{id}/toggle - Toggle category status (Admin only)
    public function toggleStatus($id) {
        requireAuth('admin');
        
        try {
            // Check if category exists
            $existingCategory = $this->categoryModel->getById($id);
            if (!$existingCategory) {
                sendErrorResponse('Category not found', 404);
                return;
            }
            
            $category = $this->categoryModel->toggleStatus($id);
            
            if ($category) {
                $statusText = $category['isActive'] ? 'activated' : 'deactivated';
                sendSuccessResponse($category, "Category $statusText successfully");
            } else {
                sendErrorResponse('Failed to toggle category status', 500);
            }
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to toggle category status', 500, $e->getMessage());
        }
    }
}
?> 