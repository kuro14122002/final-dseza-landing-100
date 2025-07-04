import React, { useState, useEffect, useCallback } from "react";
import PublicLayout from "@/layouts/PublicLayout";
import QuickAccessButtons from "@/components/QuickAccessButtons";
import FeaturedEvents from "@/components/FeaturedEvents";
import NewsSection from "@/components/NewsSection";
import FunctionalZones from "@/components/FunctionalZones";
import InvestmentInformation from "@/components/InvestmentInformation";
import LocationSection from "@/components/LocationSection";
import ResourcesSection from "@/components/ResourcesSection";
import BusinessesAndPartners from "@/components/BusinessesAndPartners";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileQuickLinksCarousel from "@/components/mobile/MobileQuickLinksCarousel";
import MobileFeaturedEvents from "@/components/mobile/MobileFeaturedEvents";
import MobileNewsSection from "@/components/mobile/MobileNewsSection";
import MobileFunctionalZonesCarousel from "@/components/mobile/MobileFunctionalZonesCarousel";
import MobileInvestmentInformation from "@/components/mobile/MobileInvestmentInformation";
import { NewsArticle, NewsCategory } from "@/types/news";

// Mock functions để thay thế newsService
const mockCategories: NewsCategory[] = [
  { 
    id: "all", 
    name: "Tất cả", 
    slug: "all", 
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "1", 
    name: "Tin tức", 
    slug: "tin-tuc", 
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "2", 
    name: "Thông báo", 
    slug: "thong-bao", 
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "3", 
    name: "Hoạt động", 
    slug: "hoat-dong", 
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockFeaturedArticle: NewsArticle = {
  id: "1",
  title: "Đà Nẵng tăng cường thu hút đầu tư vào các khu công nghiệp",
  content: "Thành phố Đà Nẵng đang tập trung thu hút đầu tư vào các khu công nghiệp để phát triển kinh tế địa phương.",
  excerpt: "Đà Nẵng tăng cường các chính sách ưu đãi để thu hút đầu tư vào khu công nghiệp.",
  slug: "da-nang-tang-cuong-thu-hut-dau-tu",
  category: mockCategories[1],
  publishDate: new Date().toISOString(),
  author: "Ban Biên Tập",
  tags: "đầu tư, khu công nghiệp, Đà Nẵng",
  status: "published",
  isFeatured: true,
  imageUrl: "/media/khucongngiecao.jpg",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  readingTime: "3 phút",
};

const mockRegularNews: NewsArticle[] = [
  {
    id: "2",
    title: "Khai trương khu công nghệ cao mới tại Đà Nẵng",
    content: "Khu công nghệ cao mới với nhiều tiện ích hiện đại đã chính thức khai trương.",
    excerpt: "Khu công nghệ cao mới mang đến nhiều cơ hội việc làm và đầu tư.",
    slug: "khai-truong-khu-cong-nghe-cao-moi",
    category: mockCategories[1],
    publishDate: new Date().toISOString(),
    author: "Ban Biên Tập",
    tags: "công nghệ cao, khai trương",
    status: "published",
    isFeatured: false,
    imageUrl: "/media/khucongnghecao.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTime: "2 phút",
  },
  {
    id: "3",
    title: "Hội thảo đầu tư và phát triển bền vững",
    content: "Hội thảo về các chiến lược đầu tư và phát triển bền vững trong khu vực.",
    excerpt: "Các chuyên gia chia sẻ kinh nghiệm về đầu tư bền vững.",
    slug: "hoi-thao-dau-tu-phat-trien-ben-vung",
    category: mockCategories[3],
    publishDate: new Date().toISOString(),
    author: "Ban Biên Tập",
    tags: "hội thảo, đầu tư, bền vững",
    status: "published",
    isFeatured: false,
    imageUrl: "/media/khucongnghiep.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTime: "4 phút",
  },
];

const fetchNewsCategories = async (): Promise<NewsCategory[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCategories;
};

const fetchFeaturedArticle = async (): Promise<NewsArticle | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFeaturedArticle;
};

const fetchRegularNews = async (categoryId?: string, limit?: number): Promise<NewsArticle[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockRegularNews.slice(0, limit || 10);
};

const fetchNewsArticles = async (categoryId?: string, page?: number, limit?: number) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    articles: mockRegularNews.slice(0, limit || 10),
    totalArticles: mockRegularNews.length,
    totalPages: 1,
    currentPage: page || 1,
  };
};

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  
  // News state management
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [regularNews, setRegularNews] = useState<NewsArticle[]>([]);
  const [mobileNewsArticles, setMobileNewsArticles] = useState<NewsArticle[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load categories first
      console.log('Loading categories...');
      const categoriesData = await fetchNewsCategories();
      setCategories(categoriesData);
      console.log('Categories loaded:', categoriesData);
      
      // Load initial news data for the default category
      console.log('Loading news data...');
      const [featured, regular, mobileArticlesResponse] = await Promise.all([
        fetchFeaturedArticle().catch(err => {
          console.warn('Failed to load featured article:', err);
          return null;
        }),
        fetchRegularNews(activeCategoryId === "all" ? undefined : activeCategoryId, 3).catch(err => {
          console.warn('Failed to load regular news:', err);
          return [];
        }),
        fetchNewsArticles(activeCategoryId === "all" ? undefined : activeCategoryId, 1, 4).catch(err => {
          console.warn('Failed to load mobile articles:', err);
          return { articles: [], totalArticles: 0, totalPages: 0, currentPage: 1 };
        })
      ]);
      
      setFeaturedArticle(featured);
      setRegularNews(regular);
      setMobileNewsArticles(mobileArticlesResponse.articles);
      
      console.log('News data loaded successfully');
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategoryId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle category change
  const handleCategoryChange = useCallback(async (categoryId: string) => {
    if (categoryId === activeCategoryId) return;
    
    setActiveCategoryId(categoryId);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading news for category: ${categoryId}`);
      
      if (isMobile) {
        // For mobile, load all articles for the category
        const articlesResponse = await fetchNewsArticles(
          categoryId === "all" ? undefined : categoryId, 
          1, 
          4
        );
        setMobileNewsArticles(articlesResponse.articles);
      } else {
        // For desktop, load featured and regular articles separately
        const [featured, regular] = await Promise.all([
          fetchFeaturedArticle().catch(err => {
            console.warn('Failed to load featured article:', err);
            return null;
          }),
          fetchRegularNews(categoryId === "all" ? undefined : categoryId, 3).catch(err => {
            console.warn('Failed to load regular news:', err);
            return [];
          })
        ]);
        
        setFeaturedArticle(featured);
        setRegularNews(regular);
      }
      
      console.log(`News loaded successfully for category: ${categoryId}`);
    } catch (error) {
      console.error('Error loading news for category:', categoryId, error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải tin tức. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategoryId, isMobile]);

  // Retry function for error recovery
  const handleRetry = useCallback(() => {
    console.log('Retrying to load news data...');
    loadInitialData();
  }, [loadInitialData]);
  
  return (
    <PublicLayout 
      showHeroBackground={true}
      seoProps={{
        title: "DSEZA - Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng",
        description: "Trang chủ chính thức của Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng",
        keywords: "DSEZA, khu công nghệ cao, khu công nghiệp, Đà Nẵng, đầu tư, phát triển kinh tế",
      }}
    >
      {/* Content Sections */}
      <div className="bg-background">
        {/* Quick Access Buttons - show desktop or mobile version based on viewport */}
        {isMobile ? <MobileQuickLinksCarousel /> : <QuickAccessButtons />}
        
        {/* Featured Events Section - show desktop or mobile version based on viewport */}
        {isMobile ? <MobileFeaturedEvents /> : <FeaturedEvents />}
        
        {/* News Section - show desktop or mobile version based on viewport */}
        {isMobile ? (
          <MobileNewsSection 
            newsArticles={mobileNewsArticles}
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryChange={handleCategoryChange}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        ) : (
          <NewsSection 
            featuredArticle={featuredArticle}
            regularNews={regularNews}
            categories={categories}
            activeCategoryId={activeCategoryId}
            onCategoryChange={handleCategoryChange}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        )}
        
        {/* Functional Zones Section - show desktop or mobile version based on viewport */}
        {isMobile ? <MobileFunctionalZonesCarousel /> : <FunctionalZones />}
        
        {/* Investment Information Section - show desktop or mobile version based on viewport */}
        {isMobile ? <MobileInvestmentInformation /> : <InvestmentInformation />}
        
        {/* Location Map Section */}
        <LocationSection />
        
        {/* Resources Section */}
        <ResourcesSection />
        
        {/* Businesses and Partners Section */}
        <BusinessesAndPartners />
      </div>
    </PublicLayout>
  );
};

export default Index;