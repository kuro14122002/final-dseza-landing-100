import React, { useState, useEffect, useCallback } from "react";
import HeroSection from "@/components/hero/HeroSection";
import QuickAccessButtons from "@/components/QuickAccessButtons";
import FeaturedEvents from "@/components/FeaturedEvents";
import NewsSection from "@/components/NewsSection";
import FunctionalZones from "@/components/FunctionalZones";
import InvestmentInformation from "@/components/InvestmentInformation";
import LocationSection from "@/components/LocationSection";
import ResourcesSection from "@/components/ResourcesSection";
import BusinessesAndPartners from "@/components/BusinessesAndPartners";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEO/SEOHead";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileQuickLinksCarousel from "@/components/mobile/MobileQuickLinksCarousel";
import MobileFeaturedEvents from "@/components/mobile/MobileFeaturedEvents";
import MobileNewsSection from "@/components/mobile/MobileNewsSection";
import MobileFunctionalZonesCarousel from "@/components/mobile/MobileFunctionalZonesCarousel";
import MobileInvestmentInformation from "@/components/mobile/MobileInvestmentInformation";
import { NewsArticle, NewsCategory } from "@/types/news";
import { 
  fetchNewsCategories, 
  fetchFeaturedArticle, 
  fetchRegularNews, 
  fetchNewsArticles 
} from "@/services/newsService";

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
    <main className="min-h-screen">
      {/* SEO Head for homepage */}
      <SEOHead
        type="website"
        organizationName="DSEZA - Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng"
        organizationUrl="https://dseza.danang.gov.vn"
        organizationLogo="https://dseza.danang.gov.vn/media/lightlogo3.png"
        organizationAddress="Đà Nẵng, Việt Nam"
        organizationPhone="0236.3847.707"
        organizationEmail="info@dseza.danang.gov.vn"
      />
      {/* Hero Section */}
      <HeroSection />
      
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
      
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Index;