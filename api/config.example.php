<?php
// api/config.example.php
// Example configuration file - Copy this to config.php and update with your settings

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'dseza_db');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'your_password_here');
define('DB_CHARSET', 'utf8mb4');

// JWT Configuration
define('JWT_SECRET_KEY', 'your_jwt_secret_key_here_change_in_production');
define('JWT_EXPIRATION_TIME', 24 * 60 * 60); // 24 hours in seconds

// API Configuration
define('API_VERSION', '1.0.0');
define('API_NAME', 'DSEZA Portal API');

// CORS Configuration
define('CORS_ALLOW_ORIGIN', '*'); // Change to specific domain in production
define('CORS_ALLOW_METHODS', 'GET, POST, PUT, DELETE, OPTIONS');
define('CORS_ALLOW_HEADERS', 'Content-Type, Authorization, X-Requested-With');

// Environment
define('ENVIRONMENT', 'development'); // development, production
define('DEBUG_MODE', true); // Set to false in production

// Admin Settings
define('DEFAULT_ADMIN_USERNAME', 'admin');
define('DEFAULT_ADMIN_PASSWORD', 'admin123'); // Change this immediately!
define('DEFAULT_ADMIN_EMAIL', 'admin@dseza.gov.vn');
?> 