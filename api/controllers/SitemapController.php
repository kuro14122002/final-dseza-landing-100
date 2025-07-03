<?php

require_once dirname(__DIR__) . '/models/News.php';
require_once dirname(__DIR__) . '/models/Event.php';
require_once dirname(__DIR__) . '/models/Category.php';

class SitemapController {
    private $baseUrl;
    private $urls = [];

    public function __construct() {
        $this->baseUrl = $this->getBaseUrl();
    }

    private function getBaseUrl() {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'dseza.danang.gov.vn';
        return rtrim($protocol . '://' . $host, '/');
    }

    public function generateXML() {
        try {
            $this->urls = [];
            $this->addStaticRoutes();
            $this->addNewsUrls();
            $this->addEventUrls();
            $this->addCategoryUrls();
            $this->removeDuplicates();
            $this->sortUrls();

            $xml = $this->buildXML();

            // Set proper headers
            header('Content-Type: application/xml; charset=utf-8');
            header('Cache-Control: public, max-age=86400'); // Cache for 24 hours
            
            echo $xml;
        } catch (Exception $e) {
            error_log("Sitemap generation error: " . $e->getMessage());
            http_response_code(500);
            echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>Failed to generate sitemap</error>";
        }
    }

    private function addStaticRoutes() {
        $staticRoutes = [
            [
                'loc' => $this->baseUrl . '/',
                'changefreq' => 'daily',
                'priority' => 1.0,
                'lastmod' => date('Y-m-d'),
                'alternates' => [
                    'vi' => $this->baseUrl . '/',
                    'en' => $this->baseUrl . '/en'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/sitemap',
                'changefreq' => 'monthly',
                'priority' => 0.3,
                'alternates' => [
                    'vi' => $this->baseUrl . '/sitemap',
                    'en' => $this->baseUrl . '/en/sitemap'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/events',
                'changefreq' => 'weekly',
                'priority' => 0.8,
                'alternates' => [
                    'vi' => $this->baseUrl . '/events',
                    'en' => $this->baseUrl . '/en/events'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/search',
                'changefreq' => 'never',
                'priority' => 0.1
            ],
            // Introduction pages
            [
                'loc' => $this->baseUrl . '/gioi-thieu/thu-ngo',
                'changefreq' => 'yearly',
                'priority' => 0.6,
                'alternates' => [
                    'vi' => $this->baseUrl . '/gioi-thieu/thu-ngo',
                    'en' => $this->baseUrl . '/en/introduction/welcome-letter'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/gioi-thieu/tong-quan-ve-da-nang',
                'changefreq' => 'yearly',
                'priority' => 0.6,
                'alternates' => [
                    'vi' => $this->baseUrl . '/gioi-thieu/tong-quan-ve-da-nang',
                    'en' => $this->baseUrl . '/en/introduction/danang-overview'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/tong-quan-ban-quan-ly/chuc-nang-nhiem-vu',
                'changefreq' => 'yearly',
                'priority' => 0.7,
                'alternates' => [
                    'vi' => $this->baseUrl . '/tong-quan-ban-quan-ly/chuc-nang-nhiem-vu',
                    'en' => $this->baseUrl . '/en/organization-overview/functions-duties'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/tong-quan-ban-quan-ly/cac-phong-ban',
                'changefreq' => 'yearly',
                'priority' => 0.6,
                'alternates' => [
                    'vi' => $this->baseUrl . '/tong-quan-ban-quan-ly/cac-phong-ban',
                    'en' => $this->baseUrl . '/en/organization-overview/departments'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/tong-quan-ban-quan-ly/don-vi-truc-thuoc',
                'changefreq' => 'yearly',
                'priority' => 0.6,
                'alternates' => [
                    'vi' => $this->baseUrl . '/tong-quan-ban-quan-ly/don-vi-truc-thuoc',
                    'en' => $this->baseUrl . '/en/organization-overview/affiliated-units'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/cam-nang-dau-tu',
                'changefreq' => 'monthly',
                'priority' => 0.9,
                'alternates' => [
                    'vi' => $this->baseUrl . '/cam-nang-dau-tu',
                    'en' => $this->baseUrl . '/en/investment-guide'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/cam-nang-dau-tu/chinh-sach-uu-dai',
                'changefreq' => 'monthly',
                'priority' => 0.9,
                'alternates' => [
                    'vi' => $this->baseUrl . '/cam-nang-dau-tu/chinh-sach-uu-dai',
                    'en' => $this->baseUrl . '/en/investment-guide/investment-policy'
                ]
            ],
            [
                'loc' => $this->baseUrl . '/cam-nang-dau-tu/brochure',
                'changefreq' => 'monthly',
                'priority' => 0.7,
                'alternates' => [
                    'vi' => $this->baseUrl . '/cam-nang-dau-tu/brochure',
                    'en' => $this->baseUrl . '/en/investment-guide/brochure'
                ]
            ]
        ];

        $this->urls = array_merge($this->urls, $staticRoutes);
    }

    private function addNewsUrls() {
        try {
            $newsModel = new News();
            $news = $newsModel->getAll(['status' => 'published'], 1000); // Get up to 1000 articles

            if ($news['success'] && !empty($news['data'])) {
                foreach ($news['data'] as $article) {
                    $this->urls[] = [
                        'loc' => $this->baseUrl . '/news/' . $article['slug'],
                        'lastmod' => $article['updated_at'] ?? $article['created_at'],
                        'changefreq' => 'monthly',
                        'priority' => 0.6,
                        'alternates' => [
                            'vi' => $this->baseUrl . '/news/' . $article['slug'],
                            'en' => $this->baseUrl . '/en/news/' . $article['slug']
                        ]
                    ];
                }
            }
        } catch (Exception $e) {
            error_log("Failed to fetch news for sitemap: " . $e->getMessage());
        }
    }

    private function addEventUrls() {
        try {
            $eventModel = new Event();
            $events = $eventModel->getAll(['status' => 'published'], 1000);

            if ($events['success'] && !empty($events['data'])) {
                foreach ($events['data'] as $event) {
                    $this->urls[] = [
                        'loc' => $this->baseUrl . '/events/' . $event['slug'],
                        'lastmod' => $event['updated_at'] ?? $event['created_at'],
                        'changefreq' => 'weekly',
                        'priority' => 0.7,
                        'alternates' => [
                            'vi' => $this->baseUrl . '/events/' . $event['slug'],
                            'en' => $this->baseUrl . '/en/events/' . $event['slug']
                        ]
                    ];
                }
            }
        } catch (Exception $e) {
            error_log("Failed to fetch events for sitemap: " . $e->getMessage());
        }
    }

    private function addCategoryUrls() {
        try {
            $categoryModel = new Category();
            $categories = $categoryModel->getAll();

            if ($categories['success'] && !empty($categories['data'])) {
                foreach ($categories['data'] as $category) {
                    $this->urls[] = [
                        'loc' => $this->baseUrl . '/news/category/' . $category['slug'],
                        'changefreq' => 'weekly',
                        'priority' => 0.7,
                        'alternates' => [
                            'vi' => $this->baseUrl . '/news/category/' . $category['slug'],
                            'en' => $this->baseUrl . '/en/news/category/' . $category['slug']
                        ]
                    ];
                }
            }
        } catch (Exception $e) {
            error_log("Failed to fetch categories for sitemap: " . $e->getMessage());
        }
    }

    private function removeDuplicates() {
        $uniqueUrls = [];
        $seen = [];

        foreach ($this->urls as $url) {
            $key = $url['loc'];
            if (!isset($seen[$key]) || (isset($seen[$key]) && $seen[$key]['priority'] < $url['priority'])) {
                $seen[$key] = $url;
                $uniqueUrls[$key] = $url;
            }
        }

        $this->urls = array_values($uniqueUrls);
    }

    private function sortUrls() {
        usort($this->urls, function($a, $b) {
            // Sort by priority (descending) first
            if ($a['priority'] != $b['priority']) {
                return ($b['priority'] ?? 0) <=> ($a['priority'] ?? 0);
            }
            // Then by URL alphabetically
            return strcmp($a['loc'], $b['loc']);
        });
    }

    private function buildXML() {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";

        foreach ($this->urls as $url) {
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>' . htmlspecialchars($url['loc'], ENT_XML1) . '</loc>' . "\n";
            
            if (isset($url['lastmod'])) {
                $lastmod = date('Y-m-d', strtotime($url['lastmod']));
                $xml .= '    <lastmod>' . $lastmod . '</lastmod>' . "\n";
            }
            
            if (isset($url['changefreq'])) {
                $xml .= '    <changefreq>' . htmlspecialchars($url['changefreq'], ENT_XML1) . '</changefreq>' . "\n";
            }
            
            if (isset($url['priority'])) {
                $xml .= '    <priority>' . number_format($url['priority'], 1) . '</priority>' . "\n";
            }

            // Add alternate language links
            if (isset($url['alternates']) && is_array($url['alternates'])) {
                foreach ($url['alternates'] as $lang => $altUrl) {
                    $xml .= '    <xhtml:link rel="alternate" hreflang="' . htmlspecialchars($lang, ENT_XML1) . '" href="' . htmlspecialchars($altUrl, ENT_XML1) . '" />' . "\n";
                }
            }

            $xml .= '  </url>' . "\n";
        }

        $xml .= '</urlset>' . "\n";
        return $xml;
    }

    public function getUrls() {
        $this->urls = [];
        $this->addStaticRoutes();
        $this->addNewsUrls();
        $this->addEventUrls();
        $this->addCategoryUrls();
        $this->removeDuplicates();
        $this->sortUrls();

        return [
            'success' => true,
            'data' => $this->urls,
            'total' => count($this->urls)
        ];
    }
} 