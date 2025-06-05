<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Debug News API</h1>";

try {
    echo "<h2>Step 1: Include files</h2>";
    require_once 'core/Database.php';
    echo "✅ Database.php included<br>";
    
    require_once 'core/AuthMiddleware.php';
    echo "✅ AuthMiddleware.php included<br>";
    
    require_once 'core/News.php';
    echo "✅ News.php included<br>";
    
    echo "<h2>Step 2: Test News class</h2>";
    $newsModel = new News();
    echo "✅ News model created<br>";
    
    echo "<h2>Step 3: Test getList method</h2>";
    $result = $newsModel->getList(['page' => 1, 'limit' => 5]);
    echo "✅ getList method works<br>";
    echo "Found " . count($result['data']) . " articles<br>";
    
    echo "<h2>Step 4: Test AuthMiddleware</h2>";
    
    // Simulate a request with token
    $_SERVER['HTTP_AUTHORIZATION'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkYW5hbmctaW52ZXN0LWh1Yi5nb3Yudm4iLCJhdWQiOiJkYW5hbmctaW52ZXN0LWh1Yi5nb3Yudm4iLCJpYXQiOjE3NDkwOTc0OTAsImV4cCI6MTc0OTE4Mzg5MCwidXNlcl9pZCI6MSwiZW1haWwiOiJhZG1pbkBkc2V6YS5nb3Yudm4iLCJyb2xlIjoiQWRtaW4iLCJmdWxsX25hbWUiOiJTeXN0ZW0gQWRtaW5pc3RyYXRvciJ9.rZIsmrBECnTQ8nQkhF0w0AZ1HVH2OhVxT3qujtAfZjE';
    
    $authMiddleware = new AuthMiddleware();
    echo "✅ AuthMiddleware created<br>";
    
    $user = $authMiddleware->validateRequest();
    echo "✅ Token validated<br>";
    echo "User: " . $user['email'] . " (" . $user['role'] . ")<br>";
    
    echo "<h2>✅ All components working!</h2>";
    
} catch (Exception $e) {
    echo "<h2>❌ Error: " . $e->getMessage() . "</h2>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?> 