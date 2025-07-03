<?php
// api/config/database.php
// Database configuration and connection class

class Database {
    private $host = 'localhost';
    private $database_name = 'signup_form';
    private $username = 'root';
    private $password = 'Kuroko1412@@';
    private $connection;
    
    // Get database connection
    public function getConnection() {
        $this->connection = null;
        
        try {
            $this->connection = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch(PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            throw new Exception("Database connection failed");
        }
        
        return $this->connection;
    }
    
    // Execute query and return results
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch(PDOException $exception) {
            error_log("Database query error: " . $exception->getMessage());
            throw new Exception("Database query failed");
        }
    }
    
    // Get last insert ID
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
    
    // Begin transaction
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    // Commit transaction
    public function commit() {
        return $this->connection->commit();
    }
    
    // Rollback transaction
    public function rollback() {
        return $this->connection->rollback();
    }
}

// Database configuration constants
define('DB_HOST', 'localhost');
define('DB_NAME', 'signup_form');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'Kuroko1412@@');
define('DB_CHARSET', 'utf8mb4');

// Get database instance
function getDatabase() {
    static $database = null;
    if ($database === null) {
        $database = new Database();
        $database->getConnection();
    }
    return $database;
}
?> 