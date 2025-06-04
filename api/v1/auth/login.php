<?php

// Set headers for CORS and JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST method for login
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Only POST method is accepted.'
    ]);
    exit;
}

// Include required classes
require_once __DIR__ . '/../../core/Database.php';
require_once __DIR__ . '/../../core/User.php';
require_once __DIR__ . '/../../core/AuthHelper.php';

/**
 * Send JSON response with appropriate HTTP status code
 */
function sendResponse($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Send error response
 */
function sendError($statusCode, $message) {
    sendResponse($statusCode, [
        'status' => 'error',
        'message' => $message
    ]);
}

/**
 * Send success response
 */
function sendSuccess($data) {
    sendResponse(200, array_merge([
        'status' => 'success'
    ], $data));
}

try {
    // Get request body
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Check if JSON is valid
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError(400, 'Invalid JSON format in request body.');
    }

    // Validate required fields
    if (!isset($data['email']) || !isset($data['password'])) {
        sendError(400, 'Email and password are required.');
    }

    $email = trim($data['email']);
    $password = trim($data['password']);

    // Validate email format
    if (empty($email)) {
        sendError(400, 'Email cannot be empty.');
    }

    if (empty($password)) {
        sendError(400, 'Password cannot be empty.');
    }

    // Initialize User model
    $userModel = new User();

    // Validate email format
    if (!$userModel->isValidEmail($email)) {
        sendError(400, 'Invalid email format.');
    }

    // Find user by email
    $user = $userModel->findByEmail($email);

    if (!$user) {
        // Don't reveal that user doesn't exist for security
        sendError(401, 'Invalid credentials.');
    }

    // Check if user is active
    if (!$userModel->isActive($user)) {
        sendError(401, 'Account is inactive. Please contact administrator.');
    }

    // Verify password
    if (!$userModel->verifyPassword($password, $user['password_hash'])) {
        sendError(401, 'Invalid credentials.');
    }

    // Password is correct, create JWT token
    $authHelper = new AuthHelper();
    $userData = $userModel->getUserForToken($user);
    
    try {
        $token = $authHelper->createToken($userData);
        
        // Update user's last login time
        $userModel->updateLastLogin($user['id']);

        // Send success response
        sendSuccess([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $userData
        ]);

    } catch (Exception $e) {
        error_log("Token creation error: " . $e->getMessage());
        sendError(500, 'An internal server error occurred. Please try again later.');
    }

} catch (Exception $e) {
    // Log the error for debugging
    error_log("Login API Error: " . $e->getMessage());
    
    // Send generic error response to client
    sendError(500, 'An internal server error occurred. Please try again later.');
} 