<?php
// api/fix_events_table_simple.php
// Simple script to create events table

require_once __DIR__ . '/config/database.php';

try {
    $db = getDatabase();
    
    echo "Creating events table...\n";
    
    // Drop table if exists
    $db->query("DROP TABLE IF EXISTS events");
    echo "✅ Dropped existing events table\n";
    
    // Create events table with simple structure
    $eventsTableSQL = "
    CREATE TABLE events (
        id int(11) NOT NULL AUTO_INCREMENT,
        slug varchar(255) NOT NULL,
        title varchar(500) NOT NULL,
        title_en varchar(500) DEFAULT NULL,
        description text NOT NULL,
        description_en text DEFAULT NULL,
        content longtext DEFAULT NULL,
        content_en longtext DEFAULT NULL,
        start_time datetime NOT NULL,
        end_time datetime NOT NULL,
        location varchar(255) DEFAULT NULL,
        location_en varchar(255) DEFAULT NULL,
        image_url varchar(500) DEFAULT NULL,
        status enum('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
        is_featured tinyint(1) DEFAULT 0,
        max_participants int(11) DEFAULT NULL,
        registration_required tinyint(1) DEFAULT 0,
        registration_deadline datetime DEFAULT NULL,
        contact_email varchar(255) DEFAULT NULL,
        contact_phone varchar(20) DEFAULT NULL,
        author_id int(11) DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    $db->query($eventsTableSQL);
    echo "✅ Events table created successfully!\n";
    
    // Add indexes separately
    $db->query("ALTER TABLE events ADD UNIQUE KEY unique_slug (slug)");
    $db->query("ALTER TABLE events ADD KEY idx_status (status)");
    $db->query("ALTER TABLE events ADD KEY idx_featured (is_featured)");
    $db->query("ALTER TABLE events ADD KEY idx_start_time (start_time)");
    echo "✅ Indexes added successfully!\n";
    
    // Insert sample events
    echo "Inserting sample events...\n";
    
    $sampleEvents = [
        [
            'slug' => 'su-kien-khai-truong-khu-cnc',
            'title' => 'Sự kiện khai trương Khu công nghệ cao Đà Nẵng',
            'title_en' => 'Da Nang High-Tech Park Opening Event',
            'description' => 'Lễ khai trương chính thức Khu công nghệ cao Đà Nẵng.',
            'description_en' => 'Official opening ceremony of Da Nang High-Tech Park.',
            'content' => '<p>Sự kiện khai trương quan trọng của Khu công nghệ cao Đà Nẵng.</p>',
            'content_en' => '<p>Important opening event of Da Nang High-Tech Park.</p>',
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
            'description' => 'Hội thảo về cơ hội đầu tư CNTT.',
            'description_en' => 'Conference on IT investment opportunities.',
            'content' => '<p>Hội thảo với các chuyên gia đầu tư.</p>',
            'content_en' => '<p>Conference with investment experts.</p>',
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
    
    $insertSQL = "INSERT INTO events (slug, title, title_en, description, description_en, content, content_en, start_time, end_time, location, location_en, status, is_featured, registration_required, max_participants, contact_email, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    foreach ($sampleEvents as $event) {
        $db->query($insertSQL, [
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
        
        echo "✅ Event '{$event['title']}' created\n";
    }
    
    // Test the database
    $testQuery = $db->query("SELECT COUNT(*) as count FROM events");
    $count = $testQuery->fetch()['count'];
    echo "\n🎉 Success! Found {$count} events in database\n";
    
    echo "You can now test the events API at: http://localhost/final-dseza-landing-85/api/events\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?> 