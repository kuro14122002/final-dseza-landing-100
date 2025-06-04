-- Extended Database Setup for DSEZA Investment Hub
-- Includes tables for news_articles and event_articles to support stats API
-- File: api/database_setup_extended.sql

USE dseza_investment_hub;

-- Create news_articles table
DROP TABLE IF EXISTS news_articles;

CREATE TABLE news_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    title_en VARCHAR(500) NULL,
    excerpt TEXT NULL,
    excerpt_en TEXT NULL,
    content LONGTEXT NULL,
    content_en LONGTEXT NULL,
    image_url VARCHAR(1000) NULL,
    category_id INT NOT NULL,
    status ENUM('draft', 'pending', 'published') NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT 0,
    reading_time VARCHAR(50) NULL,
    reading_time_en VARCHAR(50) NULL,
    author_id INT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    publish_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_slug (slug),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured),
    INDEX idx_publish_date (publish_date),
    INDEX idx_author_id (author_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create event_articles table
DROP TABLE IF EXISTS event_articles;

CREATE TABLE event_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    title_en VARCHAR(500) NULL,
    excerpt TEXT NULL,
    excerpt_en TEXT NULL,
    content LONGTEXT NULL,
    content_en LONGTEXT NULL,
    image_url VARCHAR(1000) NULL,
    event_date DATETIME NOT NULL,
    event_end_date DATETIME NULL,
    location VARCHAR(500) NULL,
    location_en VARCHAR(500) NULL,
    category_id INT NOT NULL,
    status ENUM('draft', 'pending', 'published') NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT 0,
    max_participants INT NULL,
    registration_deadline DATETIME NULL,
    author_id INT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_slug (slug),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured),
    INDEX idx_event_date (event_date),
    INDEX idx_author_id (author_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create categories table for news and events
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NULL,
    description TEXT NULL,
    description_en TEXT NULL,
    type ENUM('news', 'event', 'both') NOT NULL DEFAULT 'both',
    is_active BOOLEAN NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_slug (slug),
    INDEX idx_type (type),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample categories
INSERT INTO categories (slug, name, name_en, description, description_en, type, sort_order) VALUES
('investment', 'Đầu tư & Hợp tác Quốc tế', 'Investment & International Cooperation', 'Tin tức về các dự án đầu tư và hợp tác quốc tế', 'News about investment projects and international cooperation', 'both', 1),
('training', 'Đào tạo & Ươm tạo DN', 'Training & Business Incubation', 'Các chương trình đào tạo và ươm tạo doanh nghiệp', 'Training programs and business incubation', 'both', 2),
('digital', 'Chuyển đổi Số', 'Digital Transformation', 'Tin tức về chuyển đổi số và công nghệ', 'News about digital transformation and technology', 'both', 3),
('management', 'Hoạt động Quản lý', 'Management Activities', 'Các hoạt động quản lý và vận hành', 'Management and operational activities', 'both', 4),
('other', 'Tin tức Khác', 'Other News', 'Các tin tức và thông tin khác', 'Other news and information', 'both', 5);

-- Insert sample news articles
INSERT INTO news_articles (slug, title, title_en, excerpt, excerpt_en, content, content_en, category_id, status, is_featured, author_id, author_name, publish_date) VALUES
('dseza-thu-hut-fdi-100-trieu-usd', 
 'DSEZA thu hút thành công dự án FDI 100 triệu USD từ Nhật Bản',
 'DSEZA successfully attracts $100M FDI project from Japan',
 'Dự án tập trung vào sản xuất linh kiện điện tử công nghệ cao, dự kiến tạo ra hàng ngàn việc làm cho người lao động địa phương.',
 'The project focuses on high-tech electronic component manufacturing, expected to create thousands of jobs for local workers.',
 '<p>Sáng ngày 20/05/2025, Ban Quản lý Khu Công nghệ cao và các Khu Công nghiệp Đà Nẵng (DSEZA) đã chính thức ký kết thỏa thuận hợp tác với Tập đoàn Technova Industries của Nhật Bản...</p>',
 '<p>On the morning of May 20, 2025, the Management Board of Da Nang High-Tech Park and Industrial Zones (DSEZA) officially signed a cooperation agreement with Japan\'s Technova Industries Group...</p>',
 1, 'published', 1, 1, 'admin@dseza.gov.vn', '2025-05-20 08:00:00'),
 
('hoi-thao-xuc-tien-dau-tu-singapore',
 'Hội thảo xúc tiến đầu tư vào Đà Nẵng tổ chức tại Singapore',
 'Da Nang investment promotion workshop held in Singapore',
 'Nhiều nhà đầu tư Singapore bày tỏ sự quan tâm sâu sắc đến môi trường đầu tư tại các KCN, KCNC Đà Nẵng.',
 'Many Singaporean investors expressed deep interest in the investment environment in Da Nang\'s industrial zones.',
 '<p>Ngày 18/05/2025, Đoàn công tác của Ban Quản lý DSEZA đã tổ chức thành công hội thảo xúc tiến đầu tư tại Singapore...</p>',
 '<p>On May 18, 2025, the DSEZA management delegation successfully organized an investment promotion workshop in Singapore...</p>',
 1, 'published', 0, 2, 'editor@dseza.gov.vn', '2025-05-18 09:00:00'),

('khoi-dong-chuong-trinh-uom-tao-khoi-nghiep',
 'Khởi động chương trình ươm tạo khởi nghiệp công nghệ DSEZA 2025',
 'DSEZA Technology Startup Incubation Program 2025 launched',
 'Chương trình năm nay dự kiến sẽ chọn 10 dự án tiềm năng để hỗ trợ phát triển sản phẩm.',
 'This year\'s program is expected to select 10 potential projects to support product development.',
 '<p>DSEZA chính thức khởi động chương trình ươm tạo khởi nghiệp công nghệ năm 2025...</p>',
 '<p>DSEZA officially launched the 2025 technology startup incubation program...</p>',
 2, 'draft', 0, 3, 'manager@dseza.gov.vn', '2025-05-19 07:30:00'),

('chuyen-doi-so-trong-quan-ly-khu-cong-nghiep',
 'Chuyển đổi số trong quản lý khu công nghiệp: Thành tựu và triển vọng',
 'Digital transformation in industrial zone management: Achievements and prospects',
 'DSEZA đã triển khai thành công nhiều giải pháp công nghệ số trong quản lý và vận hành các khu công nghiệp.',
 'DSEZA has successfully deployed many digital technology solutions in industrial zone management and operations.',
 '<p>Trong bối cảnh cuộc cách mạng công nghiệp 4.0 đang diễn ra mạnh mẽ...</p>',
 '<p>In the context of the ongoing Industrial Revolution 4.0...</p>',
 3, 'pending', 0, 1, 'admin@dseza.gov.vn', '2025-05-17 14:20:00'),

('le-ky-niem-20-nam-thanh-lap-dseza',
 'Lễ kỷ niệm 20 năm thành lập DSEZA: Nhìn lại chặng đường phát triển',
 'DSEZA 20th anniversary celebration: Looking back at the development journey',
 'Buổi lễ đã điểm lại những thành tựu đáng tự hào trong 20 năm qua và đề ra định hướng phát triển tương lai.',
 'The ceremony reviewed proud achievements over the past 20 years and outlined future development directions.',
 '<p>Ngày 16/05/2025, DSEZA đã tổ chức lễ kỷ niệm 20 năm thành lập...</p>',
 '<p>On May 16, 2025, DSEZA organized its 20th anniversary celebration...</p>',
 4, 'published', 1, 2, 'editor@dseza.gov.vn', '2025-05-16 11:45:00');

-- Insert sample events
INSERT INTO event_articles (slug, title, title_en, excerpt, excerpt_en, content, content_en, event_date, event_end_date, location, location_en, category_id, status, is_featured, max_participants, registration_deadline, author_id, author_name) VALUES
('hoi-nghi-xuc-tien-dau-tu-2025',
 'Hội nghị Xúc tiến Đầu tư 2025',
 '2025 Investment Promotion Conference',
 'Cơ hội kết nối với hàng trăm nhà đầu tư trong và ngoài nước',
 'Opportunity to connect with hundreds of domestic and international investors',
 '<p>Hội nghị Xúc tiến Đầu tư 2025 là sự kiện quan trọng nhất trong năm...</p>',
 '<p>The 2025 Investment Promotion Conference is the most important event of the year...</p>',
 '2025-06-25 08:00:00', '2025-06-25 17:00:00',
 'Trung tâm Hội nghị Quốc gia, Hà Nội',
 'National Convention Center, Hanoi',
 1, 'published', 1, 500, '2025-06-15 23:59:59', 1, 'admin@dseza.gov.vn'),

('workshop-startup-ecosystem',
 'Workshop Hệ sinh thái Khởi nghiệp',
 'Startup Ecosystem Workshop',
 'Tìm hiểu về xu hướng khởi nghiệp và cơ hội đầu tư',
 'Learn about startup trends and investment opportunities',
 '<p>Workshop chuyên sâu về hệ sinh thái khởi nghiệp...</p>',
 '<p>In-depth workshop on startup ecosystem...</p>',
 '2025-06-10 09:00:00', '2025-06-10 16:00:00',
 'DSEZA, Đà Nẵng',
 'DSEZA, Da Nang',
 2, 'published', 0, 100, '2025-06-05 23:59:59', 2, 'editor@dseza.gov.vn'),

('hoi-thao-chuyen-doi-so',
 'Hội thảo Chuyển đổi Số trong Doanh nghiệp',
 'Digital Transformation in Business Workshop',
 'Chia sẻ kinh nghiệm và giải pháp chuyển đổi số hiệu quả',
 'Share experiences and effective digital transformation solutions',
 '<p>Hội thảo tập trung vào các giải pháp chuyển đổi số...</p>',
 '<p>The workshop focuses on digital transformation solutions...</p>',
 '2025-05-30 13:00:00', '2025-05-30 17:00:00',
 'Khách sạn Pullman Đà Nẵng',
 'Pullman Danang Beach Resort',
 3, 'published', 0, 150, '2025-05-25 23:59:59', 3, 'manager@dseza.gov.vn');

-- Display sample data for verification
SELECT 'News Articles:' as info, COUNT(*) as count FROM news_articles;
SELECT 'Event Articles:' as info, COUNT(*) as count FROM event_articles;
SELECT 'Categories:' as info, COUNT(*) as count FROM categories;

-- Show recent news and events
SELECT 'Recent News:' as type, id, title, status, created_at FROM news_articles ORDER BY created_at DESC LIMIT 5;
SELECT 'Recent Events:' as type, id, title, status, event_date FROM event_articles ORDER BY event_date DESC LIMIT 3;

-- Show statistics that the API will return
SELECT 
    'Current Statistics' as info,
    (SELECT COUNT(*) FROM news_articles) as total_news,
    (SELECT COUNT(*) FROM event_articles) as total_events,
    (SELECT COUNT(*) FROM categories WHERE is_active = 1) as active_categories; 