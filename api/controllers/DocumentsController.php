<?php

class DocumentsController
{
    private $conn;

    public function __construct($connection)
    {
        $this->conn = $connection;
    }

    public function getDocuments($request)
    {
        try {
            // Get query parameters
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';
            $documentType = isset($_GET['documentType']) ? $_GET['documentType'] : '';
            $sortBy = isset($_GET['sortBy']) ? $_GET['sortBy'] : 'created_at';
            $sortDirection = isset($_GET['sortDirection']) ? $_GET['sortDirection'] : 'DESC';

            // Validate sort fields
            $allowedSortFields = ['title', 'created_at', 'issued_date'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'created_at';
            }

            // Validate sort direction
            $sortDirection = strtoupper($sortDirection);
            if (!in_array($sortDirection, ['ASC', 'DESC'])) {
                $sortDirection = 'DESC';
            }

            // Build WHERE clause
            $whereConditions = [];
            $params = [];

            if (!empty($searchTerm)) {
                $whereConditions[] = "(title LIKE ? OR description LIKE ?)";
                $params[] = "%$searchTerm%";
                $params[] = "%$searchTerm%";
            }

            if (!empty($documentType)) {
                $whereConditions[] = "document_type = ?";
                $params[] = $documentType;
            }

            $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

            // Get total count
            $countQuery = "SELECT COUNT(*) as total FROM legal_documents $whereClause";
            $countStmt = $this->conn->prepare($countQuery);
            if (!empty($params)) {
                $countStmt->execute($params);
            } else {
                $countStmt->execute();
            }
            $totalItems = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

            // Calculate pagination
            $totalPages = ceil($totalItems / $limit);
            $offset = ($page - 1) * $limit;

            // Get documents
            $query = "SELECT id, title, description, document_type, document_field, 
                            issuing_agency, issuing_level, document_number, 
                            issued_date, effective_date, file_path, created_at, updated_at
                     FROM legal_documents 
                     $whereClause 
                     ORDER BY $sortBy $sortDirection 
                     LIMIT ? OFFSET ?";

            $stmt = $this->conn->prepare($query);
            $executeParams = array_merge($params, [$limit, $offset]);
            $stmt->execute($executeParams);
            $documents = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'data' => $documents,
                'pagination' => [
                    'currentPage' => $page,
                    'totalPages' => $totalPages,
                    'totalItems' => (int)$totalItems,
                    'itemsPerPage' => $limit
                ]
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching documents: ' . $e->getMessage()
            ];
        }
    }

    public function getDocument($id)
    {
        try {
            $query = "SELECT id, title, description, document_type, document_field, 
                            issuing_agency, issuing_level, document_number, 
                            issued_date, effective_date, file_path, created_at, updated_at
                     FROM legal_documents WHERE id = ?";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            $document = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$document) {
                return [
                    'success' => false,
                    'message' => 'Document not found'
                ];
            }

            return [
                'success' => true,
                'data' => $document
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching document: ' . $e->getMessage()
            ];
        }
    }

    public function createDocument($request)
    {
        try {
            // Get JSON data
            $input = json_decode(file_get_contents('php://input'), true);

            // Handle file upload
            $filePath = null;
            if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
                $filePath = $this->handleFileUpload($_FILES['file']);
                if (!$filePath) {
                    return [
                        'success' => false,
                        'message' => 'File upload failed'
                    ];
                }
            }

            // Insert document
            $query = "INSERT INTO legal_documents (
                        title, description, document_type, document_field, 
                        issuing_agency, issuing_level, document_number, 
                        issued_date, effective_date, file_path, created_at, updated_at
                      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";

            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $input['title'],
                $input['description'] ?? null,
                $input['document_type'],
                $input['document_field'] ?? null,
                $input['issuing_agency'] ?? null,
                $input['issuing_level'] ?? null,
                $input['document_number'] ?? null,
                $input['issued_date'] ?? null,
                $input['effective_date'] ?? null,
                $filePath
            ]);

            $documentId = $this->conn->lastInsertId();

            return [
                'success' => true,
                'data' => ['id' => $documentId],
                'message' => 'Document created successfully'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error creating document: ' . $e->getMessage()
            ];
        }
    }

    public function updateDocument($id, $request)
    {
        try {
            // Get JSON data
            $input = json_decode(file_get_contents('php://input'), true);

            // Check if document exists
            $checkQuery = "SELECT id, file_path FROM legal_documents WHERE id = ?";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->execute([$id]);
            $existingDocument = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if (!$existingDocument) {
                return [
                    'success' => false,
                    'message' => 'Document not found'
                ];
            }

            // Handle file upload if new file provided
            $filePath = $existingDocument['file_path'];
            if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
                $newFilePath = $this->handleFileUpload($_FILES['file']);
                if ($newFilePath) {
                    // Delete old file
                    if ($filePath && file_exists($filePath)) {
                        unlink($filePath);
                    }
                    $filePath = $newFilePath;
                }
            }

            // Update document
            $query = "UPDATE legal_documents SET 
                        title = ?, description = ?, document_type = ?, document_field = ?, 
                        issuing_agency = ?, issuing_level = ?, document_number = ?, 
                        issued_date = ?, effective_date = ?, file_path = ?, updated_at = NOW()
                      WHERE id = ?";

            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                $input['title'],
                $input['description'] ?? null,
                $input['document_type'],
                $input['document_field'] ?? null,
                $input['issuing_agency'] ?? null,
                $input['issuing_level'] ?? null,
                $input['document_number'] ?? null,
                $input['issued_date'] ?? null,
                $input['effective_date'] ?? null,
                $filePath,
                $id
            ]);

            return [
                'success' => true,
                'message' => 'Document updated successfully'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error updating document: ' . $e->getMessage()
            ];
        }
    }

    public function deleteDocument($id)
    {
        try {
            // Get document to delete file
            $query = "SELECT file_path FROM legal_documents WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            $document = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$document) {
                return [
                    'success' => false,
                    'message' => 'Document not found'
                ];
            }

            // Delete file if exists
            if ($document['file_path'] && file_exists($document['file_path'])) {
                unlink($document['file_path']);
            }

            // Delete from database
            $deleteQuery = "DELETE FROM legal_documents WHERE id = ?";
            $deleteStmt = $this->conn->prepare($deleteQuery);
            $deleteStmt->execute([$id]);

            return [
                'success' => true,
                'message' => 'Document deleted successfully'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error deleting document: ' . $e->getMessage()
            ];
        }
    }

    private function handleFileUpload($file)
    {
        $allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        $maxSize = 10 * 1024 * 1024; // 10MB

        if (!in_array($file['type'], $allowedTypes)) {
            return false;
        }

        if ($file['size'] > $maxSize) {
            return false;
        }

        // Create upload directory if not exists
        $uploadDir = '../uploads/documents/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid('doc_') . '.' . $extension;
        $filePath = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            return 'uploads/documents/' . $filename;
        }

        return false;
    }
} 