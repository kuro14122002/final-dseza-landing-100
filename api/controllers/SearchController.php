<?php
// api/controllers/SearchController.php
// Search controller for handling search API endpoints

require_once __DIR__ . '/../models/News.php';
require_once __DIR__ . '/../core/router.php';

class SearchController {
    private $newsModel;
    
    public function __construct() {
        $this->newsModel = new News();
    }
    
    // GET /api/search - Global search endpoint
    public function search() {
        try {
            $query = trim($_GET['q'] ?? '');
            $type = $_GET['type'] ?? 'all'; // 'all', 'news', 'documents'
            $page = max(1, intval($_GET['page'] ?? 1));
            $limit = max(1, min(50, intval($_GET['limit'] ?? 10))); // Max 50 results per page
            
            // Validate query
            if (empty($query)) {
                sendErrorResponse('Search query is required', 400);
                return;
            }
            
            if (strlen($query) < 2) {
                sendErrorResponse('Search query must be at least 2 characters long', 400);
                return;
            }
            
            $results = [];
            $totalResults = 0;
            
            // Search based on type
            switch($type) {
                case 'news':
                    $searchResult = $this->searchNews($query, $page, $limit);
                    $results = $searchResult['results'];
                    $totalResults = $searchResult['total'];
                    break;
                    
                case 'documents':
                    $searchResult = $this->searchDocuments($query, $page, $limit);
                    $results = $searchResult['results'];
                    $totalResults = $searchResult['total'];
                    break;
                    
                case 'all':
                default:
                    $searchResult = $this->searchAll($query, $page, $limit);
                    $results = $searchResult['results'];
                    $totalResults = $searchResult['total'];
                    break;
            }
            
            $response = [
                'results' => $results,
                'query' => $query,
                'type' => $type,
                'totalResults' => $totalResults,
                'totalPages' => ceil($totalResults / $limit),
                'currentPage' => $page,
                'resultsPerPage' => $limit
            ];
            
            sendSuccessResponse($response);
            
        } catch (Exception $e) {
            error_log("Search error: " . $e->getMessage());
            sendErrorResponse('Search failed', 500, $e->getMessage());
        }
    }
    
    // Search in news articles  
    private function searchNews($query, $page, $limit) {
        try {
            // Use the existing search method from News model
            $result = $this->newsModel->search($query, $page, $limit);
            
            // Format results to match expected structure
            $formattedResults = [];
            foreach ($result['articles'] as $article) {
                $formattedResults[] = [
                    'type' => 'news',
                    'id' => $article['id'],
                    'slug' => $article['slug'], 
                    'title' => $article['title'],
                    'titleEn' => $article['titleEn'],
                    'excerpt' => $this->highlightSearchTerm($article['excerpt'], $query),
                    'excerptEn' => $this->highlightSearchTerm($article['excerptEn'], $query),
                    'imageUrl' => $article['imageUrl'],
                    'publishDate' => $article['publishDate'],
                    'category' => $article['category'],
                    'url' => "/news/{$article['slug']}"
                ];
            }
            
            return [
                'results' => $formattedResults,
                'total' => $result['totalArticles']
            ];

            
        } catch (Exception $e) {
            error_log("News search error: " . $e->getMessage());
            throw new Exception("Failed to search news articles");
        }
    }
    
    // Search in documents (placeholder - will be implemented when document model is available)
    private function searchDocuments($query, $page, $limit) {
        // TODO: Implement document search when document model is available
        // For now, return empty results
        return ['results' => [], 'total' => 0];
    }
    
    // Search in all content types
    private function searchAll($query, $page, $limit) {
        try {
            // For now, only search in news since documents are not implemented yet
            $newsResult = $this->searchNews($query, $page, $limit);
            
            // TODO: When documents are implemented, merge results from both news and documents
            // and sort by relevance/date
            
            return $newsResult;
            
        } catch (Exception $e) {
            error_log("Global search error: " . $e->getMessage());
            throw new Exception("Failed to perform global search");
        }
    }
    
    // Highlight search terms in text
    private function highlightSearchTerm($text, $query, $highlightClass = 'search-highlight') {
        if (empty($text) || empty($query)) {
            return $text;
        }
        
        // Split query into individual words
        $words = array_filter(explode(' ', $query));
        
        foreach ($words as $word) {
            if (strlen($word) >= 2) { // Only highlight words with 2+ characters
                $text = preg_replace(
                    '/(' . preg_quote($word, '/') . ')/iu',
                    '<mark class="' . $highlightClass . '">$1</mark>',
                    $text
                );
            }
        }
        
        return $text;
    }
}
?> 