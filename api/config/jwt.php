<?php
// Load environment variables if not already loaded
if (!class_exists('EnvLoader')) {
    require_once __DIR__ . '/../core/EnvLoader.php';
    $envPath = __DIR__ . '/../../.env';
    if (file_exists($envPath)) {
        EnvLoader::load($envPath);
    }
}

return [
    'secret_key' => EnvLoader::get('JWT_SECRET', 'your-default-secret-key'),
    'algorithm' => EnvLoader::get('JWT_ALGORITHM', 'HS256'),
    'issuer' => EnvLoader::get('JWT_ISSUER', 'dseza-investment-hub'),
    'audience' => EnvLoader::get('JWT_AUDIENCE', 'dseza-admin-panel'),
    'expiration_time' => (int) EnvLoader::get('JWT_EXPIRATION', 86400), // 24 hours
];
?>