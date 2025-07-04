import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MobileLayout from "./components/mobile/MobileLayout";

// Lazy load components for better performance
const ComingSoonPage = React.lazy(() => import("./pages/ComingSoonPage"));
const SearchResultsPage = React.lazy(() => import("./pages/SearchResultsPage"));
const SitemapPage = React.lazy(() => import("./pages/SitemapPage"));
const InvestmentGuidePage = React.lazy(() => import("./pages/InvestmentGuidePage"));
const InvestmentPolicyPage = React.lazy(() => import("./pages/InvestmentPolicyPage"));
const NewsDetailPage = React.lazy(() => import("./pages/NewsDetailPage"));
const EventsPage = React.lazy(() => import("./pages/EventsPage"));
const BrochurePage = React.lazy(() => import("./pages/BrochurePage"));
const CategoryNewsPage = React.lazy(() => import("./pages/CategoryNewsPage"));
const EventDetailPage = React.lazy(() => import("./pages/EventDetailPage"));

// Introduction pages - all using default exports
const WelcomeLetterPage = React.lazy(() => import("./pages/Introduction/WelcomeLetterPage"));
const DanangOverviewPage = React.lazy(() => import("./pages/Introduction/DanangOverviewPage"));
const FunctionsDutiesPage = React.lazy(() => import("./pages/Introduction/FunctionsDutiesPage"));
const DepartmentsPage = React.lazy(() => import("./pages/Introduction/DepartmentsPage"));
const AffiliatedUnitsPage = React.lazy(() => import("./pages/Introduction/AffiliatedUnitsPage"));

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
    </div>
  </div>
);

const App: React.FC = () => (
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Admin Routes - Temporarily redirect to coming soon */}
                  <Route path="/admin/*" element={<ComingSoonPage />} />
                  
                  {/* Public Routes - With Mobile Layout */}
                  <Route path="/*" element={
                    <MobileLayout>
                      <Routes>
                        {/* Homepage */}
                        <Route path="/" element={<Index />} />
                        
                        {/* Search and Sitemap */}
                        <Route path="/search" element={<SearchResultsPage />} />
                        <Route path="/sitemap" element={<SitemapPage />} />
                        
                        {/* News Routes */}
                        <Route path="/news" element={<Index />} />
                        <Route path="/news/category/:categorySlug" element={<CategoryNewsPage />} />
                        <Route path="/news/:slug" element={<NewsDetailPage />} />
                        
                        {/* Events Routes */}
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/events/:slug" element={<EventDetailPage />} />
                        
                        {/* Introduction Routes */}
                        <Route path="/gioi-thieu/thu-ngo" element={<WelcomeLetterPage />} />
                        <Route path="/gioi-thieu/tong-quan-ve-da-nang" element={<DanangOverviewPage />} />
                        <Route path="/tong-quan-ban-quan-ly/chuc-nang-nhiem-vu" element={<FunctionsDutiesPage />} />
                        <Route path="/tong-quan-ban-quan-ly/cac-phong-ban" element={<DepartmentsPage />} />
                        <Route path="/tong-quan-ban-quan-ly/don-vi-truc-thuoc" element={<AffiliatedUnitsPage />} />
                        
                        {/* Investment Routes */}
                        <Route path="/cam-nang-dau-tu" element={<InvestmentGuidePage />} />
                        <Route path="/cam-nang-dau-tu/chinh-sach-uu-dai" element={<InvestmentPolicyPage />} />
                        <Route path="/cam-nang-dau-tu/brochure" element={<BrochurePage />} />
                        
                        {/* Coming Soon for incomplete features */}
                        <Route path="/coming-soon" element={<ComingSoonPage />} />
                        
                        {/* Catch-all route for 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </MobileLayout>
                  } />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);

export default App;
