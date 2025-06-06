import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, FileText, Phone, Mail, Download, Share2, Printer } from 'lucide-react';

export const DepartmentsPage = () => {
  const handleDownload = () => {
    // Logic tải xuống - có thể tải PDF hoặc Word
    console.log('Downloading document...');
  };

  const handleShare = () => {
    // Logic chia sẻ
    if (navigator.share) {
      navigator.share({
        title: 'Các phòng Ban - DSEZA',
        text: 'Thông tin về các phòng ban chuyên môn thuộc Ban Quản lý Khu công nghệ cao và các khu công nghiệp Đà Nẵng',
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
              <BreadcrumbLink href="/gioi-thieu">Giới thiệu</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tong-quan-ban-quan-ly/cac-phong-ban" aria-current="page">Các phòng ban</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4">Các phòng Ban</CardTitle>
            
            {/* Metadata Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Đọc văn bản
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Ngày đăng tin: 10-05-2019
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
            <div className="space-y-10 text-justify">
              
              {/* I. VĂN PHÒNG */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">I. VĂN PHÒNG</h2>
                
                {/* Thông tin liên hệ */}
                <div className="bg-secondary/20 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm"><strong>Tel:</strong> 0236 3830017</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm"><strong>Fax:</strong> 0236 3830015</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm"><strong>Email:</strong> dhpiza@danang.gov.vn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm"><strong>Tiếp nhận hồ sơ:</strong> 0236.3881888, nhánh 830</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Tham mưu, quản lý về công tác tổ chức, cán bộ.",
                    "Tham mưu xây dựng các quy chế, quy định nội bộ của Ban Quản lý.",
                    "Tham mưu công tác bảo vệ bí mật nhà nước.",
                    "Tham mưu, dự toán ngân sách, kinh phí hoạt động hàng năm của Ban Quản lý; hướng dẫn, giám sát kế toán tài chính các đơn vị trực thuộc Ban Quản lý.",
                    "Tham mưu, tổ chức, theo dõi phong trào thi đua – khen thưởng Ban Quản lý, doanh nghiệp KCN.",
                    "Tham mưu, tổ chức thực hiện nhiệm vụ công tác cải cách hành chính nhà nước về lĩnh vực thuộc thẩm quyền của Ban Quản lý.",
                    "Điều hành Bộ phận tiếp nhận và trả kết quả.",
                    "Tổ chức thực hiện công tác văn thư, lưu trữ; quản lý và sử dụng con dấu của cơ quan.",
                    "Rà soát văn bản đi trước khi trình Lãnh đạo Ban ký.",
                    "Tham mưu quản lý, điều hành hệ thống mạng LAN, hệ thống quản lý văn bản và điều hành, trang thông tin điện tử của Ban Quản lý, các công tác liên quan đến ứng dụng công nghệ thông tin.",
                    "Theo dõi công tác xây dựng, áp dụng và cải tiến hệ thống quản lý chất lượng theo tiêu chuẩn TCVN ISO 9001: 2008 Ban Quản lý.",
                    "Triển khai, theo dõi công tác dân chủ cơ sở, cơ quan văn hóa và các công tác về nề nếp làm việc, tinh thần trách nhiệm của cán bộ công chức.",
                    "Chủ trì tham mưu tổ chức các cuộc họp giao ban với các doanh nghiệp trong KCN; giao ban định kỳ của Ban Quản lý.",
                    "Tổng hợp báo cáo tuần, báo cáo giao ban và thông báo kết luận giao ban hàng tháng của Lãnh đạo Ban.",
                    "Thực hiện công tác công tác lễ tân, tổ chức hội nghị, hội thảo và các hoạt động lễ hội của Ban Quản lý, các cấp phát động.",
                    "Quản lý điều hành các phương tiện, đầu mối quản lý tài sản trang thiết bị của cơ quan.",
                    "Thực hiện các công việc khác do Lãnh đạo Ban giao."
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-primary font-medium text-sm mt-1">{index + 1}.</span>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* II. PHÒNG QUẢN LÝ, XÚC TIẾN VÀ HỖ TRỢ ĐẦU TƯ */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">II. PHÒNG QUẢN LÝ, XÚC TIẾN VÀ HỖ TRỢ ĐẦU TƯ</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-foreground mb-3">1. Chức năng:</h3>
                    <p className="mb-4">Tham mưu cho Lãnh đạo Ban Quản lý Khu CNC và các KCN về các lĩnh vực: Xúc tiến đầu tư; quản lý dự án đầu tư; hỗ trợ nhà đầu tư; đối ngoại, hợp tác quốc tế.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-secondary-foreground mb-3">2. Nhiệm vụ:</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">a) Công tác xúc tiến đầu tư</h4>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm">- Tham mưu xây dựng và tổ chức thực hiện kế hoạch, chương trình xúc tiến đầu tư hàng năm, 05 năm và dài hạn của Khu CNC và các KCN.</li>
                          <li className="text-sm">- Tổ chức đón tiếp các nhà đầu tư và các đoàn khách trong và ngoài nước đến thăm và tìm hiểu cơ hội đầu tư tại Khu CNC và các KCN.</li>
                          <li className="text-sm">- Chủ trì tổ chức hoặc tham gia các hội nghị, hội thảo, sự kiện về xúc tiến đầu tư; đề xuất tổ chức các đoàn công tác xúc tiến đầu tư trong nước và nước ngoài; tổ chức tuyên truyền, quảng bá thông tin, hình ảnh Khu CNC và các KCN.</li>
                          <li className="text-sm">- Thiết kế các công cụ, biên soạn và quản lý các tài liệu xúc tiến đầu tư phục vụ công tác xúc tiến đầu tư.</li>
                          <li className="text-sm">- Chủ trì, phối hợp với Văn phòng nghiên cứu triển khai các công cụ, phần mềm trên máy tính và môi trường Internet để nâng cao hiệu quả hoạt động hỗ trợ và xúc tiến đầu tư.</li>
                          <li className="text-sm">- Quản trị và thực hiện các báo cáo tình hình hoạt động đối với Website Khu CNC phiên bản tiếng Anh, tiếng Nhật và tiếng Hàn; thực hiện nhiệm vụ Thư ký Ban biên tập Website.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">b) Cấp Giấy chứng nhận đăng ký đầu tư</h4>
                        <p className="text-sm ml-4">- Chủ trì tham mưu giải quyết các thủ tục hành chính; cấp Giấy chứng nhận đăng ký đầu tư hoặc quyết định chủ trương đầu tư.</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">c) Công tác quản lý các dự án đầu tư</h4>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm">- Tham mưu xây dựng, giải quyết các thủ tục thuộc thẩm quyền của Ban Quản lý Khu CNC và các KCN trong lĩnh vực đầu tư.</li>
                          <li className="text-sm">- Chủ trì tham mưu giải quyết các vấn đề phát sinh đối với dự án đầu tư sau cấp phép đầu tư.</li>
                          <li className="text-sm">- Tham mưu, đề xuất trong việc xây dựng các văn bản quy phạm pháp luật, chính sách có liên quan đến hoạt động đầu tư.</li>
                          <li className="text-sm">- Định kỳ kiểm tra, đôn đốc, nhắc nhở việc thực hiện dự án đầu tư.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">d) Công tác hỗ trợ nhà đầu tư</h4>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm">- Hỗ trợ nhà đầu tư tìm hiểu thông tin, khảo sát môi trường đầu tư của thành phố Đà Nẵng và Khu CNC và các KCN.</li>
                          <li className="text-sm">- Hỗ trợ cung cấp thông tin, hướng dẫn, tư vấn cho nhà đầu tư các quy định về pháp luật liên quan đến hoạt động đầu tư vào Khu CNC và các KCN.</li>
                          <li className="text-sm">- Đầu mối liên lạc với các sở, ban, ngành liên quan trong việc hỗ trợ nhà đầu tư thực hiện các thủ tục đầu tư vào Khu CNC và các KCN.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">đ) Đối ngoại, hợp tác quốc tế</h4>
                        <ul className="space-y-2 ml-4">
                          <li className="text-sm">- Tham mưu thiết lập, duy trì triển khai các hoạt động hợp tác với các cá nhân, tổ chức trong và ngoài nước trong lĩnh vực đầu tư.</li>
                          <li className="text-sm">- Tham mưu cho Lãnh đạo Ban ký kết các thỏa thuận hợp tác, biên bản ghi nhớ giữa Ban Quản lý Khu CNC và các KCN với các đối tác, nhà đầu tư trong và ngoài nước về các lĩnh vực đầu tư.</li>
                          <li className="text-sm">- Tham mưu thực hiện công tác đối ngoại nhân dân theo Chương trình, Kế hoạch của thành phố.</li>
                          <li className="text-sm">- Định kỳ kiểm tra, đánh giá, báo cáo việc thực hiện.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* III. PHÒNG QUẢN LÝ DOANH NGHIỆP VÀ LAO ĐỘNG */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">III. PHÒNG QUẢN LÝ DOANH NGHIỆP VÀ LAO ĐỘNG</h2>
                
                <div className="space-y-3">
                  {[
                    "Tham mưu và trình cấp các loại giấy chứng nhận xuất xứ hàng hóa sản xuất trong KCN.",
                    "Tiếp nhận báo cáo thống kê, tài chính của doanh nghiệp hoạt động trong KCN, theo dõi hoạt động sản xuất kinh doanh của các dự án trong KCN.",
                    "Hướng dẫn, giải quyết các vấn đề phát sinh, khó khăn, vướng mắc của nhà đầu tư trong hoạt động sản xuất kinh doanh, hoạt động chuyển nhượng dự án, tài sản; tạm ngừng hoạt động, phá sản, giải thể doanh nghiệp trong KCN; các thủ tục thanh lý tài sản, máy móc thiết bị.",
                    "Hướng dẫn, theo dõi và tiếp nhận đăng ký khung giá đất, cho thuê lại đất và phí hạ tầng KCN của nhà đầu tư xây dựng kinh doanh kết cấu hạ tầng KCN.",
                    "Theo dõi, đôn đốc Công ty Phát triển và Khai thác hạ tầng KCN Đà Nẵng và xử lý các kiến nghị liên quan đến thu nộp tiền sử dụng đất và phí sử dụng hạ tầng tại KCN do thành phố đầu tư.",
                    "Quản lý các hoạt động dịch vụ trong các KCN.",
                    "Tham mưu và trình cấp, cấp lại, sửa đổi, bổ sung các loại giấy chứng nhận đủ điều kiện kinh doanh, giấy phép kinh doanh một số mặt hàng thuộc phạm vi quản lý chuyên ngành cho thương nhân đặt trụ sở và có cơ sở kinh doanh tại KCN.",
                    "Chủ trì, phối hợp với các phòng, đơn vị có liên quan xây dựng báo cáo tổng hợp định kỳ, báo cáo đột xuất về tình hình sản xuất kinh doanh của các doanh nghiệp trong Khu công nghệ cao và các Khu công nghiệp.",
                    "Báo cáo tổng hợp định kỳ, đột xuất tình hình hoạt động, công tác an ninh trật tự, an toàn giao thông, an toàn vệ sinh thực phẩm, an sinh xã hội tại khu công nghệ cao và các KCN.",
                    "Báo cáo định kỳ và đột xuất theo yêu cầu của Ban Chỉ huy thống nhất thành phố.",
                    "Thực hiện các công việc khác do Lãnh đạo Ban giao."
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-primary font-medium text-sm mt-1">{index + 1}.</span>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* IV. PHÒNG QUẢN LÝ QUY HOẠCH VÀ XÂY DỰNG */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">IV. PHÒNG QUẢN LÝ QUY HOẠCH VÀ XÂY DỰNG</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-foreground mb-3">1. Chức năng:</h3>
                    <p className="mb-4">Tham mưu cho Lãnh đạo Ban Quản lý Khu CNC và các KCN về các lĩnh vực: Quy hoạch, Kiến trúc, Xây dựng công trình, Đấu nối hạ tầng kỹ thuật và Đất đai, phòng cháy chữa cháy, cứu nạn cứu hộ.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-secondary-foreground mb-3">2. Nhiệm vụ:</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">a) Công tác quản lý Quy hoạch, Kiến trúc, Đấu nối hạ tầng kỹ thuật</h4>
                        <p className="text-sm text-muted-foreground ml-4">Tham mưu, đề xuất về việc tổ chức lập, thẩm định các loại quy hoạch; có ý kiến chấp thuận quy hoạch tổng mặt bằng, phương án kiến trúc và đấu nối hạ tầng kỹ thuật...</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">b) Công tác quản lý Xây dựng công trình</h4>
                        <p className="text-sm text-muted-foreground ml-4">Có ý kiến chấp thuận đối với thiết kế cơ sở; cấp Thỏa thuận thiết kế tổng mặt bằng; tổ chức kiểm tra xác nhận hoàn thành công trình...</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">c) Công tác quản lý Đất đai</h4>
                        <p className="text-sm text-muted-foreground ml-4">Tham mưu lập Quy hoạch, kế hoạch sử dụng đất chi tiết; thẩm định nhu cầu sử dụng đất; tham mưu quyết định giao đất, cho thuê đất...</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">d) Thực hiện các nhiệm vụ theo phân cấp, ủy quyền</h4>
                        <p className="text-sm text-muted-foreground ml-4">Điều chỉnh quy hoạch chi tiết xây dựng; phê duyệt nhiệm vụ và đồ án quy hoạch; cấp, điều chỉnh, gia hạn Giấy phép quy hoạch xây dựng...</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">đ) Theo dõi công tác phòng cháy chữa cháy, cứu nạn cứu hộ trong Khu CNC và các KCN.</h4>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">e) Thực hiện các công việc khác do Lãnh đạo Ban giao.</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* V. PHÒNG QUẢN LÝ MÔI TRƯỜNG, KHOA HỌC - CÔNG NGHỆ VÀ ƯƠM TẠO */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">V. PHÒNG QUẢN LÝ MÔI TRƯỜNG, KHOA HỌC - CÔNG NGHỆ VÀ ƯƠM TẠO</h2>
                
                <div className="space-y-3">
                  {[
                    "Hướng dẫn, kiểm tra chủ đầu tư xây dựng và kinh doanh hạ tầng KCN, các cơ sở sản xuất, kinh doanh, dịch vụ trong KCN thực hiện các quy định bảo vệ môi trường; Phát hiện và kịp thời báo cáo với cơ quan quản lý nhà nước có thẩm quyền để giải quyết, xử lý các hành vi vi phạm pháp luật về bảo vệ môi trường.",
                    "Định kỳ báo cáo công tác bảo vệ môi trường của khu kinh tế, KCN gửi Ủy ban nhân dân thành phố và Bộ Tài nguyên và Môi trường.",
                    "Công khai thông tin về bảo vệ môi trường KCN; tuyên truyền, phổ biến các văn bản quy phạm pháp luật về bảo vệ môi trường cho chủ đầu tư xây dựng và kinh doanh hạ tầng KCN.",
                    "Phối hợp với cơ quan chức năng giải quyết các tranh chấp về môi trường giữa các cơ sở sản xuất, kinh doanh dịch vụ trong KCN hoặc với các tổ chức, cá nhân ngoài phạm vi KCN.",
                    "Phối hợp kiểm tra, thanh tra và xử lý vi phạm về bảo vệ môi trường đối với các hoạt động của chủ đầu tư xây dựng và kinh doanh hạ tầng KCN và các cơ sở sản xuất, kinh doanh, dịch vụ trong KCN.",
                    "Tổ chức thẩm định và trình phê duyệt Báo cáo đánh giá tác động môi trường đối với dự án trong KCN theo ủy quyền của UBND thành phố.",
                    "Tổ chức đăng ký và xác nhận kế hoạch bảo vệ môi trường cho các đối tượng thuộc diện đăng ký trong KCN theo ủy quyền của Sở Tài nguyên và Môi trường hoặc của UBND nhân dân cấp quận.",
                    "Tổ chức thẩm định và trình phê duyệt đề án bảo vệ môi trường chi tiết, đề án bảo vệ môi trường đơn giản của các dự án trong KCN theo ủy quyền của cơ quan có thẩm quyền.",
                    "Tổ chức kiểm tra và trình Lãnh đạo Ban xác nhận hoàn thành công trình bảo vệ môi trường phục vụ giai đoạn vận hành dự án đối với dự án đầu tư trong KCN theo pháp luật về bảo vệ môi trường.",
                    "Thực hiện các công việc khác do Lãnh đạo Ban giao."
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-primary font-medium text-sm mt-1">{index + 1}.</span>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}; 