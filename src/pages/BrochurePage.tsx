import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Download, Share2, Printer, FileText, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react';

// Brochure Content Component
const BrochureContent = () => (
  <div className="prose dark:prose-invert max-w-none">
    {/* Header Section */}
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary">
        BAN QUẢN LÝ KHU CÔNG NGHỆ CAO VÀ CÁC KHU CÔNG NGHIỆP ĐÀ NẴNG
      </h2>
      <h3 className="text-xl font-semibold text-dseza-light-secondary-text dark:text-dseza-dark-secondary-text">
        DA NANG SPECIFIC ECONOMIC ZONES AUTHORITY (DSEZA)
      </h3>
      <p className="text-lg mt-4 text-dseza-light-text dark:text-dseza-dark-text">
        Điểm đến lý tưởng cho các nhà đầu tư trong và ngoài nước
      </p>
    </div>

    {/* About DSEZA */}
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary flex items-center gap-2">
        <Building className="w-6 h-6" />
        Giới thiệu về DSEZA
      </h3>
      <p className="mb-4">
        Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng (DSEZA) là cơ quan trực thuộc UBND thành phố Đà Nẵng, 
        được thành lập nhằm quản lý và phát triển các khu kinh tế đặc biệt tại Đà Nẵng.
      </p>
      <p className="mb-4">
        <strong>Sứ mệnh:</strong> Tạo dựng môi trường đầu tư thuận lợi, hiện đại và bền vững, thu hút các dự án đầu tư 
        chất lượng cao trong lĩnh vực công nghệ, sản xuất và dịch vụ.
      </p>
    </div>

    {/* Key Zones */}
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary flex items-center gap-2">
        <MapPin className="w-6 h-6" />
        Các Khu chức năng chính
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-dseza-light-secondary dark:bg-dseza-dark-secondary-bg p-4 rounded-lg">
          <h4 className="font-bold text-lg mb-2">🏢 Khu Công nghệ cao Đà Nẵng</h4>
          <p className="text-sm">Trung tâm nghiên cứu và phát triển công nghệ, đào tạo nhân lực chất lượng cao</p>
        </div>
        
        <div className="bg-dseza-light-secondary dark:bg-dseza-dark-secondary-bg p-4 rounded-lg">
          <h4 className="font-bold text-lg mb-2">🏭 Các Khu Công nghiệp</h4>
          <p className="text-sm">7 khu công nghiệp với tổng diện tích hơn 4.000 ha, thu hút đầu tư sản xuất</p>
        </div>
        
        <div className="bg-dseza-light-secondary dark:bg-dseza-dark-secondary-bg p-4 rounded-lg">
          <h4 className="font-bold text-lg mb-2">💻 Khu CNTT tập trung</h4>
          <p className="text-sm">Trung tâm phát triển công nghệ thông tin và chuyển đổi số</p>
        </div>
        
        <div className="bg-dseza-light-secondary dark:bg-dseza-dark-secondary-bg p-4 rounded-lg">
          <h4 className="font-bold text-lg mb-2">🌐 Khu Thương mại Tự do</h4>
          <p className="text-sm">Khu vực đặc biệt với các ưu đãi về thương mại và dịch vụ</p>
        </div>
      </div>
    </div>

    {/* Investment Advantages */}
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary flex items-center gap-2">
        <Zap className="w-6 h-6" />
        Lợi thế đầu tư
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h4 className="font-semibold">Vị trí địa lý chiến lược</h4>
            <p className="text-sm">Trung tâm kết nối Đông Nam Á, gần sân bay quốc tế và cảng biển</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <span className="text-2xl">💰</span>
          <div>
            <h4 className="font-semibold">Chính sách ưu đãi hấp dẫn</h4>
            <p className="text-sm">Thuế suất 10%, miễn thuế thu nhập doanh nghiệp, ưu đãi tiền thuê đất</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏗️</span>
          <div>
            <h4 className="font-semibold">Hạ tầng hiện đại</h4>
            <p className="text-sm">Hệ thống điện, nước, viễn thông, giao thông hoàn chỉnh</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <span className="text-2xl">👥</span>
          <div>
            <h4 className="font-semibold">Nguồn nhân lực chất lượng</h4>
            <p className="text-sm">Lao động được đào tạo bài bản, trình độ cao</p>
          </div>
        </div>
      </div>
    </div>

    {/* Key Statistics */}
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary flex items-center gap-2">
        <Users className="w-6 h-6" />
        Thành tựu nổi bật
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">400+</div>
          <div className="text-sm text-blue-700 dark:text-blue-200">Doanh nghiệp</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-300">150k+</div>
          <div className="text-sm text-green-700 dark:text-green-200">Việc làm</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-300">$8B+</div>
          <div className="text-sm text-purple-700 dark:text-purple-200">Vốn đầu tư</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-300">4000+</div>
          <div className="text-sm text-orange-700 dark:text-orange-200">Hecta</div>
        </div>
      </div>
    </div>

    {/* Priority Sectors */}
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-dseza-light-primary dark:text-dseza-dark-primary">
        Lĩnh vực ưu tiên đầu tư
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border border-dseza-light-border dark:border-dseza-dark-border rounded-lg">
          <h4 className="font-semibold mb-2">🔬 Công nghệ cao</h4>
          <ul className="text-sm space-y-1">
            <li>• Vi mạch bán dẫn</li>
            <li>• Trí tuệ nhân tạo</li>
            <li>• IoT và Big Data</li>
          </ul>
        </div>
        
        <div className="p-4 border border-dseza-light-border dark:border-dseza-dark-border rounded-lg">
          <h4 className="font-semibold mb-2">🏭 Sản xuất thông minh</h4>
          <ul className="text-sm space-y-1">
            <li>• Cơ khí chính xác</li>
            <li>• Điện tử</li>
            <li>• Dệt may công nghệ cao</li>
          </ul>
        </div>
        
        <div className="p-4 border border-dseza-light-border dark:border-dseza-dark-border rounded-lg">
          <h4 className="font-semibold mb-2">🌱 Năng lượng sạch</h4>
          <ul className="text-sm space-y-1">
            <li>• Năng lượng tái tạo</li>
            <li>• Công nghệ xanh</li>
            <li>• Môi trường</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Contact Information */}
    <div className="mt-8 p-6 bg-gradient-to-r from-dseza-light-primary to-blue-600 dark:from-dseza-dark-primary dark:to-blue-800 text-white rounded-lg">
      <h3 className="text-xl font-bold mb-4">Liên hệ với chúng tôi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Địa chỉ:</strong> Lô A17, đường Trung tâm, Khu công nghệ cao, xã Hòa Liên, huyện Hòa Vang, Đà Nẵng</p>
          <p><strong>Điện thoại:</strong> 0236 3666117</p>
        </div>
        <div>
          <p><strong>Email:</strong> dseza@danang.gov.vn</p>
          <p><strong>Website:</strong> www.dseza.danang.gov.vn</p>
        </div>
      </div>
    </div>

    <div className="mt-8 text-center text-sm text-dseza-light-secondary-text dark:text-dseza-dark-secondary-text">
      <p><strong>DSEZA</strong> - Cùng bạn kiến tạo tương lai</p>
      <p><em>"Building the Future Together"</em></p>
    </div>
  </div>
);

const BrochurePage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdfUrl = '/dhpiza-profile-2023-176x250-vn.pdf';

  const handleDownload = () => {
    // Tải xuống file PDF thật
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Brochure-DSEZA-2023.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    // Logic chia sẻ
    if (navigator.share) {
      navigator.share({
        title: 'Brochure - Giới thiệu tổng quan DSEZA',
        text: 'Brochure giới thiệu tổng quan về Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link vào clipboard!');
    }
  };

  const handlePrint = () => {
    // Mở PDF trong tab mới để in
    window.open(pdfUrl, '_blank');
  };

  const handleViewFullscreen = () => {
    window.open(pdfUrl, '_blank');
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
              <span className="font-medium">Brochure - Giới thiệu tổng quan DSEZA</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4">
              Brochure - Giới thiệu tổng quan DSEZA
            </CardTitle>
            
            {/* Metadata Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tài liệu PDF
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Ngày đăng tin: 01-01-2025
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  Lượt xem: 25
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống
                </Button>
                <Button variant="outline" size="sm" onClick={handleViewFullscreen}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Xem toàn màn hình
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
          <CardContent className="px-4 py-6">
            {/* PDF Viewer */}
            <div className="w-full">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Xem trước tài liệu</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FileText className="w-4 h-4" />
                    <span>File PDF - {(3.7).toFixed(1)} MB</span>
                  </div>
                </div>
                
                {/* PDF Embed */}
                <div className="relative w-full" style={{ height: '800px' }}>
                  <iframe
                    src={`${pdfUrl}#view=FitH`}
                    className="w-full h-full border border-gray-300 dark:border-gray-600 rounded"
                    title="Brochure DSEZA"
                  />
                </div>
                
                {/* PDF Controls */}
                <div className="mt-4 flex items-center justify-center gap-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleViewFullscreen}
                    className="flex items-center gap-2"
                  >
                    <ZoomIn className="w-4 h-4" />
                    Xem kích thước thật
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Tải xuống PDF
                  </Button>
                </div>
              </div>
              
              {/* Alternative download section for browsers that don't support PDF embed */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      Không thể hiển thị PDF?
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      Trình duyệt của bạn có thể không hỗ trợ hiển thị PDF. Bạn có thể tải xuống để xem.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Tải xuống PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleViewFullscreen}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Mở trong tab mới
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default BrochurePage; 