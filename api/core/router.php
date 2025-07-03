<?php
// api/core/router.php
// Router class to handle API routing

class Router {
    private $routes = [];
    private $middlewares = [];
    
    // Add route for GET method
    public function get($uri, $callback) {
        $this->addRoute('GET', $uri, $callback);
    }
    
    // Add route for POST method
    public function post($uri, $callback) {
        $this->addRoute('POST', $uri, $callback);
    }
    
    // Add route for PUT method
    public function put($uri, $callback) {
        $this->addRoute('PUT', $uri, $callback);
    }
    
    // Add route for DELETE method
    public function delete($uri, $callback) {
        $this->addRoute('DELETE', $uri, $callback);
    }
    
    // Add middleware
    public function middleware($middleware) {
        $this->middlewares[] = $middleware;
    }
    
    // Add route to routes array
    private function addRoute($method, $uri, $callback) {
        $this->routes[] = [
            'method' => $method,
            'uri' => $uri,
            'callback' => $callback
        ];
    }
    
    // Dispatch the request
    public function dispatch() {
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove API prefix if present
        $requestUri = preg_replace('#^/final-dseza-landing-85/api#', '', $requestUri);
        $requestUri = rtrim($requestUri, '/');
        
        if (empty($requestUri)) {
            $requestUri = '/';
        }
        
        // Execute middlewares
        foreach ($this->middlewares as $middleware) {
            $middleware();
        }
        
        // Find matching route
        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod) {
                $pattern = $this->convertToRegex($route['uri']);
                if (preg_match($pattern, $requestUri, $matches)) {
                    // Extract parameters
                    array_shift($matches); // Remove full match
                    
                    // Execute callback
                    if (is_callable($route['callback'])) {
                        call_user_func_array($route['callback'], $matches);
                        return;
                    } else if (is_array($route['callback'])) {
                        $controller = new $route['callback'][0]();
                        $method = $route['callback'][1];
                        call_user_func_array([$controller, $method], $matches);
                        return;
                    }
                }
            }
        }
        
        // No route found
        $this->notFound();
    }
    
    // Convert route URI to regex pattern
    private function convertToRegex($uri) {
        // Escape special regex characters
        $pattern = preg_quote($uri, '#');
        
        // Replace route parameters {param} with regex groups
        $pattern = preg_replace('/\\\{([^}]+)\\\}/', '([^/]+)', $pattern);
        
        return '#^' . $pattern . '$#';
    }
    
    // Handle 404 Not Found
    private function notFound() {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Endpoint not found',
            'code' => 404,
            'debug' => [
                'method' => $_SERVER['REQUEST_METHOD'],
                'uri' => $_SERVER['REQUEST_URI'],
                'parsed_uri' => parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH),
                'routes' => array_map(function($route) {
                    return ['method' => $route['method'], 'uri' => $route['uri']];
                }, $this->routes)
            ]
        ]);
    }
}

// Helper function to get request body
function getRequestBody() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

// Helper function to send JSON response
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
}

// Helper function to send error response
function sendErrorResponse($message, $statusCode = 400, $details = null) {
    $response = [
        'status' => 'error',
        'message' => $message,
        'code' => $statusCode
    ];
    
    if ($details !== null) {
        $response['details'] = $details;
    }
    
    sendJsonResponse($response, $statusCode);
}

// Helper function to send success response
function sendSuccessResponse($data = null, $message = null, $statusCode = 200) {
    $response = [
        'status' => 'success'
    ];
    
    if ($message !== null) {
        $response['message'] = $message;
    }
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    sendJsonResponse($response, $statusCode);
}
?> 