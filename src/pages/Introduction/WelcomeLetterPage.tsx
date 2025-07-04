import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Download, Share2, Printer, FileText } from 'lucide-react';

// *** BẠN CÓ THỂ THAY THẾ NỘI DUNG TRONG COMPONENT NÀY ***
const WelcomeLetterContent = () => (
  <div className="prose dark:prose-invert max-w-none">
    <p className="lead text-lg mb-6">
      Chào mừng quý vị đã đến với DSEZA chúng tôi,
    </p>
    <p className="mb-4">
      Lời đầu tiên, Ban Quản lý Khu công nghệ cao và các khu công nghiệp Đà nẵng (DSEZA) xin được gửi đến Quý tổ chức, doanh nghiệp, nhà đầu tư, cá nhân lời chào trân trọng, lời chúc sức khỏe, an khang và thịnh vượng.
    </p>
    <p className="mb-4">
      Ban Quản lý Khu công nghệ cao và các khu công nghiệp Đà Nẵng được thành lập dựa trên cơ sở hợp nhất Ban Quản lý các Khu công nghiệp và chế xuất Đà Nẵng và Ban Quản lý Khu công nghệ cao Đà Nẵng, từ tháng 10/2018 nhằm đáp ứng với chủ trương của Chính phủ, Nhà nước và phù hợp với yêu cầu phát triển kinh tế - xã hội của cả nước và của thành phố Đà Nẵng.
    </p>
    <p className="mb-4">
      Ngày 29/4/2025, UBND TP.Đà Nẵng ban hành quyết định số 34/2025/QĐ-UBND quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của ban quản lý, trong đó đáng chú ý là chức năng mới quản lý Khu thương mại tự do. Quyết định này thay thế các quyết định trước đó về quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Ban quản lý Khu Công nghệ cao và các KCN Đà Nẵng - đơn vị trực thuộc UBND thành phố.
    </p>
    <p className="mb-4">
      Ban Quản lý là cơ quan trực thuộc Ủy ban nhân dân thành phố Đà Nẵng, thực hiện chức năng quản lý nhà nước trực tiếp đối với khu công nghệ cao, khu công nghệ thông tin tập trung Đà Nẵng và các khu công nghiệp trên địa bàn thành phố Đà Nẵng; quản lý và tổ chức thực hiện chức năng cung ứng dịch vụ hành chính công và dịch vụ hỗ trợ khác có liên quan đến hoạt động đầu tư và sản xuất, kinh doanh cho nhà đầu tư trong khu công nghệ cao, khu công nghệ thông tin tập trung Đà Nẵng và các khu công nghiệp trên địa bàn thành phố Đà Nẵng theo quy định của pháp luật.
    </p>
    <p className="mb-4">
      Với tinh thần thiện chí của mình tại khu công nghệ cao, khu công nghệ thông tin tập trung Đà Nẵng và các khu công nghiệp trên địa bàn thành phố Đà Nẵng.  DSEZA cam kết luôn đồng hành cùng các tổ chức, doanh nghiệp, nhà đầu tư, cá nhân khi đặt niềm tin, lựa chọn khu công nghệ cao, khu công nghệ thông tin tập trung Đà Nẵng và các khu công nghiệp  trên địa bàn thành phố Đà Nẵng làm điểm đến trong thời gian qua, cũng như hiện tại và trong tương lai
    </p>
    <p className="mb-4">
      Hy vọng quý tổ chức, doanh nghiệp, nhà đầu tư, cá nhân thật sự hài lòngvới DSEZA và thành phố Đà Nẵng. Một lần nữa, kính chúc quý vị luôn gặp nhiều may mắn, thành công và phát đạt. 
    </p>
    <p className="font-semibold text-right mb-2">Trân trọng cảm ơn.</p>
    <p className="font-semibold text-right">DSEZA</p>
  </div>
);

const WelcomeLetterPage = () => {
  const handleDownload = () => {
    // Logic tải xuống - có thể tải PDF hoặc Word
    console.log('Downloading document...');
  };

  const handleShare = () => {
    // Logic chia sẻ
    if (navigator.share) {
      navigator.share({
        title: 'Thư ngỏ - DSEZA',
        text: 'Thư ngỏ từ Ban Quản lý Khu công nghệ cao và các khu công nghiệp Đà Nẵng',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link vào clipboard!');
    }
  };

  const handlePrint = () => {
    // Logic in trang
    window.print();
  };

  return (
    <PublicLayout showHeroBackground={false}>
      <div className="container mx-auto px-4 py-8 mt-24 lg:mt-32">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/gioi-thieu">Giới thiệu</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/gioi-thieu/thu-ngo" aria-current="page">Thư ngỏ</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4">Thư ngỏ</CardTitle>
            
            {/* Metadata Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Đọc văn bản
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Ngày đăng tin: 10-10-2018
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  Lượt xem: 39
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  In
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 py-6">
            <WelcomeLetterContent />
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default WelcomeLetterPage; 