import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ChevronRight } from 'lucide-react';

const InvestmentGuidePage = () => {
  const documents = [
    {
      id: 1,
      title: "Chính sách ưu đãi và hỗ trợ đầu tư vào Khu công nghệ cao Đà Nẵng",
      date: "01-01-2025",
      type: "Chính sách",
      url: "/cam-nang-dau-tu/chinh-sach-uu-dai"
    },
    {
      id: 2,
      title: "Brochure - Giới thiệu tổng quan DSEZA",
      date: "01-01-2025", 
      type: "Brochure",
      url: "/cam-nang-dau-tu/brochure"
    }
  ];

  return (
    <PublicLayout showHeroBackground={false}>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium">Cẩm nang đầu tư</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4">
              Cẩm nang đầu tư
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        <FileText className="w-5 h-5 mt-1 text-[#416628] dark:text-[#19DBCF]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {doc.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{doc.date}</span>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#416628]/10 text-[#416628] dark:bg-[#19DBCF]/20 dark:text-[#19DBCF]">
                            {doc.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm"
                        className="border-gray-300 dark:border-gray-600 hover:bg-[#416628]/5 hover:border-[#416628] dark:hover:bg-[#19DBCF]/10 dark:hover:border-[#19DBCF] transition-all duration-200"
                      >
                        <Link to={doc.url} className="flex items-center space-x-2">
                          <span>Xem chi tiết</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default InvestmentGuidePage;