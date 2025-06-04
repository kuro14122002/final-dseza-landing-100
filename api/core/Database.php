<?php

class Database
{
    private static $instance = null;
    private $connection;
    private $config;

    private function __construct()
    {
        $this->config = require __DIR__ . '/../config/database.php';
        $this->connect();
    }

    /**
     * Get singleton instance of Database
     */
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Establish database connection
     */
    private function connect()
    {
        try {
            $dsn = "mysql:host={$this->config['host']};port={$this->config['port']};dbname={$this->config['database']};charset={$this->config['charset']}";
            
            $this->connection = new PDO($dsn, $this->config['username'], $this->config['password'], $this->config['options']);
            
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }

    /**
     * Get PDO connection
     */
    public function getConnection()
    {
        // Check if connection is still alive
        if ($this->connection === null) {
            $this->connect();
        }
        
        return $this->connection;
    }

    /**
     * Execute query with parameters
     */
    public function query($sql, $params = [])
    {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Query execution failed: " . $e->getMessage());
            throw new Exception("Query execution failed");
        }
    }

    /**
     * Fetch single row
     */
    public function fetchOne($sql, $params = [])
    {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch();
    }

    /**
     * Fetch multiple rows
     */
    public function fetchAll($sql, $params = [])
    {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }

    /**
     * Get last inserted ID
     */
    public function lastInsertId()
    {
        return $this->connection->lastInsertId();
    }

    /**
     * Begin transaction
     */
    public function beginTransaction()
    {
        return $this->connection->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit()
    {
        return $this->connection->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback()
    {
        return $this->connection->rollback();
    }

    /**
     * Prevent cloning
     */
    private function __clone() {}

    /**
     * Prevent unserialization
     */
    public function __wakeup()
    {
        throw new Exception("Cannot unserialize singleton");
    }
} 