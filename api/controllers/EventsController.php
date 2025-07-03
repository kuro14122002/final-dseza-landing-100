<?php
// api/controllers/EventsController.php
// Events controller for handling events API endpoints

require_once __DIR__ . '/../models/Event.php';
require_once __DIR__ . '/../core/router.php';
require_once __DIR__ . '/../core/auth.php';

class EventsController {
    private $eventModel;
    
    public function __construct() {
        $this->eventModel = new Event();
    }
    
    // GET /api/events - Get all events
    public function index() {
        try {
            $page = intval($_GET['page'] ?? 1);
            $limit = intval($_GET['limit'] ?? 9);
            $status = $_GET['status'] ?? null;
            $featured = isset($_GET['featured']) ? filter_var($_GET['featured'], FILTER_VALIDATE_BOOLEAN) : null;
            
            // Update event status based on current time
            $this->eventModel->updateStatusByTime();
            
            $result = $this->eventModel->getAll($page, $limit, $status, $featured);
            
            sendSuccessResponse($result);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get events', 500, $e->getMessage());
        }
    }
    
    // GET /api/events/{id} - Get single event
    public function show($id) {
        try {
            // Check if ID is numeric (ID) or string (slug)
            $bySlug = !is_numeric($id);
            
            $event = $this->eventModel->getById($id, $bySlug);
            
            if (!$event) {
                sendErrorResponse('Event not found', 404);
                return;
            }
            
            sendSuccessResponse($event);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get event', 500, $e->getMessage());
        }
    }
    
    // POST /api/events - Create new event (Admin only)
    public function store() {
        requireAuth('editor');
        
        try {
            $data = getRequestBody();
            
            // Validate required fields
            $requiredFields = ['title', 'description', 'start_time', 'end_time'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty(trim($data[$field]))) {
                    sendErrorResponse("Field '$field' is required", 400);
                    return;
                }
            }
            
            // Validate date format and logic
            if (!$this->validateDateTime($data['start_time'])) {
                sendErrorResponse('Invalid start_time format. Use YYYY-MM-DD HH:MM:SS', 400);
                return;
            }
            
            if (!$this->validateDateTime($data['end_time'])) {
                sendErrorResponse('Invalid end_time format. Use YYYY-MM-DD HH:MM:SS', 400);
                return;
            }
            
            if (strtotime($data['start_time']) >= strtotime($data['end_time'])) {
                sendErrorResponse('End time must be after start time', 400);
                return;
            }
            
            // Generate slug if not provided
            if (!isset($data['slug']) || empty($data['slug'])) {
                $data['slug'] = $this->generateSlug($data['title']);
            }
            
            // Add author ID from current user
            $data['author_id'] = $GLOBALS['current_user']['id'];
            
            $event = $this->eventModel->create($data);
            
            sendSuccessResponse($event, 'Event created successfully', 201);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to create event', 500, $e->getMessage());
        }
    }
    
    // PUT /api/events/{id} - Update event (Admin only)
    public function update($id) {
        requireAuth('editor');
        
        try {
            $data = getRequestBody();
            
            // Check if event exists
            $existingEvent = $this->eventModel->getById($id);
            if (!$existingEvent) {
                sendErrorResponse('Event not found', 404);
                return;
            }
            
            $event = $this->eventModel->update($id, $data);
            
            sendSuccessResponse($event, 'Event updated successfully');
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to update event', 500, $e->getMessage());
        }
    }
    
    // DELETE /api/events/{id} - Delete event (Admin only)
    public function destroy($id) {
        requireAuth('admin');
        
        try {
            // Check if event exists
            $existingEvent = $this->eventModel->getById($id);
            if (!$existingEvent) {
                sendErrorResponse('Event not found', 404);
                return;
            }
            
            $deleted = $this->eventModel->delete($id);
            
            if ($deleted) {
                sendSuccessResponse(null, 'Event deleted successfully', 204);
            } else {
                sendErrorResponse('Failed to delete event', 500);
            }
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to delete event', 500, $e->getMessage());
        }
    }
    
    // GET /api/events/featured - Get featured events
    public function featured() {
        try {
            $limit = intval($_GET['limit'] ?? 3);
            
            // Update event status based on current time
            $this->eventModel->updateStatusByTime();
            
            $events = $this->eventModel->getFeatured($limit);
            
            sendSuccessResponse($events);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get featured events', 500, $e->getMessage());
        }
    }
    
    // GET /api/events/upcoming - Get upcoming events
    public function upcoming() {
        try {
            $limit = intval($_GET['limit'] ?? 5);
            
            // Update event status based on current time
            $this->eventModel->updateStatusByTime();
            
            $events = $this->eventModel->getUpcoming($limit);
            
            sendSuccessResponse($events);
            
        } catch (Exception $e) {
            sendErrorResponse('Failed to get upcoming events', 500, $e->getMessage());
        }
    }
    
    // Helper function to generate slug from title
    private function generateSlug($title) {
        // Convert to lowercase
        $slug = strtolower($title);
        
        // Remove Vietnamese accents
        $slug = $this->removeVietnameseAccents($slug);
        
        // Replace spaces and special characters with hyphens
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        
        // Remove leading and trailing hyphens
        $slug = trim($slug, '-');
        
        return $slug;
    }
    
    // Helper function to remove Vietnamese accents
    private function removeVietnameseAccents($str) {
        $accents = [
            'à', 'á', 'ạ', 'ả', 'ã', 'â', 'ầ', 'ấ', 'ậ', 'ẩ', 'ẫ', 'ă', 'ằ', 'ắ', 'ặ', 'ẳ', 'ẵ',
            'è', 'é', 'ẹ', 'ẻ', 'ẽ', 'ê', 'ề', 'ế', 'ệ', 'ể', 'ễ',
            'ì', 'í', 'ị', 'ỉ', 'ĩ',
            'ò', 'ó', 'ọ', 'ỏ', 'õ', 'ô', 'ồ', 'ố', 'ộ', 'ổ', 'ỗ', 'ơ', 'ờ', 'ớ', 'ợ', 'ở', 'ỡ',
            'ù', 'ú', 'ụ', 'ủ', 'ũ', 'ư', 'ừ', 'ứ', 'ự', 'ử', 'ữ',
            'ỳ', 'ý', 'ỵ', 'ỷ', 'ỹ',
            'đ'
        ];
        
        $replacements = [
            'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
            'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
            'i', 'i', 'i', 'i', 'i',
            'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
            'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u',
            'y', 'y', 'y', 'y', 'y',
            'd'
        ];
        
        return str_replace($accents, $replacements, $str);
    }
    
    // Helper function to validate datetime format
    private function validateDateTime($datetime) {
        $d = DateTime::createFromFormat('Y-m-d H:i:s', $datetime);
        return $d && $d->format('Y-m-d H:i:s') === $datetime;
    }
} 