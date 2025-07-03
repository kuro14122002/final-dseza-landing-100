<?php
// api/controllers/MediaController.php
require_once __DIR__ . '/../core/auth.php';

class MediaController {
    private $pdo;
    private $config;
    
    // Upload directory configurations
    private const UPLOAD_DIR = __DIR__ . '/../../public/uploads/';
    private const THUMB_DIR = __DIR__ . '/../../public/uploads/thumbnails/';
    private const CDN_BASE_URL = 'https://cdn.dseza.gov.vn/'; // CDN URL for production
    
    // File type configurations
    private const ALLOWED_IMAGE_TYPES = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
        'image/webp', 'image/svg+xml'
    ];
    
    private const ALLOWED_VIDEO_TYPES = [
        'video/mp4', 'video/webm', 'video/quicktime', 'video/avi'
    ];
    
    private const ALLOWED_DOCUMENT_TYPES = [
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    // Size limits (in bytes)
    private const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
    private const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024; // 25MB
    
    // Thumbnail sizes
    private const THUMBNAIL_SIZES = [
        'small' => ['width' => 150, 'height' => 150],
        'medium' => ['width' => 300, 'height' => 300],
        'large' => ['width' => 600, 'height' => 600]
    ];
    
    public function __construct() {
        try {
            require_once __DIR__ . '/../config/database.php';
            $this->pdo = new PDO($dsn, $username, $password, $options);
            
            // Create directories if they don't exist
            $this->createDirectories();
            
            // Initialize database tables
            $this->initializeDatabase();
            
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            sendErrorResponse('Database connection failed', 500);
        }
    }
    
    /**
     * Create necessary directories
     */
    private function createDirectories() {
        $dirs = [
            self::UPLOAD_DIR,
            self::THUMB_DIR,
            self::UPLOAD_DIR . 'images/',
            self::UPLOAD_DIR . 'videos/',
            self::UPLOAD_DIR . 'documents/',
            self::UPLOAD_DIR . 'optimized/',
            self::THUMB_DIR . 'images/',
            self::THUMB_DIR . 'videos/'
        ];
        
        foreach ($dirs as $dir) {
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }
        }
    }
    
    /**
     * Initialize database tables
     */
    private function initializeDatabase() {
        try {
            // Media files table
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS media_files (
                    id VARCHAR(36) PRIMARY KEY,
                    filename VARCHAR(255) NOT NULL,
                    original_name VARCHAR(255) NOT NULL,
                    mime_type VARCHAR(100) NOT NULL,
                    file_size BIGINT NOT NULL,
                    file_path VARCHAR(500) NOT NULL,
                    thumbnail_path VARCHAR(500),
                    folder_id VARCHAR(36),
                    alt_text TEXT,
                    caption TEXT,
                    metadata JSON,
                    uploaded_by VARCHAR(100) NOT NULL,
                    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    is_optimized BOOLEAN DEFAULT FALSE,
                    cdn_url VARCHAR(500),
                    INDEX idx_folder_id (folder_id),
                    INDEX idx_mime_type (mime_type),
                    INDEX idx_uploaded_at (uploaded_at)
                )
            ");
            
            // Media folders table
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS media_folders (
                    id VARCHAR(36) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    parent_id VARCHAR(36),
                    created_by VARCHAR(100) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_parent_id (parent_id),
                    INDEX idx_slug (slug)
                )
            ");
            
        } catch (PDOException $e) {
            error_log("Database initialization failed: " . $e->getMessage());
        }
    }
    
    /**
     * Get media files with filtering and pagination
     */
    public function index() {
        try {
            $page = (int)($_GET['page'] ?? 1);
            $limit = (int)($_GET['limit'] ?? 20);
            $folderId = $_GET['folderId'] ?? null;
            $type = $_GET['type'] ?? 'all';
            $search = $_GET['search'] ?? '';
            $sortBy = $_GET['sortBy'] ?? 'uploaded_at';
            $sortOrder = $_GET['sortOrder'] ?? 'desc';
            
            $offset = ($page - 1) * $limit;
            
            // Build query conditions
            $conditions = [];
            $params = [];
            
            if ($folderId) {
                $conditions[] = "folder_id = :folderId";
                $params['folderId'] = $folderId;
            }
            
            if ($type !== 'all') {
                switch ($type) {
                    case 'image':
                        $conditions[] = "mime_type LIKE 'image/%'";
                        break;
                    case 'video':
                        $conditions[] = "mime_type LIKE 'video/%'";
                        break;
                    case 'document':
                        $conditions[] = "mime_type LIKE 'application/%'";
                        break;
                }
            }
            
            if ($search) {
                $conditions[] = "(original_name LIKE :search OR alt_text LIKE :search OR caption LIKE :search)";
                $params['search'] = "%$search%";
            }
            
            $whereClause = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';
            $orderClause = "ORDER BY $sortBy $sortOrder";
            
            // Get total count
            $countSql = "SELECT COUNT(*) FROM media_files $whereClause";
            $countStmt = $this->pdo->prepare($countSql);
            $countStmt->execute($params);
            $totalItems = (int)$countStmt->fetchColumn();
            
            // Get files
            $sql = "
                SELECT *, 
                       CASE 
                           WHEN cdn_url IS NOT NULL THEN cdn_url
                           ELSE CONCAT('/uploads/', file_path)
                       END as url,
                       CASE 
                           WHEN thumbnail_path IS NOT NULL THEN 
                               CASE 
                                   WHEN cdn_url IS NOT NULL THEN CONCAT('" . self::CDN_BASE_URL . "', thumbnail_path)
                                   ELSE CONCAT('/uploads/thumbnails/', thumbnail_path)
                               END
                           ELSE NULL
                       END as thumbnail_url
                FROM media_files 
                $whereClause 
                $orderClause 
                LIMIT :limit OFFSET :offset
            ";
            
            $stmt = $this->pdo->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue('offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $files = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get folders
            $folderSql = "SELECT * FROM media_folders ORDER BY name ASC";
            $folderStmt = $this->pdo->query($folderSql);
            $folders = $folderStmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Calculate pagination
            $totalPages = ceil($totalItems / $limit);
            
            sendSuccessResponse([
                'files' => $files,
                'folders' => $folders,
                'pagination' => [
                    'currentPage' => $page,
                    'totalPages' => $totalPages,
                    'totalItems' => $totalItems,
                    'itemsPerPage' => $limit,
                    'hasNextPage' => $page < $totalPages,
                    'hasPrevPage' => $page > 1
                ]
            ]);
            
        } catch (Exception $e) {
            error_log("Media index error: " . $e->getMessage());
            sendErrorResponse('Could not fetch media files', 500);
        }
    }
    
    /**
     * Upload media file(s) with optimization
     */
    public function upload() {
        try {
            if (!isAuthenticated()) {
                sendErrorResponse('Authentication required', 401);
                return;
            }
            
            if (!isset($_FILES['file'])) {
                sendErrorResponse('No file uploaded', 400);
                return;
            }
            
            $file = $_FILES['file'];
            $folderId = $_POST['folderId'] ?? null;
            $altText = $_POST['altText'] ?? '';
            $caption = $_POST['caption'] ?? '';
            
            // Validate file
            $validation = $this->validateFile($file);
            if (!$validation['valid']) {
                sendErrorResponse($validation['error'], 400);
                return;
            }
            
            // Generate unique filename
            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $uniqueId = uniqid() . '_' . time();
            $safeFilename = $uniqueId . '.' . $fileExtension;
            
            // Determine file category and upload path
            $fileCategory = $this->getFileCategory($file['type']);
            $uploadPath = self::UPLOAD_DIR . $fileCategory . 's/' . $safeFilename;
            $relativePath = $fileCategory . 's/' . $safeFilename;
            
            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
                sendErrorResponse('Failed to save uploaded file', 500);
                return;
            }
            
            // Generate metadata
            $metadata = $this->generateMetadata($uploadPath, $file['type']);
            
            // Optimize and create thumbnails
            $thumbnailPath = null;
            $isOptimized = false;
            
            if ($fileCategory === 'image') {
                $thumbnailPath = $this->createImageThumbnails($uploadPath, $safeFilename);
                $isOptimized = $this->optimizeImage($uploadPath);
            } elseif ($fileCategory === 'video') {
                $thumbnailPath = $this->createVideoThumbnail($uploadPath, $safeFilename);
            }
            
            // Save to database
            $mediaId = $this->generateUUID();
            $sql = "
                INSERT INTO media_files (
                    id, filename, original_name, mime_type, file_size, 
                    file_path, thumbnail_path, folder_id, alt_text, caption, 
                    metadata, uploaded_by, is_optimized
                ) VALUES (
                    :id, :filename, :original_name, :mime_type, :file_size,
                    :file_path, :thumbnail_path, :folder_id, :alt_text, :caption,
                    :metadata, :uploaded_by, :is_optimized
                )
            ";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                'id' => $mediaId,
                'filename' => $safeFilename,
                'original_name' => $file['name'],
                'mime_type' => $file['type'],
                'file_size' => $file['size'],
                'file_path' => $relativePath,
                'thumbnail_path' => $thumbnailPath,
                'folder_id' => $folderId,
                'alt_text' => $altText,
                'caption' => $caption,
                'metadata' => json_encode($metadata),
                'uploaded_by' => getCurrentUser()['email'] ?? 'system',
                'is_optimized' => $isOptimized
            ]);
            
            // Get the created file data
            $createdFile = $this->getFileById($mediaId);
            
            sendSuccessResponse($createdFile, 'File uploaded successfully');
            
        } catch (Exception $e) {
            error_log("Media upload error: " . $e->getMessage());
            sendErrorResponse('Upload failed', 500);
        }
    }
    
    /**
     * Validate uploaded file
     */
    private function validateFile($file) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['valid' => false, 'error' => 'Upload error occurred'];
        }
        
        $allowedTypes = array_merge(
            self::ALLOWED_IMAGE_TYPES,
            self::ALLOWED_VIDEO_TYPES,
            self::ALLOWED_DOCUMENT_TYPES
        );
        
        if (!in_array($file['type'], $allowedTypes)) {
            return ['valid' => false, 'error' => 'File type not allowed'];
        }
        
        // Check file size based on type
        $maxSize = $this->getMaxFileSize($file['type']);
        if ($file['size'] > $maxSize) {
            $maxSizeMB = round($maxSize / (1024 * 1024), 1);
            return ['valid' => false, 'error' => "File too large. Maximum size: {$maxSizeMB}MB"];
        }
        
        return ['valid' => true];
    }
    
    /**
     * Get maximum file size based on type
     */
    private function getMaxFileSize($mimeType) {
        if (in_array($mimeType, self::ALLOWED_IMAGE_TYPES)) {
            return self::MAX_IMAGE_SIZE;
        } elseif (in_array($mimeType, self::ALLOWED_VIDEO_TYPES)) {
            return self::MAX_VIDEO_SIZE;
        } else {
            return self::MAX_DOCUMENT_SIZE;
        }
    }
    
    /**
     * Get file category
     */
    private function getFileCategory($mimeType) {
        if (in_array($mimeType, self::ALLOWED_IMAGE_TYPES)) {
            return 'image';
        } elseif (in_array($mimeType, self::ALLOWED_VIDEO_TYPES)) {
            return 'video';
        } else {
            return 'document';
        }
    }
    
    /**
     * Generate file metadata
     */
    private function generateMetadata($filePath, $mimeType) {
        $metadata = [];
        
        if (strpos($mimeType, 'image/') === 0) {
            $imageInfo = getimagesize($filePath);
            if ($imageInfo) {
                $metadata['width'] = $imageInfo[0];
                $metadata['height'] = $imageInfo[1];
                $metadata['format'] = $imageInfo['mime'];
            }
        } elseif (strpos($mimeType, 'video/') === 0) {
            // For video metadata, you might want to use FFmpeg
            // This is a simplified version
            $metadata['format'] = $mimeType;
            // Add more video-specific metadata as needed
        }
        
        return $metadata;
    }
    
    /**
     * Create image thumbnails
     */
    private function createImageThumbnails($imagePath, $filename) {
        try {
            $pathInfo = pathinfo($filename);
            $baseName = $pathInfo['filename'];
            $extension = $pathInfo['extension'];
            
            // Create thumbnails for each size
            foreach (self::THUMBNAIL_SIZES as $sizeName => $dimensions) {
                $thumbnailName = $baseName . '_' . $sizeName . '.' . $extension;
                $thumbnailPath = self::THUMB_DIR . 'images/' . $thumbnailName;
                
                $this->resizeImage($imagePath, $thumbnailPath, $dimensions['width'], $dimensions['height']);
            }
            
            // Return the medium thumbnail path for main usage
            return 'images/' . $baseName . '_medium.' . $extension;
            
        } catch (Exception $e) {
            error_log("Thumbnail creation error: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Resize image
     */
    private function resizeImage($sourcePath, $destPath, $width, $height) {
        $imageInfo = getimagesize($sourcePath);
        if (!$imageInfo) return false;
        
        $sourceWidth = $imageInfo[0];
        $sourceHeight = $imageInfo[1];
        $mimeType = $imageInfo['mime'];
        
        // Calculate resize dimensions maintaining aspect ratio
        $ratio = min($width / $sourceWidth, $height / $sourceHeight);
        $newWidth = (int)($sourceWidth * $ratio);
        $newHeight = (int)($sourceHeight * $ratio);
        
        // Create source image resource
        switch ($mimeType) {
            case 'image/jpeg':
                $sourceImage = imagecreatefromjpeg($sourcePath);
                break;
            case 'image/png':
                $sourceImage = imagecreatefrompng($sourcePath);
                break;
            case 'image/gif':
                $sourceImage = imagecreatefromgif($sourcePath);
                break;
            default:
                return false;
        }
        
        if (!$sourceImage) return false;
        
        // Create new image
        $newImage = imagecreatetruecolor($newWidth, $newHeight);
        
        // Preserve transparency for PNG and GIF
        if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
            imagealphablending($newImage, false);
            imagesavealpha($newImage, true);
            $transparent = imagecolorallocatealpha($newImage, 255, 255, 255, 127);
            imagefilledrectangle($newImage, 0, 0, $newWidth, $newHeight, $transparent);
        }
        
        // Resize
        imagecopyresampled($newImage, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $sourceWidth, $sourceHeight);
        
        // Save image
        switch ($mimeType) {
            case 'image/jpeg':
                imagejpeg($newImage, $destPath, 85);
                break;
            case 'image/png':
                imagepng($newImage, $destPath, 6);
                break;
            case 'image/gif':
                imagegif($newImage, $destPath);
                break;
        }
        
        // Clean up
        imagedestroy($sourceImage);
        imagedestroy($newImage);
        
        return true;
    }
    
    /**
     * Optimize image (convert to WebP if possible)
     */
    private function optimizeImage($imagePath) {
        try {
            if (!function_exists('imagewebp')) {
                return false; // WebP not supported
            }
            
            $pathInfo = pathinfo($imagePath);
            $webpPath = self::UPLOAD_DIR . 'optimized/' . $pathInfo['filename'] . '.webp';
            
            $imageInfo = getimagesize($imagePath);
            if (!$imageInfo) return false;
            
            // Create source image
            switch ($imageInfo['mime']) {
                case 'image/jpeg':
                    $image = imagecreatefromjpeg($imagePath);
                    break;
                case 'image/png':
                    $image = imagecreatefrompng($imagePath);
                    break;
                default:
                    return false;
            }
            
            if (!$image) return false;
            
            // Convert to WebP
            $result = imagewebp($image, $webpPath, 80);
            imagedestroy($image);
            
            return $result;
            
        } catch (Exception $e) {
            error_log("Image optimization error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Create video thumbnail
     */
    private function createVideoThumbnail($videoPath, $filename) {
        // This would require FFmpeg for proper video thumbnail generation
        // For now, return null - implement FFmpeg integration as needed
        return null;
    }
    
    /**
     * Delete media file
     */
    public function delete($id) {
        try {
            if (!isAuthenticated()) {
                sendErrorResponse('Authentication required', 401);
                return;
            }
            
            // Get file data
            $file = $this->getFileById($id);
            if (!$file) {
                sendErrorResponse('File not found', 404);
                return;
            }
            
            // Delete physical files
            $fullPath = self::UPLOAD_DIR . $file['file_path'];
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
            
            // Delete thumbnail if exists
            if ($file['thumbnail_path']) {
                $thumbnailPath = self::THUMB_DIR . $file['thumbnail_path'];
                if (file_exists($thumbnailPath)) {
                    unlink($thumbnailPath);
                }
            }
            
            // Delete from database
            $stmt = $this->pdo->prepare("DELETE FROM media_files WHERE id = :id");
            $stmt->execute(['id' => $id]);
            
            sendSuccessResponse(null, 'File deleted successfully');
            
        } catch (Exception $e) {
            error_log("Media delete error: " . $e->getMessage());
            sendErrorResponse('Delete failed', 500);
        }
    }
    
    /**
     * Create folder
     */
    public function createFolder() {
        try {
            if (!isAuthenticated()) {
                sendErrorResponse('Authentication required', 401);
                return;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $name = trim($input['name'] ?? '');
            $parentId = $input['parentId'] ?? null;
            
            if (empty($name)) {
                sendErrorResponse('Folder name is required', 400);
                return;
            }
            
            $slug = $this->generateSlug($name);
            $folderId = $this->generateUUID();
            
            $stmt = $this->pdo->prepare("
                INSERT INTO media_folders (id, name, slug, parent_id, created_by) 
                VALUES (:id, :name, :slug, :parent_id, :created_by)
            ");
            
            $stmt->execute([
                'id' => $folderId,
                'name' => $name,
                'slug' => $slug,
                'parent_id' => $parentId,
                'created_by' => getCurrentUser()['email'] ?? 'system'
            ]);
            
            $folder = $this->getFolderById($folderId);
            sendSuccessResponse($folder, 'Folder created successfully');
            
        } catch (Exception $e) {
            error_log("Create folder error: " . $e->getMessage());
            sendErrorResponse('Could not create folder', 500);
        }
    }
    
    /**
     * Get file by ID
     */
    private function getFileById($id) {
        $stmt = $this->pdo->prepare("
            SELECT *,
                   CASE 
                       WHEN cdn_url IS NOT NULL THEN cdn_url
                       ELSE CONCAT('/uploads/', file_path)
                   END as url,
                   CASE 
                       WHEN thumbnail_path IS NOT NULL THEN 
                           CASE 
                               WHEN cdn_url IS NOT NULL THEN CONCAT('" . self::CDN_BASE_URL . "', thumbnail_path)
                               ELSE CONCAT('/uploads/thumbnails/', thumbnail_path)
                           END
                       ELSE NULL
                   END as thumbnail_url
            FROM media_files 
            WHERE id = :id
        ");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * Get folder by ID
     */
    private function getFolderById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM media_folders WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * Generate UUID
     */
    private function generateUUID() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
    
    /**
     * Generate slug from text
     */
    private function generateSlug($text) {
        $slug = strtolower(trim($text));
        $slug = preg_replace('/[^a-z0-9-]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        return trim($slug, '-');
    }
}
?>