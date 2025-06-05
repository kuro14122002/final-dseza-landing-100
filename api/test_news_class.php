<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Testing News class...\n";

try {
    require_once 'core/Database.php';
    echo "Database class loaded\n";
    
    require_once 'core/News.php';
    echo "News class loaded\n";
    
    $news = new News();
    echo "News instance created\n";
    
    $categories = $news->getCategories();
    echo "Categories: " . count($categories) . " found\n";
    
    echo "Success!\n";
    
} catch(Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?> 