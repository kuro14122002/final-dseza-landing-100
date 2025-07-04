import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, FileText, Download, Share2, Printer } from 'lucide-react';

const FunctionsDutiesPage = () => {
  const handleDownload = () => {
    // Logic tải xuống - có thể tải PDF hoặc Word
    console.log('Downloading document...');
  };

  const handleShare = () => {
    // Logic chia sẻ
    if (navigator.share) {
      navigator.share({
        title: 'Chức năng, nhiệm vụ, quyền hạn Ban Quản lý - DSEZA',
        text: 'Chức năng, nhiệm vụ, quyền hạn Ban Quản lý Khu công nghệ cao và các khu công nghiệp Đà Nẵng',
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
              <BreadcrumbLink href="/tong-quan-ban-quan-ly/chuc-nang-nhiem-vu" aria-current="page">Chức năng, nhiệm vụ</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4">Chức năng, nhiệm vụ, quyền hạn Ban Quản lý</CardTitle>
            
            {/* Metadata Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Đọc văn bản
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Ngày đăng tin: 15-10-2019
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  Lượt xem: 20
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
            <div className="space-y-8 text-justify">
              {/* Giới thiệu chung */}
              <section>
                <p className="mb-4">
                  Ban Quản lý Khu công nghệ cao và các khu công nghiệp Đà Nẵng được thực hiện theo Quyết định số 1296/QĐ-TTg ngày 03/10/2018 của Thủ tướng Chính phủ, trên cơ sở hợp nhất 2 đơn vị Ban Quản lý Khu công nghệ cao Đà Nẵng với Ban Quản lý các khu công nghiệp và chế xuất Đà Nẵng trước đây.
                </p>
                <p className="mb-6">
                  Đây sẽ là đầu mối thống nhất cho việc quản lý hoạt động của các Khu công nghiệp trên địa bàn thành phố hiệu quả hơn, đồng thời tạo thuận lợi đẩy mạnh hoạt động xúc tiến đầu tư cho thành phố.
                </p>
              </section>

              {/* 1. Chức năng */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">1. Chức năng</h2>
                <div className="space-y-4">
                  <p>
                    Ban quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng (sau đây viết tắt là Ban Quản lý) là cơ quan trực thuộc UBND thành phố, thực hiện chức năng quản lý nhà nước trực tiếp đối với Khu công nghệ cao và các khu công nghiệp trên địa bàn Đà Nẵng; quản lý và tổ chức thực hiện chức năng cung ứng dịch vụ hành chính công và dịch vụ hỗ trợ khác có liên quan đến hoạt động đầu tư và sản xuất, kinh doanh cho nhà đầu tư trong khu công nghệ cao và các khu công nghiệp.
                  </p>
                  <p>
                    Ban Quản lý chịu sự chỉ đạo và quản lý về tổ chức, biên chế, chương trình kế hoạch công tác và kinh phí hoạt động của Ủy ban nhân dân thành phố; chịu sự chỉ đạo, hướng dẫn và kiểm tra về chuyên môn nghiệp vụ của các Bộ, ngành quản lý về lĩnh vực có liên quan.
                  </p>
                  <p>
                    Ban Quản lý có tư cách pháp nhân; có con dấu mang hình quốc huy và tài khoản riêng; kinh phí quản lý hành chính nhà nước, kinh phí hoạt động sự nghiệp và vốn đầu tư phát triển do ngân sách nhà nước cấp theo kế hoạch hàng năm.
                  </p>
                </div>
              </section>

              {/* 2. Nhiệm vụ và Quyền hạn */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">2. Nhiệm vụ và Quyền hạn</h2>
                <div className="space-y-4">
                  <p>Ban Quản lý thực hiện nhiệm vụ, quyền hạn theo quy định tại:</p>
                  <ul className="space-y-2 ml-6">
                    <li>- Điều 35 Nghị định số 99/2003/NĐ-CP ngày 28 tháng 8 năm 2003 của Chính phủ về việc ban hành Quy chế Khu công nghệ cao.</li>
                    <li>- Điều 63 Nghị định số 82/2018/NĐ-CP ngày 22 tháng 5 năm 2018 của Chính phủ quy định về quản lý khu công nghiệp và khu kinh tế.</li>
                    <li>- Các văn bản pháp luật khác có liên quan.</li>
                  </ul>
                </div>
              </section>

              {/* 3. Sơ đồ tổ chức */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">3. Sơ đồ tổ chức</h2>
                <div className="bg-secondary/20 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-semibold mb-4">SƠ ĐỒ TỔ CHỨC BAN QUẢN LÝ KHU CÔNG NGHỆ CAO VÀ CÁC KHU CÔNG NGHIỆP ĐÀ NẴNG</h3>
                  <p className="text-muted-foreground italic">
                    Sơ đồ tổ chức chi tiết đang được cập nhật...
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default FunctionsDutiesPage; 