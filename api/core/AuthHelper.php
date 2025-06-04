<?php

// Using SimpleJWT implementation instead of firebase/php-jwt for easier setup
// For production, consider using firebase/php-jwt library

require_once __DIR__ . '/SimpleJWT.php';

class AuthHelper
{
    private $config;

    public function __construct()
    {
        $this->config = require __DIR__ . '/../config/jwt.php';
    }

    /**
     * Create JWT token
     */
    public function createToken($userData)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + $this->config['expiration_time'];

        $payload = [
            'iss' => $this->config['issuer'],         // Issuer
            'aud' => $this->config['audience'],       // Audience
            'iat' => $issuedAt,                       // Issued at
            'exp' => $expirationTime,                 // Expiration time
            'user_id' => $userData['id'],
            'email' => $userData['email'],
            'role' => $userData['role'],
            'full_name' => $userData['full_name']
        ];

        try {
            return SimpleJWT::encode($payload, $this->config['secret_key'], $this->config['algorithm']);
        } catch (Exception $e) {
            error_log("JWT creation failed: " . $e->getMessage());
            throw new Exception("Token creation failed");
        }
    }

    /**
     * Verify and decode JWT token
     */
    public function verifyToken($token)
    {
        try {
            $decoded = SimpleJWT::decode($token, $this->config['secret_key'], $this->config['algorithm']);
            return $decoded;
        } catch (Exception $e) {
            error_log("JWT verification failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Extract token from Authorization header
     */
    public function extractTokenFromHeader()
    {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }

    /**
     * Get current user from token
     */
    public function getCurrentUser()
    {
        $token = $this->extractTokenFromHeader();
        
        if (!$token) {
            return null;
        }

        $decoded = $this->verifyToken($token);
        
        if (!$decoded) {
            return null;
        }

        return [
            'id' => $decoded['user_id'],
            'email' => $decoded['email'],
            'role' => $decoded['role'],
            'full_name' => $decoded['full_name'] ?? null
        ];
    }

    /**
     * Check if token is expired
     */
    public function isTokenExpired($token)
    {
        try {
            $decoded = $this->verifyToken($token);
            if (!$decoded) {
                return true;
            }
            
            return time() > $decoded['exp'];
        } catch (Exception $e) {
            return true;
        }
    }

    /**
     * Get token expiration time
     */
    public function getTokenExpirationTime()
    {
        return $this->config['expiration_time'];
    }

    /**
     * Create refresh token (longer expiration)
     */
    public function createRefreshToken($userData)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + $this->config['refresh_expiration_time'];

        $payload = [
            'iss' => $this->config['issuer'],
            'aud' => $this->config['audience'],
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'user_id' => $userData['id'],
            'type' => 'refresh'
        ];

        try {
            return SimpleJWT::encode($payload, $this->config['secret_key'], $this->config['algorithm']);
        } catch (Exception $e) {
            error_log("Refresh token creation failed: " . $e->getMessage());
            throw new Exception("Refresh token creation failed");
        }
    }
} 