import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Download, Share2, Printer, FileText } from 'lucide-react';

// Investment Policy Content Component
const InvestmentPolicyContent = () => (
  <div className="prose dark:prose-invert max-w-none">
    <h2 className="text-2xl font-bold mb-6">Chính sách ưu đãi và hỗ trợ đầu tư vào Khu công nghệ cao Đà Nẵng</h2>
    
    <h3 className="text-xl font-semibold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary">
      1. Ưu đãi về thuế thu nhập doanh nghiệp
    </h3>
    <ul className="mb-6 space-y-2">
      <li>Thuế suất ưu đãi <strong>10%</strong> trong thời hạn <strong>15 năm</strong> (thời gian áp dụng thuế suất ưu đãi được tính liên tục từ năm đầu tiên doanh nghiệp có doanh thu).</li>
      <li>Dự án từ <strong>3000 tỷ đồng</strong> trở lên được hưởng thuế suất ưu đãi <strong>10%</strong> trong <strong>30 năm</strong>.</li>
      <li><strong>Miễn thuế 4 năm</strong>, giảm <strong>50%</strong> số thuế phải nộp trong <strong>9 năm</strong> tiếp theo (thời gian miễn thuế được tính liên tục từ năm đầu tiên doanh nghiệp có thu nhập chịu thuế).</li>
    </ul>

    <h3 className="text-xl font-semibold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary">
      2. Ưu đãi về tín dụng đầu tư
    </h3>
    <p className="mb-6">
      Các doanh nghiệp, tổ chức kinh tế, đơn vị sự nghiệp có thu đầu tư thuộc Danh mục các dự án vay vốn tín dụng đầu tư thực hiện theo quy định của pháp luật hiện hành.
    </p>

    <h3 className="text-xl font-semibold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary">
      3. Ưu đãi về tiền thuê đất
    </h3>
    <ul className="mb-6 space-y-3">
      <li>
        <strong>Miễn toàn bộ tiền thuê đất</strong> cho cả thời hạn dự án đầu tư thuê đối với:
        <ul className="mt-2 ml-4 space-y-1">
          <li>• Đất xây dựng công trình giao thông và hạ tầng kỹ thuật</li>
          <li>• Đất cây xanh, đất có mặt nước, công viên sử dụng công cộng</li>
          <li>• Đất xây dựng cơ sở đào tạo nhân lực công nghệ cao</li>
          <li>• Đất thực hiện dự án nhà ở cho chuyên gia, người lao động thuê khi làm việc tại Khu công nghệ cao</li>
          <li>• Dự án thuộc Danh mục lĩnh vực đặc biệt ưu đãi đầu tư</li>
        </ul>
      </li>
      <li><strong>Miễn tiền thuê đất</strong> trong thời gian xây dựng cơ bản nhưng tối đa không quá <strong>03 năm</strong> kể từ ngày có quyết định cho thuê đất.</li>
      <li><strong>Miễn tiền thuê đất trong 19 năm:</strong> Dự án thuộc danh mục lĩnh vực ưu đãi đầu tư</li>
      <li><strong>Miễn tiền thuê đất trong 15 năm:</strong> Dự án không thuộc danh mục lĩnh vực ưu đãi đầu tư; dự án đầu tư xây dựng, kinh doanh kết cấu hạ tầng Khu công nghệ cao.</li>
    </ul>

    <h3 className="text-xl font-semibold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary">
      4. Ưu đãi về thuế nhập khẩu
    </h3>
    <ul className="mb-6 space-y-3">
      <li>
        <strong>Miễn thuế</strong> đối với hàng hóa nhập khẩu để tạo tài sản cố định của dự án trong Khu công nghệ cao, bao gồm:
        <ul className="mt-2 ml-4 space-y-1">
          <li>• Máy móc, thiết bị, linh kiện</li>
          <li>• Phương tiện vận tải</li>
          <li>• Vật tư xây dựng trong nước chưa sản xuất được</li>
          <li>• Áp dụng cho cả dự án đầu tư mới và dự án đầu tư mở rộng</li>
        </ul>
      </li>
      <li><strong>Miễn thuế nhập khẩu trong thời hạn 05 năm</strong> kể từ khi bắt đầu sản xuất đối với nguyên liệu, vật tư, linh kiện trong nước chưa sản xuất được nhập khẩu để sản xuất của các dự án đầu tư vào Khu công nghệ cao.</li>
      <li>
        <strong>Miễn thuế nhập khẩu</strong> đối với máy móc, thiết bị, phụ tùng, vật tư chuyên dùng trong nước chưa sản xuất được, tài liệu, sách báo khoa học chuyên dùng sử dụng trực tiếp cho:
        <ul className="mt-2 ml-4 space-y-1">
          <li>• Nghiên cứu khoa học công nghệ</li>
          <li>• Ươm tạo công nghệ</li>
          <li>• Ươm tạo doanh nghiệp khoa học và công nghệ trong Khu công nghệ cao</li>
        </ul>
      </li>
    </ul>

    <h3 className="text-xl font-semibold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary">
      5. Xuất nhập cảnh
    </h3>
    <p className="mb-6">
      Nhà đầu tư, chuyên gia và người lao động là người Việt Nam định cư ở nước ngoài, người nước ngoài làm việc trực tiếp tại Khu công nghệ cao và thành viên gia đình (bao gồm bố, mẹ, vợ hoặc chồng, con đẻ, con nuôi dưới 18 tuổi) được xem xét cấp thị thực có giá trị xuất cảnh, nhập cảnh nhiều lần với thời hạn phù hợp với mục đích nhập cảnh theo quy định của pháp luật.
    </p>

    <div className="mt-8 p-4 bg-dseza-light-secondary dark:bg-dseza-dark-secondary-bg rounded-lg">
      <p className="text-sm text-dseza-light-secondary-text dark:text-dseza-dark-secondary-text">
        <strong>Lưu ý:</strong> Các chính sách ưu đãi trên được áp dụng theo quy định hiện hành của pháp luật Việt Nam. 
        Để biết thêm chi tiết và cập nhật mới nhất, quý nhà đầu tư vui lòng liên hệ trực tiếp với DSEZA.
      </p>
    </div>
  </div>
);

const InvestmentPolicyPage = () => {
  const handleDownload = () => {
    // Logic tải xuống - có thể tải PDF hoặc Word
    console.log('Downloading investment policy document...');
  };

  const handleShare = () => {
    // Logic chia sẻ
    if (navigator.share) {
      navigator.share({
        title: 'Chính sách ưu đãi và hỗ trợ đầu tư vào Khu công nghệ cao Đà Nẵng - DSEZA',
        text: 'Chính sách ưu đãi và hỗ trợ đầu tư vào Khu công nghệ cao Đà Nẵng',
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
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cam-nang-dau-tu">Cẩm nang đầu tư</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium">Chính sách ưu đãi và hỗ trợ đầu tư</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4">
              Chính sách ưu đãi và hỗ trợ đầu tư vào Khu công nghệ cao Đà Nẵng
            </CardTitle>
            
            {/* Metadata Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Chính sách đầu tư
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Ngày đăng tin: 01-01-2025
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  Lượt xem: 16
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
            <InvestmentPolicyContent />
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default InvestmentPolicyPage; 