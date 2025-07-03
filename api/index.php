<?php
// api/index.php - Main API entry point
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// Include core files
require_once __DIR__ . '/core/router.php';
require_once __DIR__ . '/controllers/NewsController.php';
require_once __DIR__ . '/controllers/CategoryController.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/StatsController.php';
require_once __DIR__ . '/controllers/SearchController.php';
require_once __DIR__ . '/controllers/EventsController.php';
require_once __DIR__ . '/controllers/MediaController.php';
require_once __DIR__ . '/controllers/TranslationController.php';
require_once __DIR__ . '/controllers/DocumentsController.php';
require_once __DIR__ . '/controllers/SitemapController.php';
require_once __DIR__ . '/controllers/WebsiteManagerController.php';
require_once __DIR__ . '/controllers/SystemController.php';
require_once __DIR__ . '/controllers/RoleController.php';
require_once __DIR__ . '/controllers/UserController.php';

// Database connection
require_once __DIR__ . '/config/database.php';

// Initialize database connection
$database = new Database();
$conn = $database->getConnection();

// Create router instance
$router = new Router();

try {
    // Authentication Routes
    $router->post('/auth/login', [AuthController::class, 'login']);
    $router->get('/auth/me', [AuthController::class, 'me']);
    $router->post('/auth/verify', [AuthController::class, 'verify']);
    $router->post('/auth/refresh', [AuthController::class, 'refresh']);
    $router->post('/auth/logout', [AuthController::class, 'logout']);
    
    // User Profile Routes
    $router->put('/user/profile', [AuthController::class, 'updateProfile']);
    $router->put('/user/change-password', [AuthController::class, 'changePassword']);
    
    // Role Management Routes (Admin Only)
    $router->get('/roles', [RoleController::class, 'index']);
    $router->get('/roles/stats', [RoleController::class, 'stats']);
    $router->get('/roles/{id}', [RoleController::class, 'show']);
    $router->post('/roles', [RoleController::class, 'store']);
    $router->put('/roles/{id}', [RoleController::class, 'update']);
    $router->put('/roles/{id}/toggle', [RoleController::class, 'toggleStatus']);
    $router->delete('/roles/{id}', [RoleController::class, 'destroy']);
    
    // User Management Routes (Admin Only)
    $router->get('/users', [UserController::class, 'index']);
    $router->get('/users/stats', [UserController::class, 'stats']);
    $router->get('/users/{id}', [UserController::class, 'show']);
    $router->post('/users', [UserController::class, 'store']);
    $router->put('/users/{id}', [UserController::class, 'update']);
    $router->put('/users/{id}/toggle', [UserController::class, 'toggleStatus']);
    $router->put('/users/{id}/password', [UserController::class, 'changePassword']);
    $router->delete('/users/{id}', [UserController::class, 'destroy']);
    
    // News Routes
    $router->get('/news', [NewsController::class, 'index']);
    $router->get('/news/featured', [NewsController::class, 'featured']);
    $router->get('/news/category/{categorySlug}', [NewsController::class, 'byCategory']);
    $router->get('/news/{id}', [NewsController::class, 'show']);
    $router->get('/news/{id}/related', [NewsController::class, 'related']);
    $router->post('/news', [NewsController::class, 'store']);
    $router->put('/news/{id}', [NewsController::class, 'update']);
    $router->delete('/news/{id}', [NewsController::class, 'destroy']);
    
    // Admin News Routes
    $router->get('/admin/news/stats', [NewsController::class, 'stats']);
    
    // Category Routes  
    $router->get('/categories', [CategoryController::class, 'index']);
    $router->get('/categories/{id}', [CategoryController::class, 'show']);
    $router->get('/categories/type/{type}', [CategoryController::class, 'byType']);
    $router->post('/categories', [CategoryController::class, 'store']);
    $router->put('/categories/{id}', [CategoryController::class, 'update']);
    $router->delete('/categories/{id}', [CategoryController::class, 'destroy']);
    $router->put('/categories/{id}/toggle', [CategoryController::class, 'toggleStatus']);
    
    // Stats Routes
    $router->get('/stats/overview', [StatsController::class, 'overview']);
    
    // System Routes
    $router->get('/system/status', [SystemController::class, 'getStatus']);
    $router->get('/system/health', [SystemController::class, 'getSystemHealth']);
    
    // Activities Routes
    $router->get('/activities/recent', [SystemController::class, 'getRecentActivities']);
    
    // Search Routes
    $router->get('/search', [SearchController::class, 'search']);
    
    // Events Routes
    $router->get('/events', [EventsController::class, 'index']);
    $router->get('/events/featured', [EventsController::class, 'featured']);
    $router->get('/events/upcoming', [EventsController::class, 'upcoming']);
    $router->get('/events/{id}', [EventsController::class, 'show']);
    $router->post('/events', [EventsController::class, 'store']);
    $router->put('/events/{id}', [EventsController::class, 'update']);
    $router->delete('/events/{id}', [EventsController::class, 'destroy']);
    
    // Media Routes
    $router->get('/media', [MediaController::class, 'index']);
    $router->post('/media/upload', [MediaController::class, 'upload']);
    $router->delete('/media/{id}', [MediaController::class, 'delete']);
    $router->post('/media/folders', [MediaController::class, 'createFolder']);
    
    // Translation Routes
    $router->get('/translations', [TranslationController::class, 'getTranslations']);
    $router->get('/translations/{id}', [TranslationController::class, 'getTranslation']);
    $router->post('/translations', [TranslationController::class, 'createTranslation']);
    $router->put('/translations/{id}', [TranslationController::class, 'updateTranslation']);
    $router->delete('/translations/{id}', [TranslationController::class, 'deleteTranslation']);
    $router->get('/translations/export', [TranslationController::class, 'exportTranslations']);
    $router->post('/translations/import', [TranslationController::class, 'importTranslations']);
    $router->post('/translations/sync', [TranslationController::class, 'syncTranslations']);
    
    // Documents Routes
    $router->get('/admin/documents', function() use ($conn) {
        $controller = new DocumentsController($conn);
        $result = $controller->getDocuments($_REQUEST);
        sendJsonResponse($result);
    });
    $router->get('/documents/{id}', function($id) use ($conn) {
        $controller = new DocumentsController($conn);
        $result = $controller->getDocument($id);
        sendJsonResponse($result);
    });
    $router->post('/admin/documents', function() use ($conn) {
        $controller = new DocumentsController($conn);
        $result = $controller->createDocument($_REQUEST);
        sendJsonResponse($result);
    });
    $router->put('/admin/documents/{id}', function($id) use ($conn) {
        $controller = new DocumentsController($conn);
        $result = $controller->updateDocument($id, $_REQUEST);
        sendJsonResponse($result);
    });
    $router->delete('/admin/documents/{id}', function($id) use ($conn) {
        $controller = new DocumentsController($conn);
        $result = $controller->deleteDocument($id);
        sendJsonResponse($result);
    });
    
    // Sitemap Routes
    $router->get('/sitemap/urls', [SitemapController::class, 'getUrls']);
    $router->get('/sitemap.xml', [SitemapController::class, 'generateXML']);
    
    // Website Manager Routes
    $router->get('/website-manager/modules', [WebsiteManagerController::class, 'getModules']);
    $router->post('/website-manager/sync-schedule', [WebsiteManagerController::class, 'syncSchedule']);
    $router->post('/website-manager/sync-business-stats', [WebsiteManagerController::class, 'syncBusinessStats']);
    $router->get('/website-manager/system-health', [WebsiteManagerController::class, 'getSystemHealth']);
    $router->get('/website-manager/activity-log', [WebsiteManagerController::class, 'getActivityLog']);
    $router->post('/website-manager/backup-system', [WebsiteManagerController::class, 'backupSystem']);
    
    // API Info Route
    $router->get('/', function() {
        sendSuccessResponse([
            'name' => 'DSEZA Portal API',
            'version' => '1.0.0',
            'description' => 'REST API for DSEZA Portal news management system',
            'timestamp' => date('c')
        ]);
    });
    
    // Dispatch the request
    $router->dispatch();
    
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    sendErrorResponse('Internal server error', 500, 'An unexpected error occurred.');
}
?> 