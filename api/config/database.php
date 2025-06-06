<?php 
// Load environment variables
require_once __DIR__ . '/../core/EnvLoader.php';

// Load .env file
$envPath = __DIR__ . '/../../.env';
if (file_exists($envPath)) {
    EnvLoader::load($envPath);
}

return [
    'host' => EnvLoader::get('DB_HOST', 'localhost'),
    'port' => (int) EnvLoader::get('DB_PORT', 3306),
    'database' => EnvLoader::get('DB_DATABASE', 'dseza_investment_hub'),
    'username' => EnvLoader::get('DB_USERNAME', 'root'),
    'password' => EnvLoader::get('DB_PASSWORD', ''),
    'charset' => EnvLoader::get('DB_CHARSET', 'utf8mb4'),
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ],
];
?>
