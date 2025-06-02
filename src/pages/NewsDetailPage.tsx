import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/utils/translations";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/translations";

// Service imports
import {
  fetchNewsArticleBySlug,
  fetchRelatedNews,
  fetchRecentNews,
  fetchNewsCategories
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

// Skeleton Components
import { NewsDetailPageSkeleton } from "@/components/skeletons/NewsDetailPageSkeleton";

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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Icons
import { Share2, Calendar, User, Clock, Tag, Mail, AlertCircle, ArrowLeft } from "lucide-react";

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
        />
      </AspectRatio>
      <div className="p-4">
        <p className={cn("text-xs mb-1", secondaryTextColor)}>{formattedDate}</p>
        <h3 className={cn(
          "font-montserrat font-semibold mb-2 line-clamp-2 transition-colors duration-300 text-sm",
          textColor,
          titleHoverColor
        )}>
          {displayTitle}
        </h3>
        <p className={cn("text-xs line-clamp-2", secondaryTextColor)}>
          {displayExcerpt}
        </p>
      </div>
    </a>
  );
};

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();

  // State management
  const [articleData, setArticleData] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
  const [recentNews, setRecentNews] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Theme-specific styles
  const bgColor = theme === "dark" ? "bg-dseza-dark-main-bg" : "bg-dseza-light-main-bg";
  const textColor = theme === "dark" ? "text-dseza-dark-main-text" : "text-dseza-light-main-text";
  const secondaryTextColor = theme === "dark" ? "text-dseza-dark-secondary-text" : "text-dseza-light-secondary-text";
  const cardBg = theme === "dark" ? "bg-dseza-dark-secondary-bg" : "bg-dseza-light-secondary-bg";
  const borderColor = theme === "dark" ? "border-dseza-dark-border" : "border-dseza-light-border";
  const accentColor = theme === "dark" ? "text-dseza-dark-primary-accent" : "text-dseza-light-primary-accent";
  const buttonColor = theme === "dark" ? "text-dseza-dark-primary-accent border-dseza-dark-primary-accent hover:bg-dseza-dark-primary-accent/10" : "text-dseza-light-primary-accent border-dseza-light-primary-accent hover:bg-dseza-light-primary-accent/10";

  // Fetch article data
  useEffect(() => {
    const loadArticleData = async () => {
      if (!slug) {
        setError("No article slug provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch main article
        const article = await fetchNewsArticleBySlug(slug);
        
        if (!article) {
          setError("Article not found");
          setIsLoading(false);
          return;
        }

        setArticleData(article);

        // Fetch related data
        const [related, recent, categoriesData] = await Promise.all([
          fetchRelatedNews(slug, article.category.id, 4),
          fetchRecentNews(slug, 5),
          fetchNewsCategories()
        ]);

        setRelatedNews(related);
        setRecentNews(recent);
        setCategories(categoriesData);

      } catch (err) {
        console.error('Error loading article:', err);
        setError("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    loadArticleData();
  }, [slug]);

  // Display content based on language
  const displayCategory = articleData && language === 'en' && articleData.category.nameEn 
    ? articleData.category.nameEn 
    : articleData?.category.name;
  
  const displayTitle = articleData && language === 'en' && articleData.titleEn 
    ? articleData.titleEn 
    : articleData?.title;
  
  const displayContent = articleData && language === 'en' && articleData.contentEn 
    ? articleData.contentEn 
    : articleData?.content;

  const displayReadingTime = articleData && language === 'en' && articleData.readingTimeEn 
    ? articleData.readingTimeEn 
    : articleData?.readingTime;

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
          <NewsDetailPageSkeleton isMobile={isMobile} />
        </main>

        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !articleData) {
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
                {error === "Article not found" 
                  ? (t("news.detail.notFound") || "Bài viết không tìm thấy")
                  : (t("news.detail.error") || "Có lỗi xảy ra")
                }
              </h1>
              <p className={cn("text-lg mb-8", secondaryTextColor)}>
                {error === "Article not found"
                  ? (t("news.detail.notFoundDesc") || "Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.")
                  : (t("news.detail.errorDesc") || "Không thể tải nội dung bài viết. Vui lòng thử lại sau.")
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

  // Format date
  const formattedDate = formatDate(new Date(articleData.publishDate));

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
                <BreadcrumbLink href={`/news/category/${articleData.category.slug}`} className={textColor}>
                  {displayCategory}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className={secondaryTextColor}>
                  {displayTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Article Content - 70% on desktop */}
            <article className="lg:w-[70%]">
              {/* Hero Image */}
              <AspectRatio ratio={16/9} className="mb-6 rounded-xl overflow-hidden">
                <img
                  src={articleData.imageUrl}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>

              {/* Article Meta */}
              <div className="mb-6">
                <Badge variant="secondary" className={cn("mb-4", accentColor)}>
                  {displayCategory}
                </Badge>

                <h1 className={cn("text-3xl md:text-4xl font-bold font-montserrat mb-4", textColor)}>
                  {displayTitle}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className={cn("flex items-center gap-2 text-sm", secondaryTextColor)}>
                    <User className="w-4 h-4" />
                    <span>{t("news.detail.author") || "DSEZA"}</span>
                  </div>
                  <div className={cn("flex items-center gap-2 text-sm", secondaryTextColor)}>
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  {displayReadingTime && (
                    <div className={cn("flex items-center gap-2 text-sm", secondaryTextColor)}>
                      <Clock className="w-4 h-4" />
                      <span>{displayReadingTime}</span>
                    </div>
                  )}
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm", secondaryTextColor)}>{t('news.detail.share')}:</span>
                  <Button variant="outline" size="sm" className={buttonColor}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className={buttonColor}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className={buttonColor}>
                    <Share2 className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>

              <Separator className={cn("mb-8", borderColor)} />

              {/* Article Content */}
              <div 
                className={cn(
                  "prose prose-lg max-w-none", 
                  textColor,
                  // Override prose colors for dark/light theme
                  theme === "dark" && "[&_*]:text-white [&_blockquote]:border-gray-600",
                  theme === "light" && "[&_*]:text-gray-900 [&_blockquote]:border-gray-300"
                )}
                dangerouslySetInnerHTML={{ __html: displayContent || '' }}
                style={{
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  '--tw-prose-headings': theme === "dark" ? "#FFFFFF" : "#000000",
                  '--tw-prose-p': theme === "dark" ? "#FFFFFF" : "#000000",
                  '--tw-prose-strong': theme === "dark" ? "#FFFFFF" : "#000000",
                  '--tw-prose-blockquote': theme === "dark" ? "#FFFFFF" : "#545454",
                  '--tw-prose-hr': theme === "dark" ? "#455A64" : "#DCDCDC",
                  '--tw-prose-li': theme === "dark" ? "#FFFFFF" : "#000000",
                } as React.CSSProperties & Record<string, string>}
              />
            </article>

            {/* Sidebar - 30% on desktop, hidden on mobile */}
            {!isMobile && (
              <aside className="lg:w-[30%] lg:sticky lg:top-4 lg:self-start">
                <div className="space-y-8">
                  {/* Recent News */}
                  {recentNews.length > 0 && (
                    <div className={cn("rounded-xl p-6", cardBg)}>
                      <h3 className={cn("text-lg font-semibold font-montserrat mb-4", textColor)}>
                        {t('news.detail.recentNews')}
                      </h3>
                      <div className="space-y-4">
                        {recentNews.map((news) => {
                          const displayNewsTitle = language === 'en' && news.titleEn ? news.titleEn : news.title;
                          return (
                            <a
                              key={news.id}
                              href={`/news/${news.slug}`}
                              className={cn("block text-sm hover:underline transition-colors", textColor, "hover:" + accentColor.split(' ')[0])}
                            >
                              {displayNewsTitle}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Category Tags */}
                  {categories.length > 0 && (
                    <div className={cn("rounded-xl p-6", cardBg)}>
                      <h3 className={cn("text-lg font-semibold font-montserrat mb-4", textColor)}>
                        {t('news.detail.categories')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                          const displayCategoryName = language === 'en' && category.nameEn ? category.nameEn : category.name;
                          return (
                            <a
                              key={category.id}
                              href={`/news/category/${category.slug}`}
                            >
                              <Badge variant="outline" className={cn("text-xs", buttonColor)}>
                                <Tag className="w-3 h-3 mr-1" />
                                {displayCategoryName}
                              </Badge>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Newsletter Signup */}
                  <div className={cn("rounded-xl p-6", cardBg)}>
                    <h3 className={cn("text-lg font-semibold font-montserrat mb-4", textColor)}>
                      {t('news.detail.newsletterSignup')}
                    </h3>
                    <p className={cn("text-sm mb-4", secondaryTextColor)}>
                      {t('news.detail.newsletterDescription')}
                    </p>
                    <div className="space-y-3">
                      <Input
                        type="email"
                        placeholder={t('news.detail.emailPlaceholder')}
                        className={cn("bg-transparent", borderColor)}
                      />
                      <Button className={cn("w-full", buttonColor)}>
                        <Mail className="w-4 h-4 mr-2" />
                        {t('news.detail.subscribe')}
                      </Button>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Related News Section */}
          {relatedNews.length > 0 && (
            <section className="mt-16">
              <h2 className={cn("text-2xl md:text-3xl font-bold font-montserrat mb-8", textColor)}>
                {t('news.detail.relatedNews')}
              </h2>
              <div className={cn(
                "grid gap-6",
                isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
              )}>
                {relatedNews.map((news) => (
                  <NewsCard key={news.id} article={news} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NewsDetailPage; 