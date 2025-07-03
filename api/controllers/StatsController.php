<?php
// api/controllers/StatsController.php
require_once __DIR__ . '/../models/News.php';
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../core/auth.php';

class StatsController {
    private $newsModel;
    private $categoryModel;
    
    public function __construct() {
        $this->newsModel = new News();
        $this->categoryModel = new Category();
    }
    
    /**
     * Get overview statistics for dashboard
     */
    public function overview() {
        try {
            // Temporary: Skip authentication for debugging
            // TODO: Re-enable authentication later
            
            // Get total news count
            $totalNews = $this->newsModel->getTotalCount();
            
            // Get total events count (assuming events are news with specific category)
            $totalEvents = $this->newsModel->getEventCount();
            
            // Get total views this month (mock data for now)
            $totalViewsThisMonth = $this->getTotalViewsThisMonth();
            
            // Get active users this month (mock data for now)
            $activeUsersThisMonth = $this->getActiveUsersThisMonth();
            
            // Get additional stats for enhanced dashboard
            $totalComments = $this->getTotalComments();
            $totalDocuments = $this->getTotalDocuments();
            $pendingApproval = $this->getPendingApproval();
            $systemHealth = $this->getSystemHealth();
            
            $statsData = [
                'totalNews' => $totalNews,
                'totalEvents' => $totalEvents,
                'totalViewsThisMonth' => $totalViewsThisMonth,
                'activeUsersThisMonth' => $activeUsersThisMonth,
                'totalComments' => $totalComments,
                'totalDocuments' => $totalDocuments,
                'pendingApproval' => $pendingApproval,
                'systemHealth' => $systemHealth
            ];
            
            sendSuccessResponse($statsData, 'Thống kê được tải thành công');
            
        } catch (Exception $e) {
            error_log("Stats overview error: " . $e->getMessage());
            sendErrorResponse('Lỗi khi tải thống kê', 500, $e->getMessage());
        }
    }
    
    /**
     * Get total views this month (mock implementation)
     * In real application, you would have a views tracking table
     */
    private function getTotalViewsThisMonth() {
        // Mock data - replace with actual view tracking logic
        return rand(1500, 5000);
    }
    
    /**
     * Get active users this month (mock implementation)
     * In real application, you would have user activity tracking
     */
    private function getActiveUsersThisMonth() {
        // Mock data - replace with actual user activity tracking logic
        return rand(50, 200);
    }
    
    /**
     * Get total comments count
     */
    private function getTotalComments() {
        // Mock data - replace with actual comments tracking logic
        return rand(80, 150);
    }
    
    /**
     * Get total documents count
     */
    private function getTotalDocuments() {
        // Mock data - replace with actual documents count logic
        return rand(200, 300);
    }
    
    /**
     * Get pending approval count
     */
    private function getPendingApproval() {
        // Mock data - replace with actual pending approval logic
        return rand(5, 15);
    }
    
    /**
     * Get system health percentage
     */
    private function getSystemHealth() {
        // Mock data - replace with actual system health monitoring
        return rand(95, 100);
    }
}
?> 