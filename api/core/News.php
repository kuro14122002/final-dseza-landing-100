<?php
/**
 * News Model
 * File: api/core/News.php
 * 
 * Model class for managing news articles with full CRUD operations
 */

class News {
    private $db;
    private $pdo;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->pdo = $this->db->getConnection();
    }
    
    /**
     * Get list of news articles with filtering, pagination and sorting
     */
    public function getList($filters = []) {
        $page = intval($filters['page'] ?? 1);
        $limit = intval($filters['limit'] ?? 10);
        $offset = ($page - 1) * $limit;
        
        // Base query with JOINs
        $baseSelect = "SELECT n.*, c.name as category_name_vi, c.name_en as category_name_en, 
                             u.full_name as author_name_full, u.email as author_email";
        $baseFrom = "FROM news_articles n 
                    LEFT JOIN categories c ON n.category_id = c.id 
                    LEFT JOIN users_admin u ON n.author_id = u.id";
        
        $whereClauses = [];
        $params = [];
        
        // Apply filters
        if (!empty($filters['searchTerm'])) {
            $whereClauses[] = "(n.title LIKE ? OR n.title_en LIKE ? OR n.excerpt LIKE ? OR n.excerpt_en LIKE ?)";
            $searchTerm = '%' . $filters['searchTerm'] . '%';
            $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
        }
        
        if (!empty($filters['categoryId'])) {
            $whereClauses[] = "n.category_id = ?";
            $params[] = $filters['categoryId'];
        }
        
        if (!empty($filters['status'])) {
            $whereClauses[] = "n.status = ?";
            $params[] = $filters['status'];
        }
        
        if (!empty($filters['authorId'])) {
            $whereClauses[] = "n.author_id = ?";
            $params[] = $filters['authorId'];
        }
        
        // Build WHERE clause
        $whereClause = '';
        if (!empty($whereClauses)) {
            $whereClause = 'WHERE ' . implode(' AND ', $whereClauses);
        }
        
        // Sorting
        $sortBy = $filters['sortBy'] ?? 'publish_date';
        $sortDirection = strtoupper($filters['sortDirection'] ?? 'DESC');
        
        // Validate sort fields
        $allowedSortFields = ['id', 'title', 'title_en', 'status', 'publish_date', 'created_at', 'updated_at'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'publish_date';
        }
        
        if (!in_array($sortDirection, ['ASC', 'DESC'])) {
            $sortDirection = 'DESC';
        }
        
        $orderClause = "ORDER BY n.{$sortBy} {$sortDirection}";
        
        // Get total count for pagination
        $countQuery = "SELECT COUNT(*) as total {$baseFrom} {$whereClause}";
        $countStmt = $this->pdo->prepare($countQuery);
        $countStmt->execute($params);
        $totalItems = $countStmt->fetch()['total'];
        
        // Get data with pagination
        $dataQuery = "{$baseSelect} {$baseFrom} {$whereClause} {$orderClause} LIMIT {$limit} OFFSET {$offset}";
        $dataStmt = $this->pdo->prepare($dataQuery);
        $dataStmt->execute($params);
        $articles = $dataStmt->fetchAll();
        
        // Calculate pagination info
        $totalPages = ceil($totalItems / $limit);
        
        return [
            'data' => $articles,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalItems' => $totalItems,
                'itemsPerPage' => $limit,
                'hasNextPage' => $page < $totalPages,
                'hasPrevPage' => $page > 1
            ]
        ];
    }
    
    /**
     * Get news article by ID
     */
    public function getById($id) {
        $query = "SELECT n.*, c.name as category_name_vi, c.name_en as category_name_en, 
                         u.full_name as author_name_full, u.email as author_email
                  FROM news_articles n 
                  LEFT JOIN categories c ON n.category_id = c.id 
                  LEFT JOIN users_admin u ON n.author_id = u.id 
                  WHERE n.id = ?";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$id]);
        
        return $stmt->fetch();
    }
    
    /**
     * Get news article by slug
     */
    public function getBySlug($slug) {
        $query = "SELECT n.*, c.name as category_name_vi, c.name_en as category_name_en, 
                         u.full_name as author_name_full, u.email as author_email
                  FROM news_articles n 
                  LEFT JOIN categories c ON n.category_id = c.id 
                  LEFT JOIN users_admin u ON n.author_id = u.id 
                  WHERE n.slug = ?";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$slug]);
        
        return $stmt->fetch();
    }
    
    /**
     * Create new news article
     */
    public function create($data) {
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = $this->generateSlug($data['title']);
        }
        
        // Validate required fields
        $required = ['title', 'content', 'category_id', 'author_id'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new Exception("Field '{$field}' is required");
            }
        }
        
        // Check slug uniqueness
        if (!$this->isSlugUnique($data['slug'])) {
            $data['slug'] = $this->generateUniqueSlug($data['slug']);
        }
        
        $query = "INSERT INTO news_articles (
            slug, title, title_en, excerpt, excerpt_en, content, content_en, 
            image_url, category_id, status, is_featured, reading_time, reading_time_en,
            author_id, author_name, publish_date, created_at, updated_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
        )";
        
        $stmt = $this->pdo->prepare($query);
        $success = $stmt->execute([
            $data['slug'],
            $data['title'],
            $data['title_en'] ?? null,
            $data['excerpt'] ?? null,
            $data['excerpt_en'] ?? null,
            $data['content'],
            $data['content_en'] ?? null,
            $data['image_url'] ?? null,
            $data['category_id'],
            $data['status'] ?? 'draft',
            $data['is_featured'] ?? 0,
            $data['reading_time'] ?? null,
            $data['reading_time_en'] ?? null,
            $data['author_id'],
            $data['author_name'] ?? '',
            $data['publish_date'] ?? date('Y-m-d H:i:s')
        ]);
        
        if ($success) {
            $newId = $this->pdo->lastInsertId();
            return $this->getById($newId);
        }
        
        return false;
    }
    
    /**
     * Update news article
     */
    public function update($id, $data) {
        // Check if article exists
        $existing = $this->getById($id);
        if (!$existing) {
            return false;
        }
        
        // Check slug uniqueness if slug is being changed
        if (!empty($data['slug']) && $data['slug'] !== $existing['slug']) {
            if (!$this->isSlugUnique($data['slug'], $id)) {
                $data['slug'] = $this->generateUniqueSlug($data['slug']);
            }
        }
        
        // Build update query dynamically
        $updateFields = [];
        $params = [];
        
        $allowedFields = ['slug', 'title', 'title_en', 'excerpt', 'excerpt_en', 'content', 'content_en', 
                         'image_url', 'category_id', 'status', 'is_featured', 'reading_time', 'reading_time_en',
                         'publish_date'];
        
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $updateFields[] = "{$field} = ?";
                $params[] = $data[$field];
            }
        }
        
        if (empty($updateFields)) {
            throw new Exception("No valid fields to update");
        }
        
        // Always update updated_at
        $updateFields[] = "updated_at = NOW()";
        $params[] = $id;
        
        $query = "UPDATE news_articles SET " . implode(', ', $updateFields) . " WHERE id = ?";
        
        $stmt = $this->pdo->prepare($query);
        $success = $stmt->execute($params);
        
        if ($success) {
            return $this->getById($id);
        }
        
        return false;
    }
    
    /**
     * Delete news article (soft delete)
     */
    public function delete($id) {
        // Check if article exists
        $existing = $this->getById($id);
        if (!$existing) {
            return false;
        }
        
        // Soft delete by updating status
        $query = "UPDATE news_articles SET status = 'deleted', updated_at = NOW() WHERE id = ?";
        $stmt = $this->pdo->prepare($query);
        
        return $stmt->execute([$id]);
    }
    
    /**
     * Hard delete news article
     */
    public function hardDelete($id) {
        $query = "DELETE FROM news_articles WHERE id = ?";
        $stmt = $this->pdo->prepare($query);
        
        return $stmt->execute([$id]);
    }
    
    /**
     * Check if slug is unique
     */
    public function isSlugUnique($slug, $excludeId = null) {
        $query = "SELECT id FROM news_articles WHERE slug = ?";
        $params = [$slug];
        
        if ($excludeId) {
            $query .= " AND id != ?";
            $params[] = $excludeId;
        }
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        
        return !$stmt->fetch();
    }
    
    /**
     * Generate slug from title
     */
    private function generateSlug($title) {
        // Remove Vietnamese accents
        $slug = $this->removeVietnameseAccents($title);
        
        // Convert to lowercase and replace spaces with hyphens
        $slug = strtolower($slug);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        $slug = trim($slug, '-');
        
        return $slug;
    }
    
    /**
     * Generate unique slug
     */
    private function generateUniqueSlug($baseSlug) {
        $counter = 1;
        $newSlug = $baseSlug;
        
        while (!$this->isSlugUnique($newSlug)) {
            $newSlug = $baseSlug . '-' . $counter;
            $counter++;
        }
        
        return $newSlug;
    }
    
    /**
     * Remove Vietnamese accents from string
     */
    private function removeVietnameseAccents($str) {
        $accents = [
            'a' => ['á', 'à', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
            'e' => ['é', 'è', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
            'i' => ['í', 'ì', 'ỉ', 'ĩ', 'ị'],
            'o' => ['ó', 'ò', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
            'u' => ['ú', 'ù', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
            'y' => ['ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
            'd' => ['đ']
        ];
        
        foreach ($accents as $non_accent => $accent_array) {
            $str = str_replace($accent_array, $non_accent, $str);
            $str = str_replace(array_map('strtoupper', $accent_array), strtoupper($non_accent), $str);
        }
        
        return $str;
    }
    
    /**
     * Get categories for dropdown
     */
    public function getCategories() {
        $query = "SELECT id, name as name_vi, name_en, slug FROM categories WHERE is_active = 1 ORDER BY name";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }
}
?> 