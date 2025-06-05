<?php
/**
 * Check Database Schema
 * Kiểm tra cấu trúc bảng cho News Management API
 */

require_once __DIR__ . '/core/Database.php';

$db = Database::getInstance();
$pdo = $db->getConnection();

echo "<h1>📊 Database Schema Check</h1>";

// Check news_articles table
echo "<h2>📰 News Articles Table Structure</h2>";
try {
    $stmt = $pdo->query("DESCRIBE news_articles");
    $columns = $stmt->fetchAll();
    
    if (!empty($columns)) {
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        foreach ($columns as $col) {
            echo "<tr>";
            echo "<td>{$col['Field']}</td>";
            echo "<td>{$col['Type']}</td>";
            echo "<td>{$col['Null']}</td>";
            echo "<td>{$col['Key']}</td>";
            echo "<td>{$col['Default']}</td>";
            echo "<td>{$col['Extra']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Check data count
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM news_articles");
        $count = $stmt->fetch()['count'];
        echo "<p><strong>Total records:</strong> {$count}</p>";
        
    } else {
        echo "<p>❌ news_articles table not found or empty</p>";
    }
} catch (Exception $e) {
    echo "<p>❌ Error checking news_articles: " . $e->getMessage() . "</p>";
}

// Check categories table
echo "<h2>🏷️ Categories Table Structure</h2>";
try {
    $stmt = $pdo->query("DESCRIBE categories");
    $columns = $stmt->fetchAll();
    
    if (!empty($columns)) {
        echo "<table border='1' style='border-collapse: collapse;'>";
        echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        foreach ($columns as $col) {
            echo "<tr>";
            echo "<td>{$col['Field']}</td>";
            echo "<td>{$col['Type']}</td>";
            echo "<td>{$col['Null']}</td>";
            echo "<td>{$col['Key']}</td>";
            echo "<td>{$col['Default']}</td>";
            echo "<td>{$col['Extra']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Check data count
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM categories");
        $count = $stmt->fetch()['count'];
        echo "<p><strong>Total records:</strong> {$count}</p>";
        
        // Show sample categories
        if ($count > 0) {
            $stmt = $pdo->query("SELECT * FROM categories LIMIT 5");
            $categories = $stmt->fetchAll();
            echo "<h3>Sample Categories:</h3>";
            echo "<ul>";
            foreach ($categories as $cat) {
                echo "<li>ID: {$cat['id']} - " . (isset($cat['name_vi']) ? $cat['name_vi'] : $cat['name']) . "</li>";
            }
            echo "</ul>";
        }
        
    } else {
        echo "<p>❌ categories table not found or empty</p>";
    }
} catch (Exception $e) {
    echo "<p>❌ Error checking categories: " . $e->getMessage() . "</p>";
}

// Check users_admin table structure
echo "<h2>👤 Users Admin Table Structure</h2>";
try {
    $stmt = $pdo->query("DESCRIBE users_admin");
    $columns = $stmt->fetchAll();
    
    echo "<table border='1' style='border-collapse: collapse;'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
    foreach ($columns as $col) {
        echo "<tr>";
        echo "<td>{$col['Field']}</td>";
        echo "<td>{$col['Type']}</td>";
        echo "<td>{$col['Null']}</td>";
        echo "<td>{$col['Key']}</td>";
        echo "<td>{$col['Default']}</td>";
        echo "<td>{$col['Extra']}</td>";
        echo "</tr>";
    }
    echo "</table>";
    
} catch (Exception $e) {
    echo "<p>❌ Error checking users_admin: " . $e->getMessage() . "</p>";
}

// Show all tables
echo "<h2>🗃️ All Tables in Database</h2>";
try {
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>{$table}</li>";
    }
    echo "</ul>";
} catch (Exception $e) {
    echo "<p>❌ Error listing tables: " . $e->getMessage() . "</p>";
}

?> 