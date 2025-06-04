import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SitemapPage from "./pages/SitemapPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import CategoryNewsPage from "./pages/CategoryNewsPage";
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminNewsListPage from "./pages/admin/AdminNewsListPage";
import AdminNewsFormPage from "./pages/admin/AdminNewsFormPage";
import AdminLayout from "./layouts/AdminLayout";
import MobileLayout from "./components/mobile/MobileLayout";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Admin Routes - Login Page without Layout */}
                <Route path="/admin/login" element={<LoginPage />} />
                
                {/* Admin Routes - With AdminLayout */}
                <Route path="/admin/*" element={<AdminLayout />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="news" element={<AdminNewsListPage />} />
                  <Route path="news/create" element={<AdminNewsFormPage />} />
                  <Route path="news/edit/:articleId" element={<AdminNewsFormPage />} />
                  {/* Add more admin routes here when needed */}
                  {/* <Route path="events" element={<EventManagementPage />} /> */}
                  {/* <Route path="events/create" element={<CreateEventPage />} /> */}
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
                      <Route path="/events/:slug" element={<NewsDetailPage />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MobileLayout>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
