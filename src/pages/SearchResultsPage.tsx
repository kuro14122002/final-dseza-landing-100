import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, Calendar, Clock, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/utils/translations";
import { cn } from "@/lib/utils";
import { performSearch, SearchResult, SearchResponse } from "@/services/searchService";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="min-h-screen bg-dseza-light-bg dark:bg-dseza-dark-bg">
      {/* Header */}
      <div className={cn("border-b", borderColor)}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className={cn("text-2xl font-bold", textColor)}>
              {t('search.title')}
            </h1>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className={cn("flex items-center gap-2", secondaryTextColor)}
            >
              <ChevronLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar
              onSearch={handleNewSearch}
              placeholder={t('search.searchPlaceholder')}
              autoFocus={!query}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className={cn(cardBg, borderColor)}>
              <CardHeader>
                <CardTitle className={cn("flex items-center gap-2 text-lg", textColor)}>
                  <Filter className="h-5 w-5" />
                  {t('search.filters')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { key: 'all', label: t('search.allTypes') },
                    { key: 'news', label: t('search.news') },
                    { key: 'documents', label: t('search.documents') },
                  ].map((filterOption) => (
                    <button
                      key={filterOption.key}
                      onClick={() => handleFilterChange(filterOption.key as any)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md transition-colors",
                        selectedType === filterOption.key
                          ? theme === "dark" 
                            ? "bg-dseza-dark-primary-accent text-white" 
                            : "bg-dseza-light-primary-accent text-white"
                          : cn(textColor, hoverColor)
                      )}
                    >
                      {filterOption.label}
                      {searchResults && selectedType === filterOption.key && (
                        <Badge variant="secondary" className="ml-2">
                          {searchResults.totalResults}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {query && (
              <div className="mb-6">
                <h2 className={cn("text-xl font-semibold mb-2", textColor)}>
                  {t('search.resultsFor')} "{query}"
                </h2>
                {searchResults && !isLoading && (
                  <p className={secondaryTextColor}>
                    {t('search.foundResults', { 
                      count: searchResults.totalResults,
                      time: '0.12' // Mock search time
                    })}
                  </p>
                )}
              </div>
            )}

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
                    {t('search.errorTitle')}
                  </h3>
                  <p className={cn("mb-4", secondaryTextColor)}>
                    {error}
                  </p>
                  <Button
                    onClick={() => performSearchQuery(query, selectedType, page)}
                    className="bg-dseza-light-primary-accent hover:bg-dseza-light-primary-accent/90"
                  >
                    {t('search.tryAgain')}
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
                    {t('search.noResultsTitle')}
                  </h3>
                  <p className={cn("mb-4", secondaryTextColor)}>
                    {t('search.noResultsMessage')}
                  </p>
                  <div className={cn("text-sm", secondaryTextColor)}>
                    <p>{t('search.suggestions')}:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>{t('search.suggestion1')}</li>
                      <li>{t('search.suggestion2')}</li>
                      <li>{t('search.suggestion3')}</li>
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
                                {result.type === 'news' ? t('search.news') : t('search.document')}
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
                      {t('pagination.previous')}
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
                      {t('pagination.next')}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage; 