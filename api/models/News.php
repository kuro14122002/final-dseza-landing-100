<?php
// api/models/News.php
require_once __DIR__ . '/../config/database.php';

class News {
    private $db;
    
    public function __construct() {
        $this->db = getDatabase();
    }
    
    // Get all news articles with pagination and filters
    public function getAll($page = 1, $limit = 9, $categoryId = null, $featured = null, $status = 'published') {
        try {
            $offset = ($page - 1) * $limit;
            $conditions = [];
            $params = [];
            
            if ($status) {
                $conditions[] = "na.status = ?";
                $params[] = $status;
            }
            
            if ($categoryId) {
                $conditions[] = "na.category_id = ?";
                $params[] = $categoryId;
            }
            
            if ($featured !== null) {
                $conditions[] = "na.is_featured = ?";
                $params[] = $featured ? 1 : 0;
            }
            
            $whereClause = !empty($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';
            
            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM news_articles na $whereClause";
            $countStmt = $this->db->query($countSql, $params);
            $totalArticles = $countStmt->fetch()['total'];
            
            // Get articles
            $sql = "SELECT 
                        na.id, na.slug, na.title, na.title_en, na.excerpt, na.excerpt_en,
                        na.content, na.content_en, na.image_url, na.status, na.is_featured,
                        na.reading_time, na.reading_time_en, na.publish_date, na.created_at, na.updated_at,
                        nc.id as category_id, nc.name as category_name, nc.name_en as category_name_en, nc.slug as category_slug,
                        u.username as author_username, u.email as author_email
                    FROM news_articles na
                    LEFT JOIN news_categories nc ON na.category_id = nc.id
                    LEFT JOIN users u ON na.author_id = u.id
                    $whereClause
                    ORDER BY na.publish_date DESC, na.created_at DESC
                    LIMIT ? OFFSET ?";
            
            $params[] = $limit;
            $params[] = $offset;
            
            $stmt = $this->db->query($sql, $params);
            $articles = $stmt->fetchAll();
            
            $formattedArticles = [];
            foreach ($articles as $article) {
                $formattedArticles[] = $this->formatArticle($article);
            }
            
            return [
                'articles' => $formattedArticles,
                'totalArticles' => $totalArticles,
                'totalPages' => ceil($totalArticles / $limit),
                'currentPage' => $page
            ];
            
        } catch (Exception $e) {
            error_log("Error getting news articles: " . $e->getMessage());
            throw new Exception("Failed to get news articles");
        }
    }
    
    // Get single article by ID or slug
    public function getById($identifier, $bySlug = false) {
        try {
            $field = $bySlug ? 'na.slug' : 'na.id';
            
            $sql = "SELECT 
                        na.id, na.slug, na.title, na.title_en, na.excerpt, na.excerpt_en,
                        na.content, na.content_en, na.image_url, na.status, na.is_featured,
                        na.reading_time, na.reading_time_en, na.publish_date, na.created_at, na.updated_at,
                        nc.id as category_id, nc.name as category_name, nc.name_en as category_name_en, nc.slug as category_slug,
                        u.username as author_username, u.email as author_email
                    FROM news_articles na
                    LEFT JOIN news_categories nc ON na.category_id = nc.id
                    LEFT JOIN users u ON na.author_id = u.id
                    WHERE $field = ?";
            
            $stmt = $this->db->query($sql, [$identifier]);
            $article = $stmt->fetch();
            
            if (!$article) {
                return null;
            }
            
            return $this->formatArticle($article, true);
            
        } catch (Exception $e) {
            error_log("Error getting news article: " . $e->getMessage());
            throw new Exception("Failed to get news article");
        }
    }
    
    // Create new article
    public function create($data) {
        try {
            $this->db->beginTransaction();
            
            $sql = "INSERT INTO news_articles (
                        slug, title, title_en, excerpt, excerpt_en, content, content_en,
                        image_url, category_id, status, is_featured, reading_time, 
                        reading_time_en, author_id, publish_date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $publishDate = ($data['status'] === 'published') ? 
                (isset($data['publish_date']) ? $data['publish_date'] : date('Y-m-d H:i:s')) : null;
            
            $stmt = $this->db->query($sql, [
                $data['slug'],
                $data['title'],
                $data['title_en'] ?? null,
                $data['excerpt'],
                $data['excerpt_en'] ?? null,
                $data['content'],
                $data['content_en'] ?? null,
                $data['image_url'] ?? null,
                $data['category_id'],
                $data['status'] ?? 'draft',
                $data['is_featured'] ?? false,
                $data['reading_time'] ?? null,
                $data['reading_time_en'] ?? null,
                $data['author_id'],
                $publishDate
            ]);
            
            $articleId = $this->db->lastInsertId();
            $this->db->commit();
            
            return $this->getById($articleId);
            
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Error creating news article: " . $e->getMessage());
            throw new Exception("Failed to create news article");
        }
    }
    
    // Update article
    public function update($id, $data) {
        try {
            $this->db->beginTransaction();
            
            $sql = "UPDATE news_articles SET 
                        title = ?, title_en = ?, excerpt = ?, excerpt_en = ?, 
                        content = ?, content_en = ?, image_url = ?, category_id = ?, 
                        status = ?, is_featured = ?, reading_time = ?, reading_time_en = ?,
                        publish_date = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?";
            
            $publishDate = ($data['status'] === 'published') ? 
                (isset($data['publish_date']) ? $data['publish_date'] : date('Y-m-d H:i:s')) : null;
            
            $stmt = $this->db->query($sql, [
                $data['title'],
                $data['title_en'] ?? null,
                $data['excerpt'],
                $data['excerpt_en'] ?? null,
                $data['content'],
                $data['content_en'] ?? null,
                $data['image_url'] ?? null,
                $data['category_id'],
                $data['status'] ?? 'draft',
                $data['is_featured'] ?? false,
                $data['reading_time'] ?? null,
                $data['reading_time_en'] ?? null,
                $publishDate,
                $id
            ]);
            
            $this->db->commit();
            
            return $this->getById($id);
            
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Error updating news article: " . $e->getMessage());
            throw new Exception("Failed to update news article");
        }
    }
    
    // Delete article
    public function delete($id) {
        try {
            $sql = "DELETE FROM news_articles WHERE id = ?";
            $stmt = $this->db->query($sql, [$id]);
            
            return $stmt->rowCount() > 0;
            
        } catch (Exception $e) {
            error_log("Error deleting news article: " . $e->getMessage());
            throw new Exception("Failed to delete news article");
        }
    }
    
    // Format article for API response
    private function formatArticle($article, $includeContent = false) {
        $formatted = [
            'id' => $article['id'],
            'slug' => $article['slug'],
            'title' => $article['title'],
            'titleEn' => $article['title_en'],
            'excerpt' => $article['excerpt'],
            'excerptEn' => $article['excerpt_en'],
            'imageUrl' => $article['image_url'],
            'publishDate' => $article['publish_date'],
            'readingTime' => $article['reading_time'],
            'readingTimeEn' => $article['reading_time_en'],
            'isFeatured' => (bool) $article['is_featured'],
            'category' => [
                'id' => $article['category_id'],
                'name' => $article['category_name'],
                'nameEn' => $article['category_name_en'],
                'slug' => $article['category_slug']
            ]
        ];
        
        if ($includeContent) {
            $formatted['content'] = $article['content'];
            $formatted['contentEn'] = $article['content_en'];
        }
        
        if (isset($article['status'])) {
            $formatted['status'] = $article['status'];
            $formatted['author'] = $article['author_email'];
            $formatted['createdDate'] = $article['created_at'];
            $formatted['updatedDate'] = $article['updated_at'];
        }
        
        return $formatted;
    }
    
    // Get total count of news articles
    public function getTotalCount() {
        try {
            $sql = "SELECT COUNT(*) as total FROM news_articles WHERE status = 'published'";
            $stmt = $this->db->query($sql);
            $result = $stmt->fetch();
            return $result['total'] ?? 0;
        } catch (Exception $e) {
            error_log("Error getting total news count: " . $e->getMessage());
            return 0;
        }
    }
    
    // Get total count of events (news with specific category type)
    public function getEventCount() {
        try {
            $sql = "SELECT COUNT(*) as total 
                    FROM news_articles na 
                    JOIN news_categories nc ON na.category_id = nc.id 
                    WHERE na.status = 'published' AND nc.type = 'event'";
            $stmt = $this->db->query($sql);
            $result = $stmt->fetch();
            return $result['total'] ?? 0;
        } catch (Exception $e) {
            error_log("Error getting event count: " . $e->getMessage());
            return 0;
        }
    }
    
    // Search in news articles
    public function search($query, $page = 1, $limit = 10) {
        try {
            $offset = ($page - 1) * $limit;
            $searchTerm = "%{$query}%";
            
            // Count total results
            $countSql = "SELECT COUNT(*) as total 
                        FROM news_articles na 
                        LEFT JOIN news_categories nc ON na.category_id = nc.id
                        WHERE na.status = 'published' 
                        AND (na.title LIKE ? OR na.excerpt LIKE ? OR na.content LIKE ? 
                             OR na.title_en LIKE ? OR na.excerpt_en LIKE ? OR na.content_en LIKE ?)";
            
            $countParams = array_fill(0, 6, $searchTerm);
            $countStmt = $this->db->query($countSql, $countParams);
            $total = $countStmt->fetch()['total'];
            
            // Get results
            $sql = "SELECT 
                        na.id, na.slug, na.title, na.title_en, na.excerpt, na.excerpt_en,
                        na.image_url, na.publish_date, na.reading_time, na.reading_time_en,
                        na.is_featured, na.created_at,
                        nc.id as category_id, nc.name as category_name, nc.name_en as category_name_en, nc.slug as category_slug
                    FROM news_articles na
                    LEFT JOIN news_categories nc ON na.category_id = nc.id
                    WHERE na.status = 'published' 
                    AND (na.title LIKE ? OR na.excerpt LIKE ? OR na.content LIKE ? 
                         OR na.title_en LIKE ? OR na.excerpt_en LIKE ? OR na.content_en LIKE ?)
                    ORDER BY 
                        CASE 
                            WHEN na.title LIKE ? OR na.title_en LIKE ? THEN 1
                            WHEN na.excerpt LIKE ? OR na.excerpt_en LIKE ? THEN 2
                            ELSE 3
                        END,
                        na.publish_date DESC
                    LIMIT ? OFFSET ?";
            
            $searchParams = array_merge(
                array_fill(0, 6, $searchTerm), // WHERE conditions
                array_fill(0, 4, $searchTerm), // ORDER BY conditions
                [$limit, $offset] // LIMIT and OFFSET
            );
            
            $stmt = $this->db->query($sql, $searchParams);
            $articles = $stmt->fetchAll();
            
            $results = [];
            foreach ($articles as $article) {
                $results[] = [
                    'id' => $article['id'],
                    'slug' => $article['slug'],
                    'title' => $article['title'],
                    'titleEn' => $article['title_en'],
                    'excerpt' => $article['excerpt'],
                    'excerptEn' => $article['excerpt_en'],
                    'imageUrl' => $article['image_url'] ?: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
                    'publishDate' => $article['publish_date'] ?: $article['created_at'],
                    'readingTime' => $article['reading_time'],
                    'readingTimeEn' => $article['reading_time_en'],
                    'isFeatured' => (bool) $article['is_featured'],
                    'category' => [
                        'id' => $article['category_id'],
                        'slug' => $article['category_slug'],
                        'name' => $article['category_name'],
                        'nameEn' => $article['category_name_en']
                    ]
                ];
            }
            
            return [
                'articles' => $results,
                'totalArticles' => $total,
                'totalPages' => ceil($total / $limit),
                'currentPage' => $page
            ];
            
        } catch (Exception $e) {
            error_log("News search error: " . $e->getMessage());
            throw new Exception("Failed to search news articles");
        }
    }

    // Get news statistics for admin dashboard
    public function getStatistics() {
        try {
            $stats = [];
            
            // Total articles count
            $sql = "SELECT COUNT(*) as total FROM news_articles";
            $stmt = $this->db->query($sql);
            $stats['totalArticles'] = $stmt->fetch()['total'] ?? 0;
            
            // Published articles count
            $sql = "SELECT COUNT(*) as total FROM news_articles WHERE status = 'published'";
            $stmt = $this->db->query($sql);
            $stats['publishedArticles'] = $stmt->fetch()['total'] ?? 0;
            
            // Draft articles count
            $sql = "SELECT COUNT(*) as total FROM news_articles WHERE status = 'draft'";
            $stmt = $this->db->query($sql);
            $stats['draftArticles'] = $stmt->fetch()['total'] ?? 0;
            
            // Featured articles count
            $sql = "SELECT COUNT(*) as total FROM news_articles WHERE is_featured = 1 AND status = 'published'";
            $stmt = $this->db->query($sql);
            $stats['featuredArticles'] = $stmt->fetch()['total'] ?? 0;
            
            // Articles by category
            $sql = "SELECT nc.name, nc.name_en, COUNT(na.id) as count 
                    FROM news_categories nc 
                    LEFT JOIN news_articles na ON nc.id = na.category_id AND na.status = 'published'
                    GROUP BY nc.id, nc.name, nc.name_en 
                    ORDER BY count DESC";
            $stmt = $this->db->query($sql);
            $stats['articlesByCategory'] = $stmt->fetchAll() ?? [];
            
            // Recent activity (last 30 days)
            $sql = "SELECT DATE(created_at) as date, COUNT(*) as count 
                    FROM news_articles 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                    GROUP BY DATE(created_at) 
                    ORDER BY date DESC 
                    LIMIT 30";
            $stmt = $this->db->query($sql);
            $stats['recentActivity'] = $stmt->fetchAll() ?? [];
            
            // Monthly statistics for current year
            $sql = "SELECT MONTH(created_at) as month, COUNT(*) as count 
                    FROM news_articles 
                    WHERE YEAR(created_at) = YEAR(NOW())
                    GROUP BY MONTH(created_at) 
                    ORDER BY month";
            $stmt = $this->db->query($sql);
            $stats['monthlyStats'] = $stmt->fetchAll() ?? [];
            
            // Most popular articles (if views tracking exists)
            $sql = "SELECT na.id, na.title, na.slug, na.publish_date, 
                           nc.name as category_name, na.is_featured
                    FROM news_articles na 
                    LEFT JOIN news_categories nc ON na.category_id = nc.id
                    WHERE na.status = 'published' 
                    ORDER BY na.created_at DESC 
                    LIMIT 10";
            $stmt = $this->db->query($sql);
            $stats['recentArticles'] = $stmt->fetchAll() ?? [];
            
            return $stats;
            
        } catch (Exception $e) {
            error_log("Error getting news statistics: " . $e->getMessage());
            throw new Exception("Failed to get news statistics");
        }
    }
}
?> 