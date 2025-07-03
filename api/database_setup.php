<?php
// Database setup script for DSEZA Portal API
// This script creates the complete database structure for the news management system

require_once 'config/database.php';

try {
    $database = getDatabase();
    $pdo = $database->getConnection();
    
    echo "🚀 Starting database setup...\n";
    
    // Create translations table
    $sql = "CREATE TABLE IF NOT EXISTS translations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        `key` VARCHAR(255) UNIQUE NOT NULL,
        vietnamese TEXT NOT NULL,
        english TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_active (is_active),
        INDEX idx_key (`key`)
    )";
    
    $pdo->exec($sql);
    echo "✅ Table translations created successfully\n";
    
    // Check if translations already exist
    $checkSql = "SELECT COUNT(*) as count FROM translations";
    $result = $pdo->query($checkSql);
    $count = $result ? $result->fetch()['count'] : 0;
    
    if ($count == 0) {
        // Insert sample translations
        $sampleTranslations = [
            ['key' => 'common.home', 'vietnamese' => 'Trang chủ', 'english' => 'Home', 'category' => 'common'],
            ['key' => 'common.about', 'vietnamese' => 'Giới thiệu', 'english' => 'About', 'category' => 'common'],
            ['key' => 'common.news', 'vietnamese' => 'Tin tức', 'english' => 'News', 'category' => 'common'],
            ['key' => 'common.contact', 'vietnamese' => 'Liên hệ', 'english' => 'Contact', 'category' => 'common'],
            ['key' => 'nav.dashboard', 'vietnamese' => 'Bảng điều khiển', 'english' => 'Dashboard', 'category' => 'navigation'],
            ['key' => 'nav.translations', 'vietnamese' => 'Bản dịch', 'english' => 'Translations', 'category' => 'navigation'],
            ['key' => 'admin.translations.title', 'vietnamese' => 'Quản lý Bản dịch', 'english' => 'Translation Management', 'category' => 'admin'],
            ['key' => 'admin.translations.description', 'vietnamese' => 'Quản lý và chỉnh sửa các bản dịch đa ngôn ngữ', 'english' => 'Manage and edit multilingual translations', 'category' => 'admin']
        ];
        
        $insertSql = "INSERT INTO translations (`key`, vietnamese, english, category, is_active) VALUES (?, ?, ?, ?, 1)";
        $stmt = $pdo->prepare($insertSql);
        
        foreach ($sampleTranslations as $translation) {
            $stmt->execute([$translation['key'], $translation['vietnamese'], $translation['english'], $translation['category']]);
        }
        
        echo "✅ Sample translations inserted successfully\n";
    } else {
        echo "ℹ️  Translations already exist, skipping insertion\n";
    }
    
    // Create news_categories table
    $sql = "CREATE TABLE IF NOT EXISTS news_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        type ENUM('document_field', 'issuing_agency', 'issuing_level', 'news_category', 'slideshow_location') DEFAULT 'news_category',
        parent_id INT DEFAULT NULL,
        order_position INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_active (is_active),
        INDEX idx_slug (slug),
        FOREIGN KEY (parent_id) REFERENCES news_categories(id) ON DELETE SET NULL
    )";
    
    $pdo->exec($sql);
    echo "✅ Table news_categories created successfully\n";
    
    // Check if categories already exist
    $checkSql = "SELECT COUNT(*) as count FROM news_categories WHERE type = 'news_category'";
    $result = $pdo->query($checkSql)->fetch();
    
    if ($result['count'] == 0) {
        // Insert sample news categories
        $categories = [
            ['name' => 'Tin tức chung', 'name_en' => 'General News', 'slug' => 'tin-tuc-chung', 'description' => 'Tin tức tổng hợp'],
            ['name' => 'Đầu tư', 'name_en' => 'Investment', 'slug' => 'dau-tu', 'description' => 'Thông tin về đầu tư'],
            ['name' => 'Sự kiện', 'name_en' => 'Events', 'slug' => 'su-kien', 'description' => 'Các sự kiện quan trọng'],
            ['name' => 'Chính sách', 'name_en' => 'Policy', 'slug' => 'chinh-sach', 'description' => 'Các chính sách mới'],
            ['name' => 'Dự án', 'name_en' => 'Projects', 'slug' => 'du-an', 'description' => 'Thông tin dự án']
        ];
        
        $insertSql = "INSERT INTO news_categories (name, name_en, slug, description, type, is_active) VALUES (?, ?, ?, ?, 'news_category', 1)";
        $stmt = $pdo->prepare($insertSql);
        
        foreach ($categories as $category) {
            $stmt->execute([$category['name'], $category['name_en'], $category['slug'], $category['description']]);
        }
        
        echo "✅ Sample news categories inserted successfully\n";
    } else {
        echo "ℹ️  News categories already exist, skipping insertion\n";
    }
    
    // Create news_articles table
    $sql = "CREATE TABLE IF NOT EXISTS news_articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        title_en VARCHAR(500),
        slug VARCHAR(500) UNIQUE NOT NULL,
        excerpt TEXT,
        excerpt_en TEXT,
        content LONGTEXT,
        content_en LONGTEXT,
        image_url VARCHAR(1000),
        category_id INT NOT NULL,
        author VARCHAR(255) NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        reading_time VARCHAR(50),
        reading_time_en VARCHAR(50),
        views_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_featured (is_featured),
        INDEX idx_category (category_id),
        INDEX idx_slug (slug),
        INDEX idx_publish_date (publish_date),
        FOREIGN KEY (category_id) REFERENCES news_categories(id) ON DELETE CASCADE
    )";
    
    $pdo->exec($sql);
    echo "✅ Table news_articles created successfully\n";
    
    // Check current categories
    $checkSql = "SELECT id, name, slug, type, is_active FROM news_categories WHERE type = 'news_category' ORDER BY id";
    $stmt = $pdo->query($checkSql);
    $categories = $stmt->fetchAll();
    
    echo "\n📋 Current news categories:\n";
    foreach ($categories as $category) {
        $status = $category['is_active'] ? '✅' : '❌';
        echo "  $status ID: {$category['id']} | {$category['name']} | slug: {$category['slug']}\n";
    }
    
    echo "\n🎉 Database setup completed successfully!\n";
    echo "You can now use the admin form to create news articles and manage translations.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

$pdo = null;
?>

<style>
body {
    font-family: Arial, sans-serif;
    max-width: 900px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f8f9fa;
    line-height: 1.6;
}

h2 {
    color: #2c3e50;
    border-bottom: 3px solid #3498db;
    padding-bottom: 10px;
}

h3 {
    color: #34495e;
    margin-top: 30px;
}

p {
    margin: 10px 0;
}

ul {
    margin: 10px 0;
    padding-left: 20px;
}

li {
    margin: 8px 0;
}

code {
    background-color: #ecf0f1;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
}

.success {
    color: #27ae60;
}

.error {
    color: #e74c3c;
}

.warning {
    color: #f39c12;
}
</style> 