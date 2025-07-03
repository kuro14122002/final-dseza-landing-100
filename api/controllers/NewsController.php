<?php
// api/controllers/NewsController.php
// Enhanced News controller for handling news API endpoints with file attachments

require_once __DIR__ . '/../models/News.php';
require_once __DIR__ . '/../core/router.php';
require_once __DIR__ . '/../core/auth.php';

class NewsController {
    private $newsModel;
    
    public function __construct() {
        $this->newsModel = new News();
    }
    
    // GET /api/news - Get all news articles
    public function index() {
        try {
            $page = intval($_GET['page'] ?? 1);
            $limit = intval($_GET['limit'] ?? 9);
            $categoryId = $_GET['categoryId'] ?? null;
            $featured = isset($_GET['featured']) ? filter_var($_GET['featured'], FILTER_VALIDATE_BOOLEAN) : null;
            $status = $_GET['status'] ?? 'published';
            $sortBy = $_GET['sortBy'] ?? 'publishDate';
            $sortOrder = $_GET['sortOrder'] ?? 'desc';
            
            $result = $this->newsModel->getAll($page, $limit, $categoryId, $featured, $status, $sortBy, $sortOrder);
            
            sendSuccessResponse($result);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get news articles', 500, $e->getMessage());
        }
    }
    
    // GET /api/news/{id} - Get single news article
    public function show($id) {
        try {
            // Check if ID is numeric (ID) or string (slug)
            $bySlug = !is_numeric($id);
            
            $article = $this->newsModel->getById($id, $bySlug);
            
            if (!$article) {
                sendErrorResponse('Article not found', 404);
                return;
            }
            
            // Increment view count for published articles
            if ($article['status'] === 'published') {
                $this->newsModel->incrementViewCount($article['id']);
            }
            
            sendSuccessResponse($article);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get article', 500, $e->getMessage());
        }
    }
    
    // POST /api/admin/news - Create new article (Admin only)
    public function store() {
        requireAuth('editor');
        
        try {
            // Handle both JSON and multipart/form-data
            $data = $this->getRequestData();
            
            // Validate required fields
            $requiredFields = ['title', 'excerpt', 'content', 'categoryId'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty(trim($data[$field]))) {
                    sendErrorResponse("Field '$field' is required", 400);
                    return;
                }
            }
            
            // Generate slug if not provided
            if (!isset($data['slug']) || empty($data['slug'])) {
                $data['slug'] = $this->generateSlug($data['title']);
            }
            
            // Add author information from current user
            $data['author'] = $data['author'] ?? $GLOBALS['current_user']['name'];
            $data['createdBy'] = $GLOBALS['current_user']['id'];
            $data['lastModifiedBy'] = $GLOBALS['current_user']['id'];
            
            // Validate category exists
            if (!$this->categoryExists($data['categoryId'])) {
                sendErrorResponse('Invalid category ID', 400);
                return;
            }
            
            // Process attachments
            if (isset($data['attachments']) && is_string($data['attachments'])) {
                $data['attachments'] = json_decode($data['attachments'], true);
            }
            
            // Validate attachments
            if (isset($data['attachments']) && is_array($data['attachments'])) {
                if (count($data['attachments']) > 10) {
                    sendErrorResponse('Maximum 10 attachments allowed', 400);
                    return;
                }
                
                foreach ($data['attachments'] as $attachment) {
                    if (!$this->validateAttachment($attachment)) {
                        sendErrorResponse('Invalid attachment data', 400);
                        return;
                    }
                }
            }
            
            // Set default values
            $data['status'] = $data['status'] ?? 'draft';
            $data['isFeatured'] = $data['isFeatured'] ?? false;
            $data['publishDate'] = $data['publishDate'] ?? date('Y-m-d H:i:s');
            
            // Calculate reading time and metadata
            $data['readingTime'] = $this->calculateReadingTime($data['content']);
            $data['metadata'] = $this->generateMetadata($data['content']);
            
            $article = $this->newsModel->create($data);
            
            sendSuccessResponse($article, 'Article created successfully', 201);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to create article', 500, $e->getMessage());
        }
    }
    
    // PUT /api/admin/news/{id} - Update article (Admin only)
    public function update($id) {
        requireAuth('editor');
        
        try {
            $data = $this->getRequestData();
            
            // Check if article exists
            $existingArticle = $this->newsModel->getById($id);
            if (!$existingArticle) {
                sendErrorResponse('Article not found', 404);
                return;
            }
            
            // Validate required fields if provided
            $requiredFields = ['title', 'excerpt', 'content', 'categoryId'];
            foreach ($requiredFields as $field) {
                if (isset($data[$field]) && empty(trim($data[$field]))) {
                    sendErrorResponse("Field '$field' cannot be empty", 400);
                    return;
                }
            }
            
            // Validate category exists if provided
            if (isset($data['categoryId']) && !$this->categoryExists($data['categoryId'])) {
                sendErrorResponse('Invalid category ID', 400);
                return;
            }
            
            // Process attachments
            if (isset($data['attachments']) && is_string($data['attachments'])) {
                $data['attachments'] = json_decode($data['attachments'], true);
            }
            
            // Validate attachments
            if (isset($data['attachments']) && is_array($data['attachments'])) {
                if (count($data['attachments']) > 10) {
                    sendErrorResponse('Maximum 10 attachments allowed', 400);
                    return;
                }
                
                foreach ($data['attachments'] as $attachment) {
                    if (!$this->validateAttachment($attachment)) {
                        sendErrorResponse('Invalid attachment data', 400);
                        return;
                    }
                }
            }
            
            // Update modification tracking
            $data['lastModifiedBy'] = $GLOBALS['current_user']['id'];
            $data['updatedAt'] = date('Y-m-d H:i:s');
            
            // Recalculate reading time if content changed
            if (isset($data['content'])) {
                $data['readingTime'] = $this->calculateReadingTime($data['content']);
                $data['metadata'] = $this->generateMetadata($data['content']);
            }
            
            $article = $this->newsModel->update($id, $data);
            
            sendSuccessResponse($article, 'Article updated successfully');
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to update article', 500, $e->getMessage());
        }
    }
    
    // DELETE /api/admin/news/{id} - Delete article (Admin only)
    public function destroy($id) {
        requireAuth('admin');
        
        try {
            // Check if article exists
            $existingArticle = $this->newsModel->getById($id);
            if (!$existingArticle) {
                sendErrorResponse('Article not found', 404);
                return;
            }
            
            // Delete associated files
            if (isset($existingArticle['attachments'])) {
                foreach ($existingArticle['attachments'] as $attachment) {
                    $this->deleteAttachmentFile($attachment['url']);
                }
            }
            
            $deleted = $this->newsModel->delete($id);
            
            if ($deleted) {
                sendSuccessResponse(null, 'Article deleted successfully', 204);
            } else {
                sendErrorResponse('Failed to delete article', 500);
            }
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to delete article', 500, $e->getMessage());
        }
    }
    
    // GET /api/news/featured - Get featured article
    public function featured() {
        try {
            $article = $this->newsModel->getFeatured();
            
            if (!$article) {
                sendSuccessResponse(null, 'No featured article found');
                return;
            }
            
            sendSuccessResponse($article);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get featured article', 500, $e->getMessage());
        }
    }
    
    // GET /api/news/{id}/related - Get related articles
    public function related($id) {
        try {
            $article = $this->newsModel->getById($id);
            if (!$article) {
                sendErrorResponse('Article not found', 404);
                return;
            }
            
            $limit = intval($_GET['limit'] ?? 4);
            $relatedArticles = $this->newsModel->getRelated($id, $article['category']['id'], $limit);
            
            sendSuccessResponse($relatedArticles);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get related articles', 500, $e->getMessage());
        }
    }
    
    // GET /api/news/category/{categorySlug} - Get articles by category slug
    public function byCategory($categorySlug) {
        try {
            // Get category by slug
            require_once __DIR__ . '/../models/Category.php';
            $categoryModel = new Category();
            
            $category = $categoryModel->getById($categorySlug, true);
            if (!$category) {
                sendErrorResponse('Category not found', 404);
                return;
            }
            
            $page = intval($_GET['page'] ?? 1);
            $limit = intval($_GET['limit'] ?? 9);
            
            $result = $this->newsModel->getAll($page, $limit, $category['id']);
            
            sendSuccessResponse($result);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get articles by category', 500, $e->getMessage());
        }
    }
    
    // POST /api/admin/news/{id}/duplicate - Duplicate article
    public function duplicate($id) {
        requireAuth('editor');
        
        try {
            $existingArticle = $this->newsModel->getById($id);
            if (!$existingArticle) {
                sendErrorResponse('Article not found', 404);
                return;
            }
            
            // Prepare data for duplication
            $data = $existingArticle;
            unset($data['id']);
            $data['title'] = 'Copy of ' . $data['title'];
            $data['slug'] = $this->generateSlug($data['title']);
            $data['status'] = 'draft';
            $data['isFeatured'] = false;
            $data['createdBy'] = $GLOBALS['current_user']['id'];
            $data['lastModifiedBy'] = $GLOBALS['current_user']['id'];
            $data['publishDate'] = date('Y-m-d H:i:s');
            
            // Copy attachments (keep same URLs for now)
            // In production, you might want to duplicate the actual files
            
            $article = $this->newsModel->create($data);
            
            sendSuccessResponse($article, 'Article duplicated successfully', 201);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to duplicate article', 500, $e->getMessage());
        }
    }
    
    // PATCH /api/admin/news/bulk - Bulk operations
    public function bulk() {
        requireAuth('editor');
        
        try {
            $data = getRequestBody();
            
            if (!isset($data['articleIds']) || !is_array($data['articleIds'])) {
                sendErrorResponse('Article IDs are required', 400);
                return;
            }
            
            if (!isset($data['updates']) || !is_array($data['updates'])) {
                sendErrorResponse('Updates data is required', 400);
                return;
            }
            
            $updates = $data['updates'];
            $updates['lastModifiedBy'] = $GLOBALS['current_user']['id'];
            $updates['updatedAt'] = date('Y-m-d H:i:s');
            
            $result = $this->newsModel->bulkUpdate($data['articleIds'], $updates);
            
            sendSuccessResponse($result, 'Bulk update completed successfully');
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to perform bulk update', 500, $e->getMessage());
        }
    }
    
    // GET /api/admin/news/stats - Get news statistics
    public function stats() {
        requireAuth('editor');
        
        try {
            $stats = $this->newsModel->getStatistics();
            sendSuccessResponse($stats);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get statistics', 500, $e->getMessage());
        }
    }
    
    // Helper method to get request data (JSON or form-data)
    private function getRequestData() {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (strpos($contentType, 'application/json') !== false) {
            return getRequestBody();
        } elseif (strpos($contentType, 'multipart/form-data') !== false) {
            $data = $_POST;
            
            // Handle file uploads if any
            if (!empty($_FILES)) {
                foreach ($_FILES as $key => $file) {
                    if ($file['error'] === UPLOAD_ERR_OK) {
                        $data[$key] = $file;
                    }
                }
            }
            
            return $data;
        } else {
            return getRequestBody();
        }
    }
    
    // Helper method to validate attachment data
    private function validateAttachment($attachment) {
        if (!is_array($attachment)) {
            return false;
        }
        
        $requiredFields = ['id', 'name', 'url', 'type', 'size'];
        foreach ($requiredFields as $field) {
            if (!isset($attachment[$field])) {
                return false;
            }
        }
        
        // Validate file size (max 50MB)
        if ($attachment['size'] > 50 * 1024 * 1024) {
            return false;
        }
        
        // Validate URL format
        if (!filter_var($attachment['url'], FILTER_VALIDATE_URL)) {
            return false;
        }
        
        return true;
    }
    
    // Helper method to delete attachment files
    private function deleteAttachmentFile($url) {
        // Extract file path from URL
        $path = parse_url($url, PHP_URL_PATH);
        $filePath = __DIR__ . '/../../public' . $path;
        
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
    
    // Helper method to calculate reading time
    private function calculateReadingTime($content) {
        $wordCount = str_word_count(strip_tags($content));
        $readingTimeMinutes = ceil($wordCount / 200); // Average reading speed: 200 words per minute
        return $readingTimeMinutes . ' phút đọc';
    }
    
    // Helper method to generate content metadata
    private function generateMetadata($content) {
        $plainText = strip_tags($content);
        
        return [
            'wordCount' => str_word_count($plainText),
            'characterCount' => strlen($plainText),
            'paragraphCount' => substr_count($content, '<p>'),
            'imageCount' => substr_count($content, '<img'),
            'linkCount' => substr_count($content, '<a'),
            'lastUpdated' => date('Y-m-d H:i:s')
        ];
    }
    
    // Generate SEO-friendly slug
    private function generateSlug($title) {
        // Convert Vietnamese characters
        $slug = $this->removeVietnameseAccents($title);
        
        // Convert to lowercase and replace spaces with hyphens
        $slug = strtolower(trim($slug));
        $slug = preg_replace('/[^a-z0-9\-]/', '', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        
        // Ensure uniqueness
        $originalSlug = $slug;
        $counter = 1;
        while ($this->newsModel->slugExists($slug)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }
    
    // Remove Vietnamese accents
    private function removeVietnameseAccents($str) {
        $accents = [
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
        
        return str_replace($accents, $replacements, $str);
    }
    
    // Check if category exists
    private function categoryExists($categoryId) {
        require_once __DIR__ . '/../models/Category.php';
        $categoryModel = new Category();
        $category = $categoryModel->getById($categoryId);
        return !empty($category);
    }
}
?> 