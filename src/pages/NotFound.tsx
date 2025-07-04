import React from 'react';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PublicLayout 
      showHeroBackground={false}
      seoProps={{
        title: "404 - Không tìm thấy trang",
        description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-2xl text-center">
            <CardHeader>
              <div className="flex justify-center mb-6">
                <AlertCircle className="w-24 h-24 text-red-500" />
              </div>
              <CardTitle className="text-6xl font-bold text-red-500 mb-4">
                404
              </CardTitle>
              <CardTitle className="text-2xl font-semibold mb-4">
                Không tìm thấy trang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Đường dẫn: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{location.pathname}</code>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Về trang chủ
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/search" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Tìm kiếm
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NotFound;
