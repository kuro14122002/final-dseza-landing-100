<?php
/**
 * Complete Database Setup Script
 * Creates all tables and test users for DSEZA API
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🛠️ Complete Database Setup</h1>";

try {
    // Database configuration
    $config = require __DIR__ . '/config/database.php';
    
    echo "<h2>📋 Step 1: Connect to MySQL Server</h2>";
    
    // Connect to MySQL server (without specific database)
    $dsn = "mysql:host={$config['host']};port={$config['port']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    
    echo "✅ Connected to MySQL server<br>";
    
    // Create database if not exists
    echo "<h2>🗄️ Step 2: Create Database</h2>";
    $createDbQuery = "CREATE DATABASE IF NOT EXISTS `{$config['database']}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    $pdo->exec($createDbQuery);
    echo "✅ Database '{$config['database']}' created/verified<br>";
    
    // Use the database
    $pdo->exec("USE `{$config['database']}`");
    echo "✅ Using database '{$config['database']}'<br>";
    
    echo "<h2>📊 Step 3: Create Tables</h2>";
    
    // Create users table
    $createUsersTable = "
    CREATE TABLE IF NOT EXISTS `users` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `email` varchar(255) NOT NULL UNIQUE,
        `password_hash` varchar(255) NOT NULL,
        `role` enum('admin','editor','user') NOT NULL DEFAULT 'user',
        `full_name` varchar(255) NOT NULL,
        `is_active` tinyint(1) NOT NULL DEFAULT 1,
        `last_login` timestamp NULL DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_email` (`email`),
        KEY `idx_role` (`role`),
        KEY `idx_active` (`is_active`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $pdo->exec($createUsersTable);
    echo "✅ Users table created<br>";
    
    // Create news_articles table  
    $createNewsTable = "
    CREATE TABLE IF NOT EXISTS `news_articles` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `title` varchar(500) NOT NULL,
        `slug` varchar(500) NOT NULL UNIQUE,
        `content` longtext NOT NULL,
        `excerpt` text,
        `featured_image` varchar(500),
        `category` varchar(100),
        `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
        `views` int(11) NOT NULL DEFAULT 0,
        `author_id` int(11),
        `published_at` timestamp NULL DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_slug` (`slug`),
        KEY `idx_status` (`status`),
        KEY `idx_category` (`category`),
        KEY `idx_author` (`author_id`),
        FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $pdo->exec($createNewsTable);
    echo "✅ News articles table created<br>";
    
    // Create event_articles table
    $createEventsTable = "
    CREATE TABLE IF NOT EXISTS `event_articles` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `title` varchar(500) NOT NULL,
        `slug` varchar(500) NOT NULL UNIQUE,
        `content` longtext NOT NULL,
        `excerpt` text,
        `featured_image` varchar(500),
        `location` varchar(255),
        `event_date` timestamp NULL DEFAULT NULL,
        `registration_deadline` timestamp NULL DEFAULT NULL,
        `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
        `views` int(11) NOT NULL DEFAULT 0,
        `author_id` int(11),
        `published_at` timestamp NULL DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_slug` (`slug`),
        KEY `idx_status` (`status`),
        KEY `idx_event_date` (`event_date`),
        KEY `idx_author` (`author_id`),
        FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $pdo->exec($createEventsTable);
    echo "✅ Event articles table created<br>";
    
    echo "<h2>👥 Step 4: Create Test Users</h2>";
    
    // Test users data
    $testUsers = [
        [
            'email' => 'admin@dseza.gov.vn',
            'password' => 'password123',
            'role' => 'admin',
            'full_name' => 'Administrator',
            'is_active' => 1
        ],
        [
            'email' => 'editor@dseza.gov.vn',
            'password' => 'password123', 
            'role' => 'editor',
            'full_name' => 'Editor User',
            'is_active' => 1
        ],
        [
            'email' => 'inactive.user@dseza.gov.vn',
            'password' => 'password123',
            'role' => 'editor',
            'full_name' => 'Inactive User',
            'is_active' => 0
        ]
    ];
    
    $insertUserQuery = "INSERT INTO users (email, password_hash, role, full_name, is_active) VALUES (?, ?, ?, ?, ?) 
                       ON DUPLICATE KEY UPDATE 
                       password_hash = VALUES(password_hash),
                       role = VALUES(role),
                       full_name = VALUES(full_name),
                       is_active = VALUES(is_active),
                       updated_at = CURRENT_TIMESTAMP";
    $stmt = $pdo->prepare($insertUserQuery);
    
    foreach ($testUsers as $user) {
        $passwordHash = password_hash($user['password'], PASSWORD_DEFAULT);
        $stmt->execute([
            $user['email'],
            $passwordHash,
            $user['role'],
            $user['full_name'],
            $user['is_active']
        ]);
        echo "✅ User created/updated: {$user['email']} ({$user['role']})<br>";
    }
    
    echo "<h2>📊 Step 5: Create Sample Data</h2>";
    
    // Create sample news articles
    $sampleNews = [
        [
            'title' => 'Đà Nẵng Công Bố Chính Sách Đầu Tư Mới',
            'slug' => 'da-nang-cong-bo-chinh-sach-dau-tu-moi',
            'content' => 'Nội dung chi tiết về chính sách đầu tư mới của Đà Nẵng...',
            'excerpt' => 'Đà Nẵng vừa công bố những chính sách ưu đãi đầu tư mới nhằm thu hút các nhà đầu tư.',
            'category' => 'policy',
            'status' => 'published'
        ],
        [
            'title' => 'Khu Công Nghệ Cao Đà Nẵng Phát Triển Mạnh',
            'slug' => 'khu-cong-nghe-cao-da-nang-phat-trien-manh',
            'content' => 'Chi tiết về sự phát triển của Khu Công nghệ cao Đà Nẵng...',
            'excerpt' => 'Khu Công nghệ cao Đà Nẵng đang thu hút nhiều doanh nghiệp công nghệ đầu tư.',
            'category' => 'technology',
            'status' => 'published'
        ]
    ];
    
    $insertNewsQuery = "INSERT INTO news_articles (title, slug, content, excerpt, category, status, author_id, published_at) 
                       VALUES (?, ?, ?, ?, ?, ?, 1, NOW())
                       ON DUPLICATE KEY UPDATE 
                       title = VALUES(title),
                       content = VALUES(content),
                       excerpt = VALUES(excerpt),
                       updated_at = CURRENT_TIMESTAMP";
    $newsStmt = $pdo->prepare($insertNewsQuery);
    
    foreach ($sampleNews as $news) {
        $newsStmt->execute([
            $news['title'],
            $news['slug'],
            $news['content'],
            $news['excerpt'],
            $news['category'],
            $news['status']
        ]);
        echo "✅ Sample news created: {$news['title']}<br>";
    }
    
    // Create sample events
    $sampleEvents = [
        [
            'title' => 'Hội Thảo Đầu Tư Bất Động Sản 2024',
            'slug' => 'hoi-thao-dau-tu-bat-dong-san-2024',
            'content' => 'Hội thảo về cơ hội đầu tư bất động sản tại Đà Nẵng...',
            'excerpt' => 'Tham gia hội thảo để tìm hiểu các cơ hội đầu tư bất động sản tại Đà Nẵng.',
            'location' => 'Trung tâm Hội nghị Đà Nẵng',
            'event_date' => '2024-12-20 09:00:00',
            'status' => 'published'
        ],
        [
            'title' => 'Triển Lãm Công Nghệ Đà Nẵng',
            'slug' => 'trien-lam-cong-nghe-da-nang',
            'content' => 'Triển lãm các sản phẩm công nghệ mới tại Đà Nẵng...',
            'excerpt' => 'Khám phá những công nghệ tiên tiến và cơ hội đầu tư trong lĩnh vực công nghệ.',
            'location' => 'Trung tâm Triển lãm Đà Nẵng',
            'event_date' => '2024-12-25 08:00:00',
            'status' => 'published'
        ]
    ];
    
    $insertEventQuery = "INSERT INTO event_articles (title, slug, content, excerpt, location, event_date, status, author_id, published_at) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())
                        ON DUPLICATE KEY UPDATE 
                        title = VALUES(title),
                        content = VALUES(content),
                        excerpt = VALUES(excerpt),
                        updated_at = CURRENT_TIMESTAMP";
    $eventStmt = $pdo->prepare($insertEventQuery);
    
    foreach ($sampleEvents as $event) {
        $eventStmt->execute([
            $event['title'],
            $event['slug'],
            $event['content'],
            $event['excerpt'],
            $event['location'],
            $event['event_date'],
            $event['status']
        ]);
        echo "✅ Sample event created: {$event['title']}<br>";
    }
    
    echo "<h2>🔍 Step 6: Verify Setup</h2>";
    
    // Check users
    $usersCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    echo "👥 Total users: $usersCount<br>";
    
    // Check news
    $newsCount = $pdo->query("SELECT COUNT(*) FROM news_articles WHERE status = 'published'")->fetchColumn();
    echo "📰 Published news: $newsCount<br>";
    
    // Check events
    $eventsCount = $pdo->query("SELECT COUNT(*) FROM event_articles WHERE status = 'published'")->fetchColumn();
    echo "📅 Published events: $eventsCount<br>";
    
    echo "<h2>✅ Setup Complete!</h2>";
    echo "<p><strong>Database setup completed successfully!</strong></p>";
    
    echo "<h3>🧪 Test Credentials:</h3>";
    echo "<ul>";
    echo "<li><strong>Admin:</strong> admin@dseza.gov.vn / password123</li>";
    echo "<li><strong>Editor:</strong> editor@dseza.gov.vn / password123</li>";
    echo "<li><strong>Inactive:</strong> inactive.user@dseza.gov.vn / password123 (should fail)</li>";
    echo "</ul>";
    
    echo "<h3>🔗 Next Steps:</h3>";
    echo "<ul>";
    echo "<li><a href='debug_users.php'>Verify Users Setup</a></li>";
    echo "<li><a href='comprehensive_api_test.php'>Run API Tests</a></li>";
    echo "<li><a href='test_login_api.php'>Test Login API</a></li>";
    echo "<li><a href='test_stats_api.php'>Test Stats API</a></li>";
    echo "</ul>";

} catch (Exception $e) {
    echo "<h2>❌ Setup Failed</h2>";
    echo "<p><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>File:</strong> " . $e->getFile() . "</p>";
    echo "<p><strong>Line:</strong> " . $e->getLine() . "</p>";
    
    echo "<h3>🔧 Troubleshooting:</h3>";
    echo "<ul>";
    echo "<li>Make sure MySQL server is running in XAMPP</li>";
    echo "<li>Check database credentials in config/database.php</li>";
    echo "<li>Verify PHP has PDO MySQL extension enabled</li>";
    echo "<li>Check MySQL error logs</li>";
    echo "</ul>";
}
?> 