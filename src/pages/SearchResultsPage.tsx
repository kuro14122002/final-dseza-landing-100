import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, Calendar, Clock, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/utils/translations";
import { cn } from "@/lib/utils";
import PublicLayout from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// Mock types and functions để thay thế searchService
interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  type: string;
  publishedAt?: string;
  imageUrl?: string;
  category?: {
    name: string;
  };
  publishDate?: string;
}

interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Khu công nghệ cao Đà Nẵng",
    excerpt: "Thông tin về khu công nghệ cao hiện đại tại Đà Nẵng với nhiều tiện ích và cơ hội đầu tư.",
    url: "/news/khu-cong-nghe-cao-da-nang",
    type: "news",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Chính sách đầu tư mới",
    excerpt: "Các chính sách ưu đãi đầu tư mới nhất cho doanh nghiệp trong khu công nghiệp.",
    url: "/news/chinh-sach-dau-tu-moi",
    type: "news",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Hướng dẫn đầu tư",
    excerpt: "Tài liệu hướng dẫn đầu tư chi tiết cho các doanh nghiệp muốn đầu tư vào Đà Nẵng.",
    url: "/cam-nang-dau-tu",
    type: "documents",
    publishedAt: new Date().toISOString(),
  },
];

const performSearch = async (query: string, type: string, page: number, limit: number): Promise<SearchResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredResults = mockSearchResults;
  
  if (query) {
    filteredResults = mockSearchResults.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  if (type !== 'all') {
    filteredResults = filteredResults.filter(item => item.type === type);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = filteredResults.slice(startIndex, endIndex);
  
  return {
    results: paginatedResults,
    totalResults: filteredResults.length,
    totalPages: Math.ceil(filteredResults.length / limit),
    currentPage: page,
  };
};

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'news' | 'documents'>('all');

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const type = (searchParams.get('type') as 'all' | 'news' | 'documents') || 'all';

  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const borderColor = theme === "dark" ? "border-dseza-dark-border" : "border-gray-200";
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-white";
  const hoverColor = theme === "dark" ? "hover:bg-dseza-dark-hover" : "hover:bg-gray-50";

  // Perform search when query or filters change
  useEffect(() => {
    if (query.trim()) {
      performSearchQuery(query, type, page);
    }
  }, [query, type, page]);

  // Update selected type from URL
  useEffect(() => {
    setSelectedType(type);
  }, [type]);

  const performSearchQuery = async (searchQuery: string, searchType: 'all' | 'news' | 'documents', searchPage: number) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await performSearch(searchQuery, searchType, searchPage, 10);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to perform search');
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new search from search bar
  const handleNewSearch = (newQuery: string) => {
    setSearchParams({
      q: newQuery,
      type: selectedType,
      page: '1',
    });
  };

  // Handle filter change
  const handleFilterChange = (newType: 'all' | 'news' | 'documents') => {
    setSelectedType(newType);
    setSearchParams({
      q: query,
      type: newType,
      page: '1',
    });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setSearchParams({
      q: query,
      type: selectedType,
      page: newPage.toString(),
    });
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <PublicLayout 
      showHeroBackground={false}
      seoProps={{
        title: `Kết quả tìm kiếm: ${query} - DSEZA`,
        description: `Tìm kiếm "${query}" trên website DSEZA - Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng`,
        keywords: `tìm kiếm, ${query}, DSEZA, khu công nghệ cao, khu công nghiệp, Đà Nẵng`,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium">Kết quả tìm kiếm</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={cn("text-2xl font-bold", textColor)}>
            Kết quả tìm kiếm
          </h1>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className={cn("flex items-center gap-2", secondaryTextColor)}
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm tin tức, tài liệu..."
              defaultValue={query}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  handleNewSearch(target.value);
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('all')}
            size="sm"
          >
            Tất cả
          </Button>
          <Button
            variant={selectedType === 'news' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('news')}
            size="sm"
          >
            Tin tức
          </Button>
          <Button
            variant={selectedType === 'documents' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('documents')}
            size="sm"
          >
            Tài liệu
          </Button>
        </div>

        {/* Results Summary */}
        {query && (
          <div className={cn("mb-6", secondaryTextColor)}>
            {searchResults ? (
              <span>Tìm thấy {searchResults.totalResults} kết quả cho "{query}"</span>
            ) : isLoading ? (
              <span>Đang tìm kiếm...</span>
            ) : (
              <span>Tìm kiếm "{query}"</span>
            )}
          </div>
        )}

        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <Card key={index} className={cn(cardBg, borderColor)}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-20 h-20 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-2 mt-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Card className={cn(cardBg, borderColor)}>
              <CardContent className="p-8 text-center">
                <Search className={cn("h-12 w-12 mx-auto mb-4", secondaryTextColor)} />
                <h3 className={cn("text-lg font-medium mb-2", textColor)}>
                  Có lỗi xảy ra
                </h3>
                <p className={cn("mb-4", secondaryTextColor)}>
                  {error}
                </p>
                <Button
                  onClick={() => performSearchQuery(query, selectedType, page)}
                  className="bg-dseza-light-primary-accent hover:bg-dseza-light-primary-accent/90"
                >
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {searchResults && searchResults.results.length === 0 && !isLoading && !error && (
            <Card className={cn(cardBg, borderColor)}>
              <CardContent className="p-8 text-center">
                <Search className={cn("h-12 w-12 mx-auto mb-4", secondaryTextColor)} />
                <h3 className={cn("text-lg font-medium mb-2", textColor)}>
                  Không tìm thấy kết quả
                </h3>
                <p className={cn("mb-4", secondaryTextColor)}>
                  Không có kết quả nào khớp với từ khóa "{query}"
                </p>
                <div className={cn("text-sm", secondaryTextColor)}>
                  <p>Gợi ý:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Kiểm tra lại chính tả</li>
                    <li>Thử sử dụng từ khóa khác</li>
                    <li>Bỏ bớt bộ lọc</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results List */}
          {searchResults && searchResults.results.length > 0 && !isLoading && (
            <>
              <div className="space-y-4 mb-8">
                {searchResults.results.map((result) => (
                  <Card
                    key={`${result.type}-${result.id}`}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      cardBg,
                      borderColor,
                      hoverColor,
                      "hover:shadow-md"
                    )}
                    onClick={() => handleResultClick(result)}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {result.imageUrl && (
                          <img
                            src={result.imageUrl}
                            alt={result.title}
                            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={cn("font-semibold text-lg line-clamp-2", textColor)}>
                              {result.title}
                            </h3>
                            <ExternalLink className={cn("h-4 w-4 flex-shrink-0 ml-2", secondaryTextColor)} />
                          </div>
                          
                          {result.excerpt && (
                            <div 
                              className={cn("text-sm mb-3 line-clamp-3", secondaryTextColor)}
                              dangerouslySetInnerHTML={{ __html: result.excerpt }}
                            />
                          )}

                          <div className="flex items-center gap-4 text-xs">
                            <Badge 
                              variant={result.type === 'news' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {result.type === 'news' ? 'Tin tức' : 'Tài liệu'}
                            </Badge>

                            {result.category && (
                              <span className={cn("flex items-center gap-1", secondaryTextColor)}>
                                {result.category.name}
                              </span>
                            )}

                            {result.publishDate && (
                              <span className={cn("flex items-center gap-1", secondaryTextColor)}>
                                <Calendar className="h-3 w-3" />
                                {formatDate(result.publishDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {searchResults.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className={cn("flex items-center gap-2", textColor)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>

                  <div className="flex items-center gap-2">
                    {[...Array(searchResults.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === searchResults.totalPages ||
                        Math.abs(pageNum - page) <= 2
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={pageNum === page ? "bg-dseza-light-primary-accent" : ""}
                          >
                            {pageNum}
                          </Button>
                        );
                      } else if (
                        pageNum === page - 3 ||
                        pageNum === page + 3
                      ) {
                        return <span key={pageNum} className={secondaryTextColor}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    disabled={page >= searchResults.totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className={cn("flex items-center gap-2", textColor)}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default SearchResultsPage; 