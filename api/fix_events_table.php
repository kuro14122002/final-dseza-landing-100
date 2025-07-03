<?php
// api/fix_events_table.php
// Script to fix events table structure

require_once __DIR__ . '/config/database.php';

try {
    $db = getDatabase();
    
    echo "Checking events table structure...\n";
    
    // Drop events table if exists to recreate with correct structure
    $db->query("DROP TABLE IF EXISTS events");
    echo "✅ Dropped existing events table\n";
    
    // Create events table with correct structure
    $eventsTableSQL = "
    CREATE TABLE `events` (
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
        UNIQUE KEY `slug` (`slug`),
        KEY `idx_status` (`status`),
        KEY `idx_featured` (`is_featured`),
        KEY `idx_start_time` (`start_time`),
        KEY `idx_author` (`author_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $db->query($eventsTableSQL);
    echo "✅ Events table created with correct structure!\n";
    
    // Insert sample events
    echo "Inserting sample events...\n";
    
    $sampleEvents = [
        [
            'slug' => 'su-kien-khai-truong-khu-cnc',
            'title' => 'Sự kiện khai trương Khu công nghệ cao Đà Nẵng',
            'title_en' => 'Da Nang High-Tech Park Opening Event',
            'description' => 'Lễ khai trương chính thức Khu công nghệ cao Đà Nẵng với sự tham gia của các lãnh đạo thành phố và doanh nghiệp.',
            'description_en' => 'Official opening ceremony of Da Nang High-Tech Park with participation of city leaders and businesses.',
            'content' => '<p>Khu công nghệ cao Đà Nẵng chính thức được khai trương với sự tham gia của đông đảo các lãnh đạo thành phố, doanh nghiệp và nhà đầu tư. Đây là sự kiện quan trọng đánh dấu bước phát triển mới của thành phố trong lĩnh vực công nghệ cao.</p>',
            'content_en' => '<p>Da Nang High-Tech Park officially opened with participation of many city leaders, businesses and investors. This is an important event marking a new development of the city in the high-tech sector.</p>',
            'start_time' => date('Y-m-d H:i:s', strtotime('+7 days 09:00')),
            'end_time' => date('Y-m-d H:i:s', strtotime('+7 days 13:00')),
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
            'description' => 'Hội thảo về cơ hội đầu tư trong lĩnh vực công nghệ thông tin tại Đà Nẵng với sự tham gia của các chuyên gia hàng đầu.',
            'description_en' => 'Conference on investment opportunities in IT sector in Da Nang with participation of leading experts.',
            'content' => '<p>Hội thảo quy tụ các chuyên gia đầu tư hàng đầu trong lĩnh vực công nghệ thông tin, chia sẻ về những cơ hội và thách thức trong đầu tư CNTT tại Đà Nẵng. Đây là cơ hội tuyệt vời để các nhà đầu tư và doanh nghiệp kết nối, trao đổi kinh nghiệm.</p>',
            'content_en' => '<p>The conference brings together leading investment experts in the IT field, sharing opportunities and challenges in IT investment in Da Nang. This is an excellent opportunity for investors and businesses to connect and exchange experiences.</p>',
            'start_time' => date('Y-m-d H:i:s', strtotime('+14 days 08:30')),
            'end_time' => date('Y-m-d H:i:s', strtotime('+14 days 17:30')),
            'location' => 'Trung tâm hội nghị Đà Nẵng',
            'location_en' => 'Da Nang Convention Center',
            'status' => 'upcoming',
            'is_featured' => 0,
            'registration_required' => 1,
            'max_participants' => 200,
            'registration_deadline' => date('Y-m-d H:i:s', strtotime('+12 days')),
            'contact_email' => 'info@dseza.vn',
            'contact_phone' => '0236.3.123456',
            'author_id' => 1
        ],
        [
            'slug' => 'trien-lam-cong-nghe-2024',
            'title' => 'Triển lãm công nghệ Đà Nẵng 2024',
            'title_en' => 'Da Nang Technology Exhibition 2024',
            'description' => 'Triển lãm các sản phẩm công nghệ mới nhất từ các doanh nghiệp trong và ngoài nước.',
            'description_en' => 'Exhibition of latest technology products from domestic and international companies.',
            'content' => '<p>Triển lãm công nghệ Đà Nẵng 2024 sẽ trưng bày các sản phẩm công nghệ tiên tiến nhất từ các doanh nghiệp hàng đầu. Đây là cơ hội để công chúng tiếp cận và trải nghiệm những công nghệ mới nhất.</p>',
            'content_en' => '<p>Da Nang Technology Exhibition 2024 will showcase the most advanced technology products from leading companies. This is an opportunity for the public to access and experience the latest technologies.</p>',
            'start_time' => date('Y-m-d H:i:s', strtotime('+21 days 09:00')),
            'end_time' => date('Y-m-d H:i:s', strtotime('+23 days 18:00')),
            'location' => 'Trung tâm triển lãm Đà Nẵng',
            'location_en' => 'Da Nang Exhibition Center',
            'status' => 'upcoming',
            'is_featured' => 1,
            'registration_required' => 0,
            'author_id' => 1
        ]
    ];
    
    foreach ($sampleEvents as $event) {
        $insertEventSQL = "INSERT INTO events (
            slug, title, title_en, description, description_en, content, content_en,
            start_time, end_time, location, location_en, status, is_featured,
            registration_required, max_participants, registration_deadline, contact_email, contact_phone, author_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
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
            $event['registration_deadline'] ?? null,
            $event['contact_email'] ?? null,
            $event['contact_phone'] ?? null,
            $event['author_id']
        ]);
        
        echo "✅ Sample event '{$event['title']}' created\n";
    }
    
    echo "\n🎉 Events table fixed and sample data inserted successfully!\n";
    echo "You can now test the events API at: http://localhost/final-dseza-landing-85/api/events\n";
    
    // Test the API
    echo "\nTesting API connection...\n";
    $testQuery = $db->query("SELECT COUNT(*) as count FROM events");
    $count = $testQuery->fetch()['count'];
    echo "✅ Found {$count} events in database\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?> 