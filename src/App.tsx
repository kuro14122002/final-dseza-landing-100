import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import MobileLayout from "./components/mobile/MobileLayout";
import PerformanceMonitor from "./components/dev/PerformanceMonitor";

// Lazy load components for better performance
const SitemapPage = React.lazy(() => import("./pages/SitemapPage"));
const NewsDetailPage = React.lazy(() => import("./pages/NewsDetailPage"));
const CategoryNewsPage = React.lazy(() => import("./pages/CategoryNewsPage"));
const LoginPage = React.lazy(() => import("./pages/admin/LoginPage"));
const DashboardPage = React.lazy(() => import("./pages/admin/DashboardPage"));
const AdminNewsListPage = React.lazy(() => import("./pages/admin/AdminNewsListPage"));
const AdminNewsFormPage = React.lazy(() => import("./pages/admin/AdminNewsFormPage"));
const AdminDocumentListPage = React.lazy(() => import("./pages/admin/AdminDocumentListPage"));
const AdminDocumentFormPage = React.lazy(() => import("./pages/admin/AdminDocumentFormPage"));
const AdminEventsPage = React.lazy(() => import("./pages/admin/AdminEventsPage"));
const AdminEventFormPage = React.lazy(() => import("./pages/admin/AdminEventFormPage"));
const EventsPage = React.lazy(() => import("./pages/EventsPage"));
const EventDetailPage = React.lazy(() => import("./pages/EventDetailPage"));
const WelcomeLetterPage = React.lazy(() => import("./pages/Introduction/WelcomeLetterPage"));
const DanangOverviewPage = React.lazy(() => import("./pages/Introduction/DanangOverviewPage"));
const FunctionsDutiesPage = React.lazy(() => import("./pages/Introduction/FunctionsDutiesPage").then(module => ({ default: module.FunctionsDutiesPage })));
const DepartmentsPage = React.lazy(() => import("./pages/Introduction/DepartmentsPage").then(module => ({ default: module.DepartmentsPage })));
const AffiliatedUnitsPage = React.lazy(() => import("./pages/Introduction/AffiliatedUnitsPage").then(module => ({ default: module.AffiliatedUnitsPage })));
const InvestmentGuidePage = React.lazy(() => import("./pages/InvestmentGuidePage"));
const InvestmentPolicyPage = React.lazy(() => import("./pages/InvestmentPolicyPage"));
const BrochurePage = React.lazy(() => import("./pages/BrochurePage"));
const ComingSoonPage = React.lazy(() => import("./pages/ComingSoonPage"));
const SearchResultsPage = React.lazy(() => import("./pages/SearchResultsPage"));
const AdminTranslationsPage = React.lazy(() => import("./pages/admin/AdminTranslationsPage"));
const AdminCategoriesPage = React.lazy(() => import("./pages/admin/AdminCategoriesPage"));
const AdminMediaLibraryPage = React.lazy(() => import("./pages/admin/AdminMediaLibraryPage"));
const AdminWebsiteManagerPage = React.lazy(() => import("./pages/admin/AdminWebsiteManagerPage"));
const AdminRolesPage = React.lazy(() => import("./pages/admin/AdminRolesPage"));
const UserManagementPage = React.lazy(() => import("./views/apps/user/index"));
const MyAccountPage = React.lazy(() => import("./pages/admin/MyAccountPage"));

// Loading component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
    </div>
  </div>
);

// Create a client with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const App: React.FC = () => (
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Admin Routes - Login Page without Layout */}
                    <Route path="/admin/login" element={<LoginPage />} />
                    
                    {/* Admin Routes - With AdminLayout */}
                    <Route path="/admin/*" element={<AdminLayout />}>
                      <Route path="dashboard" element={<DashboardPage />} />
                      
                      {/* Quản trị Nội dung */}
                      <Route path="news" element={<AdminNewsListPage />} />
                      <Route path="news/create" element={<AdminNewsFormPage />} />
                      <Route path="news/edit/:articleId" element={<AdminNewsFormPage />} />
                      <Route path="categories" element={<AdminCategoriesPage />} />
                      <Route path="documents" element={<AdminDocumentListPage />} />
                      <Route path="documents/new" element={<AdminDocumentFormPage />} />
                      <Route path="documents/edit/:documentId" element={<AdminDocumentFormPage />} />
                      <Route path="media" element={<AdminMediaLibraryPage />} />
                      <Route path="events" element={<AdminEventsPage />} />
                      <Route path="events/new" element={<AdminEventFormPage />} />
                      <Route path="events/:id/edit" element={<AdminEventFormPage />} />
                      <Route path="links" element={<ComingSoonPage />} />
                      
                      {/* Quản trị Tương tác */}
                      <Route path="qa" element={<ComingSoonPage />} />
                      <Route path="comments" element={<ComingSoonPage />} />
                      <Route path="polls" element={<ComingSoonPage />} />
                      
                      {/* Quản trị Giao diện */}
                      <Route path="menus" element={<ComingSoonPage />} />
                      <Route path="layouts" element={<ComingSoonPage />} />
                      
                      {/* Quản trị Hệ thống */}
                      <Route path="user" element={<UserManagementPage />} />
                      <Route path="roles" element={<AdminRolesPage />} />
                      <Route path="translations" element={<AdminTranslationsPage />} />
                      <Route path="website-manager" element={<AdminWebsiteManagerPage />} />
                      <Route path="settings" element={<ComingSoonPage />} />
                      
                      {/* Tài khoản cá nhân */}
                      <Route path="my-account" element={<MyAccountPage />} />
                      
                      {/* Thống kê & Báo cáo */}
                      <Route path="reports/news" element={<ComingSoonPage />} />
                      <Route path="reports/traffic" element={<ComingSoonPage />} />
                      <Route path="reports/emc" element={<ComingSoonPage />} />
                    </Route>
                    
                    {/* Public Routes - With Mobile Layout */}
                    <Route path="/*" element={
                      <MobileLayout>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/sitemap" element={<SitemapPage />} />
                          <Route path="/news" element={<Index />} />
                          <Route path="/news/category/:categorySlug" element={<CategoryNewsPage />} />
                          <Route path="/news/:slug" element={<NewsDetailPage />} />
                          <Route path="/events" element={<EventsPage />} />
                          <Route path="/events/:slug" element={<EventDetailPage />} />
                          <Route path="/gioi-thieu/thu-ngo" element={<WelcomeLetterPage />} />
                          <Route path="/gioi-thieu/tong-quan-ve-da-nang" element={<DanangOverviewPage />} />
                          <Route path="/tong-quan-ban-quan-ly/chuc-nang-nhiem-vu" element={<FunctionsDutiesPage />} />
                          <Route path="/tong-quan-ban-quan-ly/cac-phong-ban" element={<DepartmentsPage />} />
                          <Route path="/tong-quan-ban-quan-ly/don-vi-truc-thuoc" element={<AffiliatedUnitsPage />} />
                          <Route path="/cam-nang-dau-tu" element={<InvestmentGuidePage />} />
                          <Route path="/cam-nang-dau-tu/chinh-sach-uu-dai" element={<InvestmentPolicyPage />} />
                          <Route path="/cam-nang-dau-tu/brochure" element={<BrochurePage />} />
                          <Route path="/coming-soon" element={<ComingSoonPage />} />
                          <Route path="/search" element={<SearchResultsPage />} />
                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </MobileLayout>
                    } />
                  </Routes>
                </Suspense>
                
                {/* Performance Monitor - only in development */}
                <PerformanceMonitor />
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

export default App;
