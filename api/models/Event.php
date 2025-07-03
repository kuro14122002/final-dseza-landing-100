<?php
// api/models/Event.php
require_once __DIR__ . '/../config/database.php';

class Event {
    private $db;
    
    public function __construct() {
        $this->db = getDatabase();
    }
    
    // Get all events with pagination and filters
    public function getAll($page = 1, $limit = 9, $status = null, $featured = null) {
        try {
            $offset = ($page - 1) * $limit;
            $conditions = [];
            $params = [];
            
            if ($status) {
                $conditions[] = "e.status = ?";
                $params[] = $status;
            }
            
            if ($featured !== null) {
                $conditions[] = "e.is_featured = ?";
                $params[] = $featured ? 1 : 0;
            }
            
            $whereClause = !empty($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';
            
            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM events e $whereClause";
            $countStmt = $this->db->query($countSql, $params);
            $totalEvents = $countStmt->fetch()['total'];
            
            // Get events
            $sql = "SELECT 
                        e.id, e.slug, e.title, e.title_en, e.description, e.description_en,
                        e.content, e.content_en, e.start_time, e.end_time, e.location, 
                        e.location_en, e.image_url, e.status, e.is_featured,
                        e.max_participants, e.registration_required, e.registration_deadline,
                        e.contact_email, e.contact_phone, e.created_at, e.updated_at,
                        u.username as author_username, u.email as author_email
                    FROM events e
                    LEFT JOIN users u ON e.author_id = u.id
                    $whereClause
                    ORDER BY e.start_time ASC, e.created_at DESC
                    LIMIT ? OFFSET ?";
            
            $params[] = $limit;
            $params[] = $offset;
            
            $stmt = $this->db->query($sql, $params);
            $events = $stmt->fetchAll();
            
            $formattedEvents = [];
            foreach ($events as $event) {
                $formattedEvents[] = $this->formatEvent($event);
            }
            
            return [
                'events' => $formattedEvents,
                'totalEvents' => $totalEvents,
                'totalPages' => ceil($totalEvents / $limit),
                'currentPage' => $page
            ];
            
        } catch (Exception $e) {
            error_log("Error getting events: " . $e->getMessage());
            throw new Exception("Failed to get events");
        }
    }
    
    // Get single event by ID or slug
    public function getById($identifier, $bySlug = false) {
        try {
            $field = $bySlug ? 'e.slug' : 'e.id';
            
            $sql = "SELECT 
                        e.id, e.slug, e.title, e.title_en, e.description, e.description_en,
                        e.content, e.content_en, e.start_time, e.end_time, e.location, 
                        e.location_en, e.image_url, e.status, e.is_featured,
                        e.max_participants, e.registration_required, e.registration_deadline,
                        e.contact_email, e.contact_phone, e.created_at, e.updated_at,
                        u.username as author_username, u.email as author_email
                    FROM events e
                    LEFT JOIN users u ON e.author_id = u.id
                    WHERE $field = ?";
            
            $stmt = $this->db->query($sql, [$identifier]);
            $event = $stmt->fetch();
            
            if (!$event) {
                return null;
            }
            
            return $this->formatEvent($event, true);
            
        } catch (Exception $e) {
            error_log("Error getting event: " . $e->getMessage());
            throw new Exception("Failed to get event");
        }
    }
    
    // Create new event
    public function create($data) {
        try {
            $this->db->beginTransaction();
            
            $sql = "INSERT INTO events (
                        slug, title, title_en, description, description_en, content, content_en,
                        start_time, end_time, location, location_en, image_url, status, 
                        is_featured, max_participants, registration_required, registration_deadline,
                        contact_email, contact_phone, author_id
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->db->query($sql, [
                $data['slug'],
                $data['title'],
                $data['title_en'] ?? null,
                $data['description'],
                $data['description_en'] ?? null,
                $data['content'] ?? null,
                $data['content_en'] ?? null,
                $data['start_time'],
                $data['end_time'],
                $data['location'] ?? null,
                $data['location_en'] ?? null,
                $data['image_url'] ?? null,
                $data['status'] ?? 'upcoming',
                $data['is_featured'] ?? false,
                $data['max_participants'] ?? null,
                $data['registration_required'] ?? false,
                $data['registration_deadline'] ?? null,
                $data['contact_email'] ?? null,
                $data['contact_phone'] ?? null,
                $data['author_id']
            ]);
            
            $eventId = $this->db->lastInsertId();
            $this->db->commit();
            
            return $this->getById($eventId);
            
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Error creating event: " . $e->getMessage());
            throw new Exception("Failed to create event");
        }
    }
    
    // Update event
    public function update($id, $data) {
        try {
            $this->db->beginTransaction();
            
            $sql = "UPDATE events SET 
                        title = ?, title_en = ?, description = ?, description_en = ?, 
                        content = ?, content_en = ?, start_time = ?, end_time = ?, 
                        location = ?, location_en = ?, image_url = ?, status = ?, 
                        is_featured = ?, max_participants = ?, registration_required = ?, 
                        registration_deadline = ?, contact_email = ?, contact_phone = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?";
            
            $stmt = $this->db->query($sql, [
                $data['title'],
                $data['title_en'] ?? null,
                $data['description'],
                $data['description_en'] ?? null,
                $data['content'] ?? null,
                $data['content_en'] ?? null,
                $data['start_time'],
                $data['end_time'],
                $data['location'] ?? null,
                $data['location_en'] ?? null,
                $data['image_url'] ?? null,
                $data['status'] ?? 'upcoming',
                $data['is_featured'] ?? false,
                $data['max_participants'] ?? null,
                $data['registration_required'] ?? false,
                $data['registration_deadline'] ?? null,
                $data['contact_email'] ?? null,
                $data['contact_phone'] ?? null,
                $id
            ]);
            
            $this->db->commit();
            
            return $this->getById($id);
            
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Error updating event: " . $e->getMessage());
            throw new Exception("Failed to update event");
        }
    }
    
    // Delete event
    public function delete($id) {
        try {
            $sql = "DELETE FROM events WHERE id = ?";
            $stmt = $this->db->query($sql, [$id]);
            
            return $stmt->rowCount() > 0;
            
        } catch (Exception $e) {
            error_log("Error deleting event: " . $e->getMessage());
            throw new Exception("Failed to delete event");
        }
    }
    
    // Get featured events
    public function getFeatured($limit = 3) {
        try {
            $sql = "SELECT 
                        e.id, e.slug, e.title, e.title_en, e.description, e.description_en,
                        e.start_time, e.end_time, e.location, e.location_en, e.image_url, 
                        e.status, e.is_featured, e.max_participants, e.registration_required,
                        e.contact_email, e.contact_phone, e.created_at
                    FROM events e
                    WHERE e.is_featured = 1 AND e.status != 'cancelled'
                    ORDER BY e.start_time ASC
                    LIMIT ?";
            
            $stmt = $this->db->query($sql, [$limit]);
            $events = $stmt->fetchAll();
            
            $formattedEvents = [];
            foreach ($events as $event) {
                $formattedEvents[] = $this->formatEvent($event);
            }
            
            return $formattedEvents;
            
        } catch (Exception $e) {
            error_log("Error getting featured events: " . $e->getMessage());
            throw new Exception("Failed to get featured events");
        }
    }
    
    // Get upcoming events
    public function getUpcoming($limit = 5) {
        try {
            $sql = "SELECT 
                        e.id, e.slug, e.title, e.title_en, e.description, e.description_en,
                        e.start_time, e.end_time, e.location, e.location_en, e.image_url, 
                        e.status, e.max_participants, e.registration_required,
                        e.contact_email, e.contact_phone, e.created_at
                    FROM events e
                    WHERE e.start_time > NOW() AND e.status != 'cancelled'
                    ORDER BY e.start_time ASC
                    LIMIT ?";
            
            $stmt = $this->db->query($sql, [$limit]);
            $events = $stmt->fetchAll();
            
            $formattedEvents = [];
            foreach ($events as $event) {
                $formattedEvents[] = $this->formatEvent($event);
            }
            
            return $formattedEvents;
            
        } catch (Exception $e) {
            error_log("Error getting upcoming events: " . $e->getMessage());
            throw new Exception("Failed to get upcoming events");
        }
    }
    
    // Update event status based on current time
    public function updateStatusByTime() {
        try {
            $currentTime = date('Y-m-d H:i:s');
            
            // Update to ongoing
            $sql = "UPDATE events SET status = 'ongoing' 
                    WHERE start_time <= ? AND end_time > ? AND status = 'upcoming'";
            $this->db->query($sql, [$currentTime, $currentTime]);
            
            // Update to completed
            $sql = "UPDATE events SET status = 'completed' 
                    WHERE end_time <= ? AND status IN ('upcoming', 'ongoing')";
            $this->db->query($sql, [$currentTime]);
            
        } catch (Exception $e) {
            error_log("Error updating event status: " . $e->getMessage());
        }
    }
    
    // Search events
    public function search($query, $page = 1, $limit = 10) {
        try {
            $offset = ($page - 1) * $limit;
            $searchTerm = "%$query%";
            
            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM events e 
                        WHERE (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)
                        AND e.status != 'cancelled'";
            $countStmt = $this->db->query($countSql, [$searchTerm, $searchTerm, $searchTerm]);
            $totalEvents = $countStmt->fetch()['total'];
            
            // Get events
            $sql = "SELECT 
                        e.id, e.slug, e.title, e.title_en, e.description, e.description_en,
                        e.start_time, e.end_time, e.location, e.location_en, e.image_url, 
                        e.status, e.is_featured, e.max_participants, e.registration_required,
                        e.contact_email, e.contact_phone, e.created_at,
                        u.username as author_username
                    FROM events e
                    LEFT JOIN users u ON e.author_id = u.id
                    WHERE (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)
                    AND e.status != 'cancelled'
                    ORDER BY e.start_time ASC
                    LIMIT ? OFFSET ?";
            
            $stmt = $this->db->query($sql, [$searchTerm, $searchTerm, $searchTerm, $limit, $offset]);
            $events = $stmt->fetchAll();
            
            $formattedEvents = [];
            foreach ($events as $event) {
                $formattedEvents[] = $this->formatEvent($event);
            }
            
            return [
                'events' => $formattedEvents,
                'totalEvents' => $totalEvents,
                'totalPages' => ceil($totalEvents / $limit),
                'currentPage' => $page
            ];
            
        } catch (Exception $e) {
            error_log("Error searching events: " . $e->getMessage());
            throw new Exception("Failed to search events");
        }
    }
    
    // Format event data
    private function formatEvent($event, $includeContent = false) {
        $formatted = [
            'id' => intval($event['id']),
            'slug' => $event['slug'],
            'title' => $event['title'],
            'title_en' => $event['title_en'],
            'description' => $event['description'],
            'description_en' => $event['description_en'],
            'startTime' => $event['start_time'],
            'endTime' => $event['end_time'],
            'location' => $event['location'],
            'location_en' => $event['location_en'],
            'imageUrl' => $event['image_url'],
            'status' => $event['status'],
            'isFeatured' => (bool)$event['is_featured'],
            'maxParticipants' => $event['max_participants'] ? intval($event['max_participants']) : null,
            'registrationRequired' => (bool)$event['registration_required'],
            'registrationDeadline' => $event['registration_deadline'] ?? null,
            'contactEmail' => $event['contact_email'],
            'contactPhone' => $event['contact_phone'],
            'createdAt' => $event['created_at'],
            'updatedAt' => $event['updated_at'] ?? null
        ];
        
        if ($includeContent) {
            $formatted['content'] = $event['content'];
            $formatted['content_en'] = $event['content_en'];
        }
        
        if (isset($event['author_username'])) {
            $formatted['author'] = [
                'username' => $event['author_username'],
                'email' => $event['author_email'] ?? null
            ];
        }
        
        return $formatted;
    }
    
    // Get total count of events
    public function getTotalCount() {
        try {
            $sql = "SELECT COUNT(*) as total FROM events";
            $stmt = $this->db->query($sql);
            return $stmt->fetch()['total'];
        } catch (Exception $e) {
            error_log("Error getting total event count: " . $e->getMessage());
            return 0;
        }
    }
} 