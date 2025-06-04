<?php

// Copy this file to config.php and update with your actual values
// DO NOT commit config.php to version control

return [
    'database' => [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'dseza_investment_hub',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
    ],
    
    'jwt' => [
        'secret_key' => 'your-super-secret-jwt-key-change-this-in-production-min-256-bits',
        'algorithm' => 'HS256',
        'issuer' => 'dseza-investment-hub',
        'audience' => 'dseza-admin-panel',
        'expiration_time' => 24 * 60 * 60, // 24 hours
    ],
    
    'app' => [
        'env' => 'development',
        'debug' => true,
        'url' => 'http://localhost',
    ],
    
    'cors' => [
        'allowed_origins' => [
            'http://localhost:3000',
            'http://localhost:5173'
        ]
    ]
]; 