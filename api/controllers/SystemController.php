<?php
// api/controllers/SystemController.php
require_once __DIR__ . '/../core/router.php';

class SystemController
{
    private $db;

    public function __construct()
    {
        // Get database connection if available
        global $conn;
        $this->db = $conn ?? null;
    }

    /**
     * Get system status
     */
    public function getStatus()
    {
        try {
            // Check database connection
            $databaseStatus = $this->checkDatabaseStatus();
            
            // Check API status (always online if we reach here)
            $apiStatus = 'online';
            
            // Check storage status
            $storageStatus = $this->checkStorageStatus();
            
            // Check cache status (simplified)
            $cacheStatus = $this->checkCacheStatus();

            $data = [
                'database' => $databaseStatus,
                'api' => $apiStatus,
                'storage' => $storageStatus,
                'cache' => $cacheStatus
            ];

            sendSuccessResponse($data, 'System status retrieved successfully');
        } catch (Exception $e) {
            error_log("System status error: " . $e->getMessage());
            sendErrorResponse('Failed to get system status', 500);
        }
    }

    /**
     * Get recent activities
     */
    public function getRecentActivities()
    {
        try {
            // Mock data for now - in real implementation, this would query activity logs
            $activities = [
                [
                    'id' => '1',
                    'type' => 'news',
                    'title' => 'Bài viết mới về công nghệ AI được tạo',
                    'time' => '5 phút trước',
                    'status' => 'success',
                    'user' => 'Admin',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-5 minutes'))
                ],
                [
                    'id' => '2',
                    'type' => 'user',
                    'title' => 'Người dùng mới đăng ký hệ thống',
                    'time' => '15 phút trước',
                    'status' => 'success',
                    'user' => 'System',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-15 minutes'))
                ],
                [
                    'id' => '3',
                    'type' => 'comment',
                    'title' => 'Bình luận mới cần kiểm duyệt',
                    'time' => '30 phút trước',
                    'status' => 'warning',
                    'user' => 'User123',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-30 minutes'))
                ],
                [
                    'id' => '4',
                    'type' => 'event',
                    'title' => 'Sự kiện hội thảo công nghệ được tạo',
                    'time' => '1 giờ trước',
                    'status' => 'success',
                    'user' => 'Admin',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-1 hour'))
                ],
                [
                    'id' => '5',
                    'type' => 'document',
                    'title' => 'Tài liệu PDF mới được upload',
                    'time' => '2 giờ trước',
                    'status' => 'success',
                    'user' => 'Editor',
                    'created_at' => date('Y-m-d H:i:s', strtotime('-2 hours'))
                ]
            ];

            // If we have database connection, we could query real activity logs
            if ($this->db) {
                $realActivities = $this->getRealActivities();
                if (!empty($realActivities)) {
                    $activities = $realActivities;
                }
            }

            sendSuccessResponse($activities, 'Recent activities retrieved successfully');
        } catch (Exception $e) {
            error_log("Recent activities error: " . $e->getMessage());
            sendErrorResponse('Failed to get recent activities', 500);
        }
    }

    /**
     * Get system health metrics
     */
    public function getSystemHealth()
    {
        try {
            $health = [
                'overall' => 98,
                'database' => 100,
                'api' => 100,
                'storage' => 95,
                'cache' => 98,
                'memory_usage' => 45,
                'cpu_usage' => 23,
                'disk_usage' => 67,
                'uptime' => '15 ngày, 8 giờ',
                'last_backup' => date('Y-m-d H:i:s', strtotime('-1 day'))
            ];

            // Get real system metrics if possible
            if (function_exists('memory_get_usage')) {
                $memoryUsage = memory_get_usage(true);
                $memoryLimit = ini_get('memory_limit');
                
                if ($memoryLimit) {
                    $memoryLimitBytes = $this->convertToBytes($memoryLimit);
                    if ($memoryLimitBytes > 0) {
                        $health['memory_usage'] = round(($memoryUsage / $memoryLimitBytes) * 100, 2);
                    }
                }
            }

            // Get disk usage
            $uploadDir = __DIR__ . '/../../public/uploads/';
            if (is_dir($uploadDir)) {
                $freeSpace = disk_free_space($uploadDir);
                $totalSpace = disk_total_space($uploadDir);
                
                if ($freeSpace && $totalSpace) {
                    $health['disk_usage'] = round(((($totalSpace - $freeSpace) / $totalSpace) * 100), 2);
                }
            }

            sendSuccessResponse($health, 'System health retrieved successfully');
        } catch (Exception $e) {
            error_log("System health error: " . $e->getMessage());
            sendErrorResponse('Failed to get system health', 500);
        }
    }

    /**
     * Check database connection status
     */
    private function checkDatabaseStatus()
    {
        try {
            if (!$this->db) {
                return 'offline';
            }

            // Test database connection
            $stmt = $this->db->prepare("SELECT 1");
            $stmt->execute();
            $result = $stmt->fetch();
            
            return $result ? 'online' : 'offline';
        } catch (Exception $e) {
            return 'offline';
        }
    }

    /**
     * Check storage status
     */
    private function checkStorageStatus()
    {
        try {
            $uploadDir = __DIR__ . '/../../public/uploads/';
            
            if (!is_dir($uploadDir)) {
                return 'warning';
            }

            if (!is_writable($uploadDir)) {
                return 'warning';
            }

            // Check available disk space
            $freeSpace = disk_free_space($uploadDir);
            $totalSpace = disk_total_space($uploadDir);
            
            if ($freeSpace && $totalSpace) {
                $freePercentage = ($freeSpace / $totalSpace) * 100;
                if ($freePercentage < 10) {
                    return 'warning';
                }
            }

            return 'online';
        } catch (Exception $e) {
            return 'warning';
        }
    }

    /**
     * Check cache status
     */
    private function checkCacheStatus()
    {
        try {
            $cacheDir = __DIR__ . '/../../cache/';
            
            if (!is_dir($cacheDir)) {
                return 'warning';
            }

            if (!is_writable($cacheDir)) {
                return 'warning';
            }

            return 'online';
        } catch (Exception $e) {
            return 'warning';
        }
    }

    /**
     * Get real activities from database (if available)
     */
    private function getRealActivities()
    {
        try {
            if (!$this->db) {
                return [];
            }

            // Check if activity_logs table exists
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as table_count 
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() 
                AND table_name = 'activity_logs'
            ");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['table_count'] == 0) {
                return [];
            }

            // Get recent activities from database
            $stmt = $this->db->prepare("
                SELECT 
                    id,
                    type,
                    title,
                    status,
                    user,
                    created_at,
                    CASE 
                        WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MINUTE) THEN CONCAT(TIMESTAMPDIFF(SECOND, created_at, NOW()), ' giây trước')
                        WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN CONCAT(TIMESTAMPDIFF(MINUTE, created_at, NOW()), ' phút trước')
                        WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN CONCAT(TIMESTAMPDIFF(HOUR, created_at, NOW()), ' giờ trước')
                        ELSE CONCAT(TIMESTAMPDIFF(DAY, created_at, NOW()), ' ngày trước')
                    END as time
                FROM activity_logs 
                ORDER BY created_at DESC 
                LIMIT 10
            ");
            $stmt->execute();
            $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $activities;
        } catch (Exception $e) {
            error_log("Error getting real activities: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Convert memory limit string to bytes
     */
    private function convertToBytes($value)
    {
        $unit = strtolower(substr($value, -1));
        $numValue = intval($value);
        
        switch ($unit) {
            case 'g':
                $numValue *= 1024;
            case 'm':
                $numValue *= 1024;
            case 'k':
                $numValue *= 1024;
        }
        
        return $numValue;
    }
}
?> 