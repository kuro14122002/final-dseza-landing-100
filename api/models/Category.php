<?php
// api/models/Category.php
// Category model for handling news categories database operations

require_once __DIR__ . '/../config/database.php';

class Category {
    private $db;
    
    public function __construct() {
        $this->db = getDatabase();
    }
    
    // Get all categories with filters
    public function getAll($type = null, $active = true, $page = 1, $limit = 50) {
        try {
            $offset = ($page - 1) * $limit;
            $conditions = [];
            $params = [];
            
            // Build WHERE conditions
            if ($type) {
                $conditions[] = "type = ?";
                $params[] = $type;
            }
            
            if ($active !== null) {
                $conditions[] = "is_active = ?";
                $params[] = $active ? 1 : 0;
            }
            
            $whereClause = !empty($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';
            
            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM news_categories $whereClause";
            $countStmt = $this->db->query($countSql, $params);
            $totalCategories = $countStmt->fetch()['total'];
            
            // Get categories
            $sql = "SELECT 
                        id, name, name_en, slug, description, type, parent_id,
                        order_position, is_active, created_at, updated_at
                    FROM news_categories
                    $whereClause
                    ORDER BY order_position ASC, name ASC
                    LIMIT ? OFFSET ?";
            
            $params[] = $limit;
            $params[] = $offset;
            
            $stmt = $this->db->query($sql, $params);
            $categories = $stmt->fetchAll();
            
            // Format categories
            $formattedCategories = [];
            foreach ($categories as $category) {
                $formattedCategories[] = $this->formatCategory($category);
            }
            
            return [
                'categories' => $formattedCategories,
                'totalCategories' => $totalCategories,
                'totalPages' => ceil($totalCategories / $limit),
                'currentPage' => $page
            ];
            
        } catch (Exception $e) {
            error_log("Error getting categories: " . $e->getMessage());
            throw new Exception("Failed to get categories");
        }
    }
    
    // Get single category by ID or slug
    public function getById($identifier, $bySlug = false) {
        try {
            $field = $bySlug ? 'slug' : 'id';
            
            $sql = "SELECT 
                        id, name, name_en, slug, description, type, parent_id,
                        order_position, is_active, created_at, updated_at
                    FROM news_categories
                    WHERE $field = ?";
            
            $stmt = $this->db->query($sql, [$identifier]);
            $category = $stmt->fetch();
            
            if (!$category) {
                return null;
            }
            
            return $this->formatCategory($category);
            
        } catch (Exception $e) {
            error_log("Error getting category: " . $e->getMessage());
            throw new Exception("Failed to get category");
        }
    }
    
    // Create new category
    public function create($data) {
        try {
            $this->db->beginTransaction();
            
            $sql = "INSERT INTO news_categories (
                        name, name_en, slug, description, type, parent_id,
                        order_position, is_active
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->db->query($sql, [
                $data['name'],
                $data['name_en'] ?? null,
                $data['slug'],
                $data['description'] ?? null,
                $data['type'] ?? 'news_category',
                $data['parent_id'] ?? null,
                $data['order_position'] ?? 0,
                $data['is_active'] ?? true
            ]);
            
            $categoryId = $this->db->lastInsertId();
            $this->db->commit();
            
            return $this->getById($categoryId);
            
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Error creating category: " . $e->getMessage());
            throw new Exception("Failed to create category");
        }
    }
    
    // Update category
    public function update($id, $data) {
        try {
            $this->db->beginTransaction();
            
            $sql = "UPDATE news_categories SET 
                        name = ?, name_en = ?, slug = ?, description = ?, 
                        type = ?, parent_id = ?, order_position = ?, 
                        is_active = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?";
            
            $stmt = $this->db->query($sql, [
                $data['name'],
                $data['name_en'] ?? null,
                $data['slug'],
                $data['description'] ?? null,
                $data['type'] ?? 'news_category',
                $data['parent_id'] ?? null,
                $data['order_position'] ?? 0,
                $data['is_active'] ?? true,
                $id
            ]);
            
            $this->db->commit();
            
            return $this->getById($id);
            
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Error updating category: " . $e->getMessage());
            throw new Exception("Failed to update category");
        }
    }
    
    // Delete category
    public function delete($id) {
        try {
            // Check if category has articles
            $checkSql = "SELECT COUNT(*) as count FROM news_articles WHERE category_id = ?";
            $checkStmt = $this->db->query($checkSql, [$id]);
            $articleCount = $checkStmt->fetch()['count'];
            
            if ($articleCount > 0) {
                throw new Exception("Cannot delete category with existing articles");
            }
            
            $sql = "DELETE FROM news_categories WHERE id = ?";
            $stmt = $this->db->query($sql, [$id]);
            
            return $stmt->rowCount() > 0;
            
        } catch (Exception $e) {
            error_log("Error deleting category: " . $e->getMessage());
            throw new Exception("Failed to delete category: " . $e->getMessage());
        }
    }
    
    // Get categories by type
    public function getByType($type, $active = true) {
        try {
            $sql = "SELECT 
                        id, name, name_en, slug, description, type, parent_id,
                        order_position, is_active, created_at, updated_at
                    FROM news_categories
                    WHERE type = ?";
            
            $params = [$type];
            
            if ($active !== null) {
                $sql .= " AND is_active = ?";
                $params[] = $active ? 1 : 0;
            }
            
            $sql .= " ORDER BY order_position ASC, name ASC";
            
            $stmt = $this->db->query($sql, $params);
            $categories = $stmt->fetchAll();
            
            $formattedCategories = [];
            foreach ($categories as $category) {
                $formattedCategories[] = $this->formatCategory($category);
            }
            
            return $formattedCategories;
            
        } catch (Exception $e) {
            error_log("Error getting categories by type: " . $e->getMessage());
            throw new Exception("Failed to get categories by type");
        }
    }
    
    // Check if slug exists
    public function slugExists($slug, $excludeId = null) {
        try {
            $sql = "SELECT id FROM news_categories WHERE slug = ?";
            $params = [$slug];
            
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
    
    // Generate unique slug
    public function generateSlug($name, $excludeId = null) {
        // Convert Vietnamese characters to ASCII
        $slug = $this->removeVietnameseAccents($name);
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $slug)));
        $originalSlug = $slug;
        $counter = 1;
        
        while ($this->slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }
    
    // Remove Vietnamese accents
    private function removeVietnameseAccents($str) {
        $vietnameseAccents = [
            'à', 'á', 'ạ', 'ả', 'ã', 'â', 'ầ', 'ấ', 'ậ', 'ẩ', 'ẫ', 'ă', 'ằ', 'ắ', 'ặ', 'ẳ', 'ẵ',
            'è', 'é', 'ẹ', 'ẻ', 'ẽ', 'ê', 'ề', 'ế', 'ệ', 'ể', 'ễ',
            'ì', 'í', 'ị', 'ỉ', 'ĩ',
            'ò', 'ó', 'ọ', 'ỏ', 'õ', 'ô', 'ồ', 'ố', 'ộ', 'ổ', 'ỗ', 'ơ', 'ờ', 'ớ', 'ợ', 'ở', 'ỡ',
            'ù', 'ú', 'ụ', 'ủ', 'ũ', 'ư', 'ừ', 'ứ', 'ự', 'ử', 'ữ',
            'ỳ', 'ý', 'ỵ', 'ỷ', 'ỹ',
            'đ',
            'À', 'Á', 'Ạ', 'Ả', 'Ã', 'Â', 'Ầ', 'Ấ', 'Ậ', 'Ẩ', 'Ẫ', 'Ă', 'Ằ', 'Ắ', 'Ặ', 'Ẳ', 'Ẵ',
            'È', 'É', 'Ẹ', 'Ẻ', 'Ẽ', 'Ê', 'Ề', 'Ế', 'Ệ', 'Ể', 'Ễ',
            'Ì', 'Í', 'Ị', 'Ỉ', 'Ĩ',
            'Ò', 'Ó', 'Ọ', 'Ỏ', 'Õ', 'Ô', 'Ồ', 'Ố', 'Ộ', 'Ổ', 'Ỗ', 'Ơ', 'Ờ', 'Ớ', 'Ợ', 'Ở', 'Ỡ',
            'Ù', 'Ú', 'Ụ', 'Ủ', 'Ũ', 'Ư', 'Ừ', 'Ứ', 'Ự', 'Ử', 'Ữ',
            'Ỳ', 'Ý', 'Ỵ', 'Ỷ', 'Ỹ',
            'Đ'
        ];
        
        $replacements = [
            'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
            'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
            'i', 'i', 'i', 'i', 'i',
            'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
            'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u',
            'y', 'y', 'y', 'y', 'y',
            'd',
            'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
            'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E',
            'I', 'I', 'I', 'I', 'I',
            'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
            'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
            'Y', 'Y', 'Y', 'Y', 'Y',
            'D'
        ];
        
        return str_replace($vietnameseAccents, $replacements, $str);
    }
    
    // Toggle category status
    public function toggleStatus($id) {
        try {
            $sql = "UPDATE news_categories SET is_active = NOT is_active WHERE id = ?";
            $stmt = $this->db->query($sql, [$id]);
            
            if ($stmt->rowCount() > 0) {
                return $this->getById($id);
            }
            
            return null;
            
        } catch (Exception $e) {
            error_log("Error toggling category status: " . $e->getMessage());
            throw new Exception("Failed to toggle category status");
        }
    }
    
    // Format category for API response
    private function formatCategory($category) {
        return [
            'id' => $category['id'],
            'name' => $category['name'],
            'nameEn' => $category['name_en'],
            'slug' => $category['slug'],
            'description' => $category['description'],
            'type' => $category['type'],
            'parentId' => $category['parent_id'],
            'order' => $category['order_position'],
            'isActive' => (bool) $category['is_active'],
            'created_at' => $category['created_at'],
            'updated_at' => $category['updated_at']
        ];
    }
}
?> 