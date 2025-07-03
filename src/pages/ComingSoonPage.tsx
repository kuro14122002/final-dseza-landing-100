import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { useTranslation } from '@/utils/translations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ComingSoonPage: React.FC = () => {
  const { t } = useTranslation();

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <PublicLayout showHeroBackground={false}>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium">Sắp ra mắt</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-2xl text-center">
            <CardHeader>
              <div className="flex justify-center mb-6">
                <Construction className="w-24 h-24 text-dseza-light-primary dark:text-dseza-dark-primary" />
              </div>
              <CardTitle className="text-3xl font-bold font-montserrat mb-4">
                Trang đang được phát triển
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-dseza-light-secondary-text dark:text-dseza-dark-secondary-text">
                Chúng tôi đang cập nhật nội dung chi tiết cho trang này. 
                Vui lòng quay lại sau để khám phá thêm thông tin hữu ích về đầu tư tại DSEZA.
              </p>
              <p className="text-sm text-dseza-light-secondary-text dark:text-dseza-dark-secondary-text">
                Trong thời gian chờ đợi, bạn có thể tham khảo các thông tin khác trên website 
                hoặc liên hệ trực tiếp với chúng tôi để được hỗ trợ.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleGoBack}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </Button>
                <Button asChild>
                  <a href="/">Về trang chủ</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ComingSoonPage; 