import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, FileText, Phone, Mail, Globe, Download, Share2, Printer } from 'lucide-react';

const AffiliatedUnitsPage = () => {
  const handleDownload = () => {
    // Logic tải xuống - có thể tải PDF hoặc Word
    console.log('Downloading document...');
  };

  const handleShare = () => {
    // Logic chia sẻ
    if (navigator.share) {
      navigator.share({
        title: 'Đơn vị trực thuộc - DSEZA',
        text: 'Thông tin về các đơn vị trực thuộc Ban Quản lý Khu công nghệ cao và các khu công nghiệp Đà Nẵng',
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
              <BreadcrumbLink href="/tong-quan-ban-quan-ly/don-vi-truc-thuoc" aria-current="page">Đơn vị trực thuộc</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4">Đơn vị trực thuộc</CardTitle>
            
            {/* Metadata Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Đọc văn bản
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Ngày đăng tin: 15-08-2019
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  Lượt xem: 35
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
            <div className="space-y-10 text-justify">
              
              {/* I. CÁC ĐƠN VỊ TRỰC THUỘC */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">I. CÁC ĐƠN VỊ TRỰC THUỘC</h2>
                
                <div className="space-y-8">
                  {/* 1. Trung tâm Dịch vụ Tổng hợp Khu công nghệ cao Đà Nẵng */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">1. Trung tâm Dịch vụ Tổng hợp Khu công nghệ cao Đà Nẵng</h3>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground italic">Thông tin chi tiết đang được cập nhật...</p>
                    </div>
                  </div>

                  {/* 2. Công ty Phát triển và Khai thác hạ tầng Khu Công nghiệp Đà Nẵng */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">2. Công ty Phát triển và Khai thác hạ tầng Khu Công nghiệp Đà Nẵng</h3>
                    
                    {/* Thông tin công ty */}
                    <div className="bg-muted/30 p-4 rounded-lg mb-4 border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Địa chỉ:</strong> Số 58 Nguyễn Chí Thanh, quận Hải Châu, Thành phố Đà Nẵng</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Điện thoại:</strong> 0236-3.886.159</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Fax:</strong> 0236-3.886.157</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Email:</strong> daizico@danang.gov.vn</span>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin lãnh đạo */}
                    <div className="space-y-6">
                      {/* Giám đốc */}
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">* Ông Nguyễn Trọng Cường - Giám đốc</h4>
                        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                          <table className="w-full">
                            <tbody>
                              <tr className="border-b">
                                <td className="p-3 font-medium bg-muted/50 text-foreground">Điện thoại văn phòng</td>
                                <td className="p-3 text-muted-foreground">(0236) 3886169</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 font-medium bg-muted/50 text-foreground">Điện thoại di động</td>
                                <td className="p-3 text-muted-foreground">0914000818</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-medium bg-muted/50 text-foreground">Email</td>
                                <td className="p-3 text-muted-foreground">cuongnt2@danang.gov.vn</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Phó Giám đốc */}
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">* Bà Trần Thu Hương - Phó Giám đốc</h4>
                        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                          <table className="w-full">
                            <tbody>
                              <tr className="border-b">
                                <td className="p-3 font-medium bg-muted/50 text-foreground">Điện thoại văn phòng</td>
                                <td className="p-3 text-muted-foreground">(0236) 3840359</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-3 font-medium bg-muted/50 text-foreground">Điện thoại di động</td>
                                <td className="p-3 text-muted-foreground">0905163169</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-medium bg-muted/50 text-foreground">Email</td>
                                <td className="p-3 text-muted-foreground">huongtt1@danang.gov.vn</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* II. CÁC ĐƠN VỊ CHỦ ĐẦU TƯ KINH DOANH HẠ TẦNG TẠI CÁC KHU CÔNG NGHIỆP */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">II. CÁC ĐƠN VỊ CHỦ ĐẦU TƯ KINH DOANH HẠ TẦNG TẠI CÁC KHU CÔNG NGHIỆP</h2>
                
                <div className="space-y-8">
                  {/* 1. Công ty cổ phần Đầu tư Sài gòn-Đà Nẵng */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">1. Công ty cổ phần Đầu tư Sài gòn-Đà Nẵng</h3>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Địa chỉ:</strong> 61A Nguyễn Văn Cừ, TP Đà Nẵng</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Điện thoại:</strong> (0236) 3 770998</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Fax:</strong> (0236) 3770 997</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Website:</strong> www.dananginvest.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Email:</strong> info@dananginvest.com</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Công ty TNHH Massda Land */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">2. Công ty TNHH Massda Land</h3>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Địa chỉ:</strong> KCN Đà Nẵng, quận Sơn Trà, Thành phố Đà Nẵng</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Điện thoại:</strong> (0236) 3.844.375</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Fax:</strong> (0236) 3.844.374</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Email:</strong> massda@dng.vnn.vn</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Công ty Cổ phần Đầu tư khu công nghiệp Hòa Cầm */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">3. Công ty Cổ phần Đầu tư khu công nghiệp Hòa Cầm</h3>
                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Địa chỉ:</strong> Số 176 đường 3/2, quận Hải Châu, thành phố Đà Nẵng</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Điện thoại:</strong> (0236) 2 466 467</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Fax:</strong> (0236) 3 898 077</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Website:</strong> www.hoacamizi.com.vn</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground"><strong className="text-foreground">Email:</strong> hoacamizi@vnn.vn</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default AffiliatedUnitsPage; 