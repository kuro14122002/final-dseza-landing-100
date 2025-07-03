import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/translations";

// Service imports
import {
  fetchCategoryInfoBySlug,
  fetchArticlesByCategorySlug,
  PaginatedNewsResponse
} from "@/services/newsService";
import { NewsArticle, NewsCategory } from "@/types/news";

// Desktop Header Components
import TopBar from "@/components/hero/TopBar";
import LogoSearchBar from "@/components/hero/LogoSearchBar";
import NavigationBar from "@/components/hero/NavigationBar";

// Mobile Header Component
import MobileHeader from "@/components/mobile/MobileHeader";

// Footer Component
import Footer from "@/components/Footer";

// UI Components
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Icons
import { AlertCircle, ArrowLeft, FileText } from "lucide-react";

// Constants
const ITEMS_PER_PAGE = 9;

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const titleHoverColor = theme === "dark" ? "hover:text-dseza-dark-primary-accent" : "hover:text-dseza-light-primary-accent";

  const displayTitle = language === 'en' && article.titleEn ? article.titleEn : article.title;
  const displayExcerpt = language === 'en' && article.excerptEn ? article.excerptEn : article.excerpt;
  const displayReadingTime = language === 'en' && article.readingTimeEn ? article.readingTimeEn : article.readingTime;

  // Format date
  const formattedDate = formatDate(new Date(article.publishDate));

  return (
    <a
      href={`/news/${article.slug}`}
      className={cn(
        "group block rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 h-full",
        cardBg,
        theme === "dark" ? "hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)]" : "hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
      )}
    >
      <AspectRatio ratio={16/9} className="overflow-hidden">
        <img
          src={article.imageUrl}
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
      </AspectRatio>
      <div className="p-4 lg:p-6">
        <p className={cn("text-xs mb-2", secondaryTextColor)}>{formattedDate}</p>
        <h3 className={cn(
          "font-montserrat font-semibold mb-3 line-clamp-2 transition-colors duration-300 text-sm lg:text-base",
          textColor,
          titleHoverColor
        )}>
          {displayTitle}
        </h3>
        <p className={cn("text-xs lg:text-sm line-clamp-3 mb-3", secondaryTextColor)}>
          {displayExcerpt}
        </p>
        {displayReadingTime && (
          <div className={cn("flex items-center gap-1 text-xs", secondaryTextColor)}>
            <FileText className="w-3 h-3" />
            <span>{displayReadingTime}</span>
          </div>
        )}
      </div>
    </a>
  );
};

// Loading skeleton for category page
const CategoryPageSkeleton: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <span>/</span>
        <Skeleton className="h-4 w-20" />
        <span>/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Title Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Articles Grid Skeleton */}
      <div className={cn(
        "grid gap-6 mb-8",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
          <div key={index} className="rounded-xl overflow-hidden">
            <AspectRatio ratio={16/9}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
            <div className="p-4 lg:p-6">
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-5 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
};

const CategoryNewsPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();

  // Get page from URL params, default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // State management
  const [categoryInfo, setCategoryInfo] = useState<NewsCategory | null>(null);
  const [paginatedResponse, setPaginatedResponse] = useState<PaginatedNewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Theme-specific styles
  const bgColor = theme === "dark" ? "bg-dseza-dark-main-bg" : "bg-dseza-light-main-bg";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const buttonColor = theme === "dark" ? "text-dseza-dark-primary-accent border-dseza-dark-primary-accent hover:bg-dseza-dark-primary-accent/10" : "text-dseza-light-primary-accent border-dseza-light-primary-accent hover:bg-dseza-light-primary-accent/10";

  // Fetch data when component mounts or params change
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categorySlug) {
        setError("No category slug provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log(`Loading category data for slug: ${categorySlug}, page: ${currentPage}`);
        // Fetch category info first
        const category = await fetchCategoryInfoBySlug(categorySlug);
        
        if (!category) {
          setError("Category not found");
          setIsLoading(false);
          return;
        }

        setCategoryInfo(category);
        console.log('Category loaded successfully:', category.name);

        // Fetch articles for this category
        const response = await fetchArticlesByCategorySlug(categorySlug, currentPage, ITEMS_PER_PAGE);
        setPaginatedResponse(response);
        console.log(`Loaded ${response.articles.length} articles for page ${currentPage}`);

      } catch (err) {
        console.error('Error loading category data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load category data';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [categorySlug, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || (paginatedResponse && page > paginatedResponse.totalPages)) return;
    
    // Update URL with new page
    const newSearchParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', page.toString());
    }
    setSearchParams(newSearchParams);
  };

  // Display content based on language
  const displayCategoryName = categoryInfo && language === 'en' && categoryInfo.nameEn 
    ? categoryInfo.nameEn 
    : categoryInfo?.name;

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("min-h-screen", bgColor)}>
        {/* Header */}
        {isMobile ? (
          <MobileHeader />
        ) : (
          <div className="relative">
            <TopBar />
            <LogoSearchBar />
            <NavigationBar />
          </div>
        )}

        {/* Loading Content */}
        <main className="pt-24 md:pt-44">
          <CategoryPageSkeleton isMobile={isMobile} />
        </main>

        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !categoryInfo) {
    return (
      <div className={cn("min-h-screen", bgColor)}>
        {/* Header */}
        {isMobile ? (
          <MobileHeader />
        ) : (
          <div className="relative">
            <TopBar />
            <LogoSearchBar />
            <NavigationBar />
          </div>
        )}

        {/* Error Content */}
        <main className="pt-24 md:pt-44">
          <div className="container mx-auto px-4 md:px-8 py-8">
            <div className="text-center py-16">
              <AlertCircle className={cn("w-16 h-16 mx-auto mb-4", secondaryTextColor)} />
              <h1 className={cn("text-2xl md:text-3xl font-bold font-montserrat mb-4", textColor)}>
                {error === "Category not found" 
                  ? (t("news.categoryNotFound") || "Danh mục không tồn tại")
                  : (t("news.categoryError") || "Có lỗi xảy ra")
                }
              </h1>
              <p className={cn("text-lg mb-8", secondaryTextColor)}>
                {error === "Category not found"
                  ? (t("news.categoryNotFoundDesc") || "Danh mục bạn đang tìm kiếm không tồn tại.")
                  : (t("news.categoryErrorDesc") || "Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.")
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline" 
                  className={buttonColor}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("common.goBack") || "Quay lại"}
                </Button>
                <Button 
                  onClick={() => navigate('/news')}
                  className={buttonColor}
                >
                  {t("nav.news") || "Trang tin tức"}
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // No articles state
  const hasNoArticles = paginatedResponse && paginatedResponse.articles.length === 0;

  return (
    <div className={cn("min-h-screen", bgColor)}>
      {/* Header */}
      {isMobile ? (
        <MobileHeader />
      ) : (
        <div className="relative">
          <TopBar />
          <LogoSearchBar />
          <NavigationBar />
        </div>
      )}

      {/* Content */}
      <main className="pt-24 md:pt-44">
        <div className="container mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className={textColor}>
                  {t('home')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/news" className={textColor}>
                  {t('nav.news')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className={secondaryTextColor}>
                  {displayCategoryName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat mb-4", textColor)}>
              {displayCategoryName}
            </h1>
            {paginatedResponse && (
              <p className={cn("text-lg", secondaryTextColor)}>
                {t("news.categoryTotalArticles") || `Tổng cộng ${paginatedResponse.totalArticles} bài viết`}
              </p>
            )}
          </div>

          {/* No Articles State */}
          {hasNoArticles ? (
            <div className="text-center py-16">
              <FileText className={cn("w-16 h-16 mx-auto mb-4", secondaryTextColor)} />
              <h2 className={cn("text-xl md:text-2xl font-semibold font-montserrat mb-4", textColor)}>
                {t("news.noArticlesInCategory") || "Chưa có bài viết nào"}
              </h2>
              <p className={cn("text-lg mb-8", secondaryTextColor)}>
                {t("news.noArticlesInCategoryDesc") || "Danh mục này chưa có bài viết nào. Vui lòng quay lại sau để xem thêm nội dung mới."}
              </p>
              <Button 
                onClick={() => navigate('/news')}
                className={buttonColor}
              >
                {t("nav.news") || "Xem tất cả tin tức"}
              </Button>
            </div>
          ) : (
            <>
              {/* Articles Grid */}
              {paginatedResponse && paginatedResponse.articles.length > 0 && (
                <>
                  <div className={cn(
                    "grid gap-6 mb-8",
                    isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  )}>
                    {paginatedResponse.articles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {paginatedResponse.totalPages > 1 && (
                    <div className="flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(currentPage - 1)}
                              className={cn(
                                currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer",
                                buttonColor
                              )}
                            />
                          </PaginationItem>
                          
                          {/* Page numbers */}
                          {Array.from({ length: paginatedResponse.totalPages }, (_, i) => i + 1)
                            .filter(page => {
                              // Show first page, last page, current page, and pages around current
                              const showPage = page === 1 || 
                                              page === paginatedResponse.totalPages || 
                                              Math.abs(page - currentPage) <= 1;
                              return showPage;
                            })
                            .map((page, index, array) => {
                              // Add ellipsis if there's a gap
                              const prevPage = array[index - 1];
                              const showEllipsis = prevPage && page - prevPage > 1;
                              
                              return (
                                <React.Fragment key={page}>
                                  {showEllipsis && (
                                    <PaginationItem>
                                      <span className={cn("px-3 py-2", secondaryTextColor)}>...</span>
                                    </PaginationItem>
                                  )}
                                  <PaginationItem>
                                    <PaginationLink
                                      onClick={() => handlePageChange(page)}
                                      isActive={page === currentPage}
                                      className={cn(
                                        "cursor-pointer",
                                        page === currentPage 
                                          ? theme === "dark" ? "bg-dseza-dark-primary-accent" : "bg-dseza-light-primary-accent"
                                          : buttonColor
                                      )}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                </React.Fragment>
                              );
                            })}

                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(currentPage + 1)}
                              className={cn(
                                currentPage >= paginatedResponse.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer",
                                buttonColor
                              )}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CategoryNewsPage; 