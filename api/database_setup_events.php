<?php
// api/database_setup_events.php
// Script to create events table and setup database

require_once __DIR__ . '/config/database.php';

try {
    $db = getDatabase();
    
    echo "Creating events table...\n";
    
    // Create events table
    $eventsTableSQL = "
    CREATE TABLE IF NOT EXISTS `events` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `slug` varchar(255) NOT NULL UNIQUE,
        `title` varchar(500) NOT NULL,
        `title_en` varchar(500) DEFAULT NULL,
        `description` text NOT NULL,
        `description_en` text DEFAULT NULL,
        `content` longtext DEFAULT NULL,
        `content_en` longtext DEFAULT NULL,
        `start_time` datetime NOT NULL,
        `end_time` datetime NOT NULL,
        `location` varchar(255) DEFAULT NULL,
        `location_en` varchar(255) DEFAULT NULL,
        `image_url` varchar(500) DEFAULT NULL,
        `status` enum('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
        `is_featured` tinyint(1) DEFAULT 0,
        `max_participants` int(11) DEFAULT NULL,
        `registration_required` tinyint(1) DEFAULT 0,
        `registration_deadline` datetime DEFAULT NULL,
        `contact_email` varchar(255) DEFAULT NULL,
        `contact_phone` varchar(20) DEFAULT NULL,
        `author_id` int(11) DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_slug` (`slug`),
        KEY `idx_status` (`status`),
        KEY `idx_featured` (`is_featured`),
        KEY `idx_start_time` (`start_time`),
        KEY `idx_author` (`author_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $db->query($eventsTableSQL);
    echo "✅ Events table created successfully!\n";
    
    // Check if users table exists, if not create it
    echo "Checking users table...\n";
    $usersTableSQL = "
    CREATE TABLE IF NOT EXISTS `users` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `username` varchar(50) NOT NULL UNIQUE,
        `email` varchar(255) NOT NULL UNIQUE,
        `password_hash` varchar(255) NOT NULL,
        `role` enum('admin','editor','viewer') DEFAULT 'viewer',
        `is_active` tinyint(1) DEFAULT 1,
        `full_name` varchar(255) DEFAULT NULL,
        `avatar` varchar(500) DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_username` (`username`),
        KEY `idx_email` (`email`),
        KEY `idx_role` (`role`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $db->query($usersTableSQL);
    echo "✅ Users table checked/created successfully!\n";
    
    // Insert sample admin user if not exists
    $checkUser = $db->query("SELECT COUNT(*) as count FROM users WHERE username = 'admin'");
    $userCount = $checkUser->fetch()['count'];
    
    if ($userCount == 0) {
        $insertUser = "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)";
        $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $db->query($insertUser, ['admin', 'admin@dseza.vn', $hashedPassword, 'admin']);
        echo "✅ Sample admin user created (username: admin, password: admin123)\n";
    } else {
        echo "ℹ️ Admin user already exists\n";
    }
    
    // Insert sample events
    echo "Inserting sample events...\n";
    
    $sampleEvents = [
        [
            'slug' => 'su-kien-khai-truong-khu-cnc',
            'title' => 'Sự kiện khai trương Khu công nghệ cao Đà Nẵng',
            'title_en' => 'Da Nang High-Tech Park Opening Event',
            'description' => 'Lễ khai trương chính thức Khu công nghệ cao Đà Nẵng với sự tham gia của các lãnh đạo thành phố và doanh nghiệp.',
            'description_en' => 'Official opening ceremony of Da Nang High-Tech Park with participation of city leaders and businesses.',
            'content' => '<p>Khu công nghệ cao Đà Nẵng chính thức được khai trương...</p>',
            'content_en' => '<p>Da Nang High-Tech Park officially opened...</p>',
            'start_time' => date('Y-m-d H:i:s', strtotime('+7 days')),
            'end_time' => date('Y-m-d H:i:s', strtotime('+7 days +4 hours')),
            'location' => 'Khu công nghệ cao Đà Nẵng',
            'location_en' => 'Da Nang High-Tech Park',
            'status' => 'upcoming',
            'is_featured' => 1,
            'author_id' => 1
        ],
        [
            'slug' => 'hoi-thao-dau-tu-cntt',
            'title' => 'Hội thảo đầu tư công nghệ thông tin',
            'title_en' => 'IT Investment Conference',
            'description' => 'Hội thảo về cơ hội đầu tư trong lĩnh vực công nghệ thông tin tại Đà Nẵng.',
            'description_en' => 'Conference on investment opportunities in IT sector in Da Nang.',
            'content' => '<p>Hội thảo quy tụ các chuyên gia đầu tư...</p>',
            'content_en' => '<p>The conference brings together investment experts...</p>',
            'start_time' => date('Y-m-d H:i:s', strtotime('+14 days')),
            'end_time' => date('Y-m-d H:i:s', strtotime('+14 days +6 hours')),
            'location' => 'Trung tâm hội nghị Đà Nẵng',
            'location_en' => 'Da Nang Convention Center',
            'status' => 'upcoming',
            'is_featured' => 0,
            'registration_required' => 1,
            'max_participants' => 200,
            'contact_email' => 'info@dseza.vn',
            'author_id' => 1
        ]
    ];
    
    foreach ($sampleEvents as $event) {
        // Check if event already exists
        $checkEvent = $db->query("SELECT COUNT(*) as count FROM events WHERE slug = ?", [$event['slug']]);
        $eventCount = $checkEvent->fetch()['count'];
        
        if ($eventCount == 0) {
            $insertEventSQL = "INSERT INTO events (
                slug, title, title_en, description, description_en, content, content_en,
                start_time, end_time, location, location_en, status, is_featured,
                registration_required, max_participants, contact_email, author_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $db->query($insertEventSQL, [
                $event['slug'],
                $event['title'],
                $event['title_en'],
                $event['description'],
                $event['description_en'],
                $event['content'],
                $event['content_en'],
                $event['start_time'],
                $event['end_time'],
                $event['location'],
                $event['location_en'],
                $event['status'],
                $event['is_featured'],
                $event['registration_required'] ?? 0,
                $event['max_participants'] ?? null,
                $event['contact_email'] ?? null,
                $event['author_id']
            ]);
            
            echo "✅ Sample event '{$event['title']}' created\n";
        } else {
            echo "ℹ️ Event '{$event['title']}' already exists\n";
        }
    }
    
    echo "\n🎉 Database setup completed successfully!\n";
    echo "You can now test the events API at: http://localhost/final-dseza-landing-85/api/events\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?> 