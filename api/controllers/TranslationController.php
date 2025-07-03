<?php

require_once __DIR__ . '/../config/database.php';

class TranslationController {
    private $pdo;
    
    public function __construct() {
        $database = getDatabase();
        $this->pdo = $database->getConnection();
    }
    
    // Get all translations with pagination and filtering
    public function getTranslations() {
        $page = $_GET['page'] ?? 1;
        $limit = $_GET['limit'] ?? 20;
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        
        if ($category === 'all' || $category === '') {
            $category = null;
        }
        
        try {
            $offset = ($page - 1) * $limit;
            
            // Base query
            $whereConditions = ['1=1'];
            $params = [];
            
            // Add category filter
            if ($category) {
                $whereConditions[] = 'category = :category';
                $params[':category'] = $category;
            }
            
            // Add search filter
            if ($search) {
                $whereConditions[] = '(`key` LIKE :search OR vietnamese LIKE :search OR english LIKE :search)';
                $params[':search'] = '%' . $search . '%';
            }
            
            $whereClause = implode(' AND ', $whereConditions);
            
            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM translations WHERE $whereClause";
            $countStmt = $this->pdo->prepare($countSql);
            $countStmt->execute($params);
            $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Get translations
            $sql = "SELECT * FROM translations WHERE $whereClause ORDER BY category, `key` LIMIT :limit OFFSET :offset";
            $stmt = $this->pdo->prepare($sql);
            
            // Bind parameters
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            
            $stmt->execute();
            $translations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get categories
            $categoriesSql = "SELECT DISTINCT category FROM translations ORDER BY category";
            $categoriesStmt = $this->pdo->query($categoriesSql);
            $categories = $categoriesStmt->fetchAll(PDO::FETCH_COLUMN);
            
            sendSuccessResponse([
                'translations' => $translations,
                'total' => (int)$total,
                'page' => (int)$page,
                'limit' => (int)$limit,
                'categories' => array_map(function($cat) {
                    return ['id' => $cat, 'name' => ucfirst($cat)];
                }, $categories)
            ]);
            
        } catch (PDOException $e) {
            sendErrorResponse("Database error: " . $e->getMessage(), 500);
        }
    }
    
    // Get single translation by ID
    public function getTranslation($id) {
        try {
            $sql = "SELECT * FROM translations WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $translation = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$translation) {
                sendErrorResponse("Translation not found", 404);
                return;
            }
            
            sendSuccessResponse($translation);
            
        } catch (PDOException $e) {
            sendErrorResponse("Database error: " . $e->getMessage(), 500);
        }
    }
    
    // Create new translation
    public function createTranslation() {
        $data = getRequestBody();
        
        try {
            // Validate required fields
            $requiredFields = ['key', 'vietnamese', 'english', 'category'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    sendErrorResponse("Field '$field' is required", 400);
                    return;
                }
            }
            
            // Check if key already exists
            $checkSql = "SELECT id FROM translations WHERE `key` = :key";
            $checkStmt = $this->pdo->prepare($checkSql);
            $checkStmt->bindParam(':key', $data['key']);
            $checkStmt->execute();
            
            if ($checkStmt->fetch()) {
                sendErrorResponse("Translation key already exists", 400);
                return;
            }
            
            $sql = "INSERT INTO translations (`key`, vietnamese, english, category, description, is_active, created_at, updated_at) 
                    VALUES (:key, :vietnamese, :english, :category, :description, :is_active, NOW(), NOW())";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':key', $data['key']);
            $stmt->bindParam(':vietnamese', $data['vietnamese']);
            $stmt->bindParam(':english', $data['english']);
            $stmt->bindParam(':category', $data['category']);
            $stmt->bindParam(':description', $data['description'] ?? '');
            $stmt->bindParam(':is_active', $data['is_active'] ?? true, PDO::PARAM_BOOL);
            
            $stmt->execute();
            
            $id = $this->pdo->lastInsertId();
            
            // Get the created translation
            $sql = "SELECT * FROM translations WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $translation = $stmt->fetch(PDO::FETCH_ASSOC);
            
            sendSuccessResponse($translation, "Translation created successfully");
            
        } catch (PDOException $e) {
            sendErrorResponse("Database error: " . $e->getMessage(), 500);
        }
    }
    
    // Update translation
    public function updateTranslation($id) {
        $data = getRequestBody();
        
        try {
            // Check if translation exists
            $existingSql = "SELECT * FROM translations WHERE id = :id";
            $existingStmt = $this->pdo->prepare($existingSql);
            $existingStmt->bindParam(':id', $id, PDO::PARAM_INT);
            $existingStmt->execute();
            $existing = $existingStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$existing) {
                sendErrorResponse("Translation not found", 404);
                return;
            }
            
            // Check if key conflicts with another translation
            if (isset($data['key']) && $data['key'] !== $existing['key']) {
                $checkSql = "SELECT id FROM translations WHERE `key` = :key AND id != :id";
                $checkStmt = $this->pdo->prepare($checkSql);
                $checkStmt->bindParam(':key', $data['key']);
                $checkStmt->bindParam(':id', $id, PDO::PARAM_INT);
                $checkStmt->execute();
                
                if ($checkStmt->fetch()) {
                    sendErrorResponse("Translation key already exists", 400);
                    return;
                }
            }
            
            $sql = "UPDATE translations SET 
                    `key` = :key, 
                    vietnamese = :vietnamese, 
                    english = :english, 
                    category = :category, 
                    description = :description, 
                    is_active = :is_active, 
                    updated_at = NOW() 
                    WHERE id = :id";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':key', $data['key'] ?? $existing['key']);
            $stmt->bindParam(':vietnamese', $data['vietnamese'] ?? $existing['vietnamese']);
            $stmt->bindParam(':english', $data['english'] ?? $existing['english']);
            $stmt->bindParam(':category', $data['category'] ?? $existing['category']);
            $stmt->bindParam(':description', $data['description'] ?? $existing['description']);
            $stmt->bindParam(':is_active', $data['is_active'] ?? $existing['is_active'], PDO::PARAM_BOOL);
            
            $stmt->execute();
            
            // Get updated translation
            $updatedSql = "SELECT * FROM translations WHERE id = :id";
            $updatedStmt = $this->pdo->prepare($updatedSql);
            $updatedStmt->bindParam(':id', $id, PDO::PARAM_INT);
            $updatedStmt->execute();
            $translation = $updatedStmt->fetch(PDO::FETCH_ASSOC);
            
            sendSuccessResponse($translation, "Translation updated successfully");
            
        } catch (PDOException $e) {
            sendErrorResponse("Database error: " . $e->getMessage(), 500);
        }
    }
    
    // Delete translation
    public function deleteTranslation($id) {
        try {
            // Check if translation exists
            $checkSql = "SELECT id FROM translations WHERE id = :id";
            $checkStmt = $this->pdo->prepare($checkSql);
            $checkStmt->bindParam(':id', $id, PDO::PARAM_INT);
            $checkStmt->execute();
            
            if (!$checkStmt->fetch()) {
                sendErrorResponse("Translation not found", 404);
                return;
            }
            
            $sql = "DELETE FROM translations WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            
            $stmt->execute();
            
            sendSuccessResponse(null, "Translation deleted successfully");
            
        } catch (PDOException $e) {
            sendErrorResponse("Database error: " . $e->getMessage(), 500);
        }
    }
    
    // Export translations to JSON
    public function exportTranslations() {
        $category = $_GET['category'] ?? null;
        
        try {
            $whereClause = $category ? "WHERE category = :category" : "";
            
            $sql = "SELECT `key`, vietnamese, english, category, description FROM translations $whereClause ORDER BY category, `key`";
            $stmt = $this->pdo->prepare($sql);
            
            if ($category) {
                $stmt->bindParam(':category', $category);
            }
            
            $stmt->execute();
            $translations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Group by category
            $grouped = [];
            foreach ($translations as $translation) {
                $grouped[$translation['category']][$translation['key']] = [
                    'vi' => $translation['vietnamese'],
                    'en' => $translation['english'],
                    'description' => $translation['description']
                ];
            }
            
            header('Content-Type: application/json');
            header('Content-Disposition: attachment; filename="translations.json"');
            echo json_encode($grouped, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
        } catch (PDOException $e) {
            sendErrorResponse("Database error: " . $e->getMessage(), 500);
        }
    }
    
    // Import translations from JSON
    public function importTranslations() {
        try {
            if (!isset($_FILES['file'])) {
                sendErrorResponse('No file uploaded', 400);
                return;
            }
            
            $file = $_FILES['file'];
            $jsonData = file_get_contents($file['tmp_name']);
            
            $data = json_decode($jsonData, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                sendErrorResponse("Invalid JSON format", 400);
                return;
            }
            
            $success = 0;
            $errors = [];
            
            $this->pdo->beginTransaction();
            
            foreach ($data as $category => $translations) {
                foreach ($translations as $key => $values) {
                    try {
                        $translationData = [
                            'key' => $key,
                            'vietnamese' => $values['vi'] ?? '',
                            'english' => $values['en'] ?? '',
                            'category' => $category,
                            'description' => $values['description'] ?? '',
                            'is_active' => true
                        ];
                        
                        // Try to update first, if not exists then create
                        $checkSql = "SELECT id FROM translations WHERE `key` = :key";
                        $checkStmt = $this->pdo->prepare($checkSql);
                        $checkStmt->bindParam(':key', $key);
                        $checkStmt->execute();
                        
                        if ($existing = $checkStmt->fetch()) {
                            // Update existing
                            $updateSql = "UPDATE translations SET vietnamese = :vietnamese, english = :english, category = :category, description = :description WHERE id = :id";
                            $updateStmt = $this->pdo->prepare($updateSql);
                            $updateStmt->bindParam(':id', $existing['id']);
                            $updateStmt->bindParam(':vietnamese', $translationData['vietnamese']);
                            $updateStmt->bindParam(':english', $translationData['english']);
                            $updateStmt->bindParam(':category', $translationData['category']);
                            $updateStmt->bindParam(':description', $translationData['description']);
                            $updateStmt->execute();
                        } else {
                            // Create new
                            $insertSql = "INSERT INTO translations (`key`, vietnamese, english, category, description, is_active) VALUES (:key, :vietnamese, :english, :category, :description, :is_active)";
                            $insertStmt = $this->pdo->prepare($insertSql);
                            $insertStmt->bindParam(':key', $translationData['key']);
                            $insertStmt->bindParam(':vietnamese', $translationData['vietnamese']);
                            $insertStmt->bindParam(':english', $translationData['english']);
                            $insertStmt->bindParam(':category', $translationData['category']);
                            $insertStmt->bindParam(':description', $translationData['description']);
                            $insertStmt->bindParam(':is_active', $translationData['is_active'], PDO::PARAM_BOOL);
                            $insertStmt->execute();
                        }
                        
                        $success++;
                    } catch (Exception $e) {
                        $errors[] = "Key '$key': " . $e->getMessage();
                    }
                }
            }
            
            $this->pdo->commit();
            
            sendSuccessResponse([
                'success' => $success,
                'errors' => $errors
            ], "Import completed");
            
        } catch (Exception $e) {
            $this->pdo->rollBack();
            sendErrorResponse("Import failed: " . $e->getMessage(), 500);
        }
    }
    
    // Sync translations with frontend translation files
    public function syncTranslations() {
        try {
            // This would typically read from your frontend translation files
            // For now, we'll return a placeholder response
            sendSuccessResponse([
                'updated' => 0,
                'added' => 0
            ], "Sync completed");
        } catch (Exception $e) {
            sendErrorResponse("Sync failed: " . $e->getMessage(), 500);
        }
    }
}

?> 