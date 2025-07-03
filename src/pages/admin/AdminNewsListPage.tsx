import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminNewsArticle, NewsCategory } from '@/types/news';
import { useTranslation } from '@/utils/translations';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import AdminTableLayout from '@/components/admin/AdminTableLayout';

// Shadcn/UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

// Icons
import { 
  Plus, 
  Search, 
  Eye, 
  FilePenLine, 
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// Mock Categories
const mockCategories: NewsCategory[] = [
  { 
    id: "investment", 
    slug: "dau-tu-hop-tac-quoc-te", 
    name: "Đầu tư – Hợp tác quốc tế", 
    nameEn: "Investment – Int'l Cooperation" 
  },
  { 
    id: "training", 
    slug: "dao-tao-uom-tao-khoi-nghiep", 
    name: "Đào tạo, Ươm tạo khởi nghiệp", 
    nameEn: "Training & Startup Incubation" 
  },
  { 
    id: "digital", 
    slug: "chuyen-doi-so", 
    name: "Chuyển đổi số", 
    nameEn: "Digital Transformation" 
  },
  { 
    id: "activities", 
    slug: "hoat-dong-ban-quan-ly", 
    name: "Hoạt động Ban quản lý", 
    nameEn: "Management Board Activities" 
  },
  { 
    id: "other", 
    slug: "tin-khac", 
    name: "Tin khác", 
    nameEn: "Other News" 
  }
];

// Mock Data - Extended NewsArticle with admin fields
const mockAdminArticles: AdminNewsArticle[] = [
  {
    id: "inv1",
    slug: "dseza-thu-hut-fdi-100-trieu-usd",
    title: "DSEZA thu hút thành công dự án FDI 100 triệu USD từ Nhật Bản",
    titleEn: "DSEZA successfully attracts $100M FDI project from Japan",
    excerpt: "Dự án tập trung vào sản xuất linh kiện điện tử công nghệ cao, dự kiến tạo ra hàng ngàn việc làm cho người lao động địa phương.",
    excerptEn: "The project focuses on high-tech electronic component manufacturing, expected to create thousands of jobs for local workers.",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    publishDate: "2025-05-20T00:00:00Z",
    category: mockCategories[0],
    isFeatured: true,
    readingTime: "5 phút",
    readingTimeEn: "5 min",
    status: 'published',
    author: "Nguyễn Văn An",
    createdDate: "2025-05-20T08:00:00Z",
    updatedDate: "2025-05-20T10:30:00Z",
  },
  {
    id: "inv2",
    slug: "hoi-thao-xuc-tien-dau-tu-singapore",
    title: "Hội thảo xúc tiến đầu tư vào Đà Nẵng tổ chức tại Singapore",
    titleEn: "Da Nang investment promotion workshop held in Singapore",
    excerpt: "Nhiều nhà đầu tư Singapore bày tỏ sự quan tâm sâu sắc đến môi trường đầu tư tại các KCN, KCNC Đà Nẵng.",
    excerptEn: "Many Singaporean investors expressed deep interest in the investment environment in Da Nang's industrial zones.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    publishDate: "2025-05-18T00:00:00Z",
    category: mockCategories[0],
    isFeatured: false,
    readingTime: "3 phút",
    readingTimeEn: "3 min",
    status: 'published',
    author: "Trần Thị Bình",
    createdDate: "2025-05-18T09:15:00Z",
  },
  {
    id: "tr1",
    slug: "khoi-dong-chuong-trinh-uom-tao-khoi-nghiep",
    title: "Khởi động chương trình ươm tạo khởi nghiệp công nghệ DSEZA 2025",
    titleEn: "DSEZA Technology Startup Incubation Program 2025 launched",
    excerpt: "Chương trình năm nay dự kiến sẽ chọn 10 dự án tiềm năng để hỗ trợ phát triển sản phẩm.",
    excerptEn: "This year's program is expected to select 10 potential projects to support product development.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    publishDate: "2025-05-19T00:00:00Z",
    category: mockCategories[1],
    isFeatured: false,
    readingTime: "6 phút",
    readingTimeEn: "6 min",
    status: 'draft',
    author: "Lê Minh Cường",
    createdDate: "2025-05-19T07:30:00Z",
  },
  {
    id: "dig1",
    slug: "chuyen-doi-so-trong-quan-ly-khu-cong-nghiep",
    title: "Chuyển đổi số trong quản lý khu công nghiệp: Thành tựu và triển vọng",
    titleEn: "Digital transformation in industrial zone management: Achievements and prospects",
    excerpt: "DSEZA đã triển khai thành công nhiều giải pháp công nghệ số trong quản lý và vận hành các khu công nghiệp.",
    excerptEn: "DSEZA has successfully deployed many digital technology solutions in industrial zone management and operations.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    publishDate: "2025-05-17T00:00:00Z",
    category: mockCategories[2],
    isFeatured: false,
    readingTime: "4 phút",
    readingTimeEn: "4 min",
    status: 'pending',
    author: "Phạm Quốc Dũng",
    createdDate: "2025-05-17T14:20:00Z",
  },
  {
    id: "act1",
    slug: "le-ky-niem-20-nam-thanh-lap-dseza",
    title: "Lễ kỷ niệm 20 năm thành lập DSEZA: Nhìn lại chặng đường phát triển",
    titleEn: "DSEZA 20th anniversary celebration: Looking back at the development journey",
    excerpt: "Buổi lễ đã điểm lại những thành tựu đáng tự hào trong 20 năm qua và đề ra định hướng phát triển tương lai.",
    excerptEn: "The ceremony reviewed proud achievements over the past 20 years and outlined future development directions.",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    publishDate: "2025-05-16T00:00:00Z",
    category: mockCategories[3],
    isFeatured: true,
    readingTime: "5 phút",
    readingTimeEn: "5 min",
    status: 'published',
    author: "Hoàng Thị Duyên",
    createdDate: "2025-05-16T11:45:00Z",
  },
  {
    id: "other1",
    slug: "chuong-trinh-xanh-hoa-moi-truong-khu-cong-nghiep",
    title: "Chương trình xanh hóa môi trường tại các khu công nghiệp Đà Nẵng",
    titleEn: "Environmental greening program at Da Nang industrial zones",
    excerpt: "Các khu công nghiệp đang tích cực triển khai các dự án bảo vệ môi trường và phát triển bền vững.",
    excerptEn: "Industrial zones are actively implementing environmental protection and sustainable development projects.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    publishDate: "2025-05-15T00:00:00Z",
    category: mockCategories[4],
    isFeatured: false,
    readingTime: "4 phút",
    readingTimeEn: "4 min",
    status: 'published',
    author: "Vũ Thanh Hải",
    createdDate: "2025-05-15T13:10:00Z",
  },
  // Additional mock articles for pagination testing
  {
    id: "inv3",
    slug: "du-an-nang-luong-tai-tao-tai-kcnc-da-nang",
    title: "Dự án năng lượng tái tạo quy mô lớn tại KCNC Đà Nẵng",
    titleEn: "Large-scale renewable energy project at Da Nang High-Tech Park",
    excerpt: "Dự án pin mặt trời 50MW sẽ cung cấp năng lượng sạch cho toàn bộ khu công nghệ cao.",
    excerptEn: "The 50MW solar panel project will provide clean energy for the entire high-tech park.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
    publishDate: "2025-05-14T00:00:00Z",
    category: mockCategories[0],
    isFeatured: false,
    readingTime: "3 phút",
    readingTimeEn: "3 min",
    status: 'published',
    author: "Đặng Văn Phong",
    createdDate: "2025-05-14T16:25:00Z",
  },
  {
    id: "tr2",
    slug: "hoi-thao-ket-noi-doanh-nghiep-startup",
    title: "Hội thảo kết nối doanh nghiệp và startup công nghệ",
    titleEn: "Workshop connecting businesses and technology startups",
    excerpt: "Sự kiện tạo cơ hội giao lưu, hợp tác giữa các doanh nghiệp lớn và startup trong khu vực.",
    excerptEn: "The event creates opportunities for exchange and cooperation between large enterprises and startups in the region.",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
    publishDate: "2025-05-13T00:00:00Z",
    category: mockCategories[1],
    isFeatured: false,
    readingTime: "4 phút",
    readingTimeEn: "4 min",
    status: 'draft',
    author: "Ngô Thị Hương",
    createdDate: "2025-05-13T10:00:00Z",
  },
  {
    id: "dig2",
    slug: "he-thong-quan-ly-thong-minh-dseza",
    title: "Hệ thống quản lý thông minh DSEZA: Nâng cao hiệu quả vận hành",
    titleEn: "DSEZA smart management system: Improving operational efficiency",
    excerpt: "Hệ thống tích hợp AI và IoT giúp tối ưu hóa quy trình quản lý và dịch vụ cho doanh nghiệp.",
    excerptEn: "The system integrates AI and IoT to optimize management processes and services for businesses.",
    imageUrl: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0",
    publishDate: "2025-05-12T00:00:00Z",
    category: mockCategories[2],
    isFeatured: false,
    readingTime: "5 phút",
    readingTimeEn: "5 min",
    status: 'pending',
    author: "Bùi Minh Tuấn",
    createdDate: "2025-05-12T09:30:00Z",
  },
  {
    id: "act2",
    slug: "cuoc-hop-ban-giam-doc-thang-5",
    title: "Cuộc họp Ban Giám đốc tháng 5: Đánh giá kết quả Q1 và kế hoạch Q2",
    titleEn: "May Board of Directors meeting: Q1 results evaluation and Q2 planning",
    excerpt: "Ban Giám đốc đã đánh giá tích cực kết quả quý 1 và phê duyệt kế hoạch phát triển quý 2.",
    excerptEn: "The Board of Directors positively evaluated Q1 results and approved Q2 development plans.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    publishDate: "2025-05-11T00:00:00Z",
    category: mockCategories[3],
    isFeatured: false,
    readingTime: "3 phút",
    readingTimeEn: "3 min",
    status: 'published',
    author: "Lý Văn Kiên",
    createdDate: "2025-05-11T15:45:00Z",
  },
  {
    id: "other2",
    slug: "le-hoi-van-hoa-doanh-nghiep-2025",
    title: "Lễ hội văn hóa doanh nghiệp 2025: Tôn vinh tinh thần đoàn kết",
    titleEn: "2025 Corporate Culture Festival: Honoring the spirit of unity",
    excerpt: "Lễ hội quy tụ hàng nghìn CBCNV từ các doanh nghiệp trong khu vực tham gia các hoạt động văn hóa.",
    excerptEn: "The festival brings together thousands of employees from regional businesses to participate in cultural activities.",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    publishDate: "2025-05-10T00:00:00Z",
    category: mockCategories[4],
    isFeatured: false,
    readingTime: "4 phút",
    readingTimeEn: "4 min",
    status: 'published',
    author: "Cao Thị Linh",
    createdDate: "2025-05-10T12:20:00Z",
  },
  {
    id: "inv4",
    slug: "hop-tac-dai-hoc-cambridge-nghien-cuu-ai",
    title: "Hợp tác với Đại học Cambridge trong nghiên cứu AI và Machine Learning",
    titleEn: "Partnership with Cambridge University in AI and Machine Learning research",
    excerpt: "Thỏa thuận hợp tác sẽ mở ra cơ hội nghiên cứu và phát triển công nghệ AI tại Việt Nam.",
    excerptEn: "The partnership agreement will open opportunities for AI technology research and development in Vietnam.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    publishDate: "2025-05-09T00:00:00Z",
    category: mockCategories[0],
    isFeatured: true,
    readingTime: "6 phút",
    readingTimeEn: "6 min",
    status: 'published',
    author: "Đinh Quang Minh",
    createdDate: "2025-05-09T08:15:00Z",
  },
  {
    id: "tr3",
    slug: "chuong-trinh-dao-tao-ky-nang-so",
    title: "Chương trình đào tạo kỹ năng số cho CBCNV các KCN",
    titleEn: "Digital skills training program for industrial zone employees",
    excerpt: "Chương trình nhằm nâng cao năng lực số hóa của đội ngũ cán bộ công nhân viên.",
    excerptEn: "The program aims to enhance the digitalization capabilities of the staff and workforce.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    publishDate: "2025-05-08T00:00:00Z",
    category: mockCategories[1],
    isFeatured: false,
    readingTime: "4 phút",
    readingTimeEn: "4 min",
    status: 'draft',
    author: "Hà Thị Loan",
    createdDate: "2025-05-08T14:00:00Z",
  },
  {
    id: "dig3",
    slug: "ung-dung-blockchain-quan-ly-supply-chain",
    title: "Ứng dụng Blockchain trong quản lý chuỗi cung ứng tại các KCN",
    titleEn: "Blockchain application in supply chain management at industrial zones",
    excerpt: "Công nghệ blockchain được triển khai để tăng tính minh bạch và hiệu quả của chuỗi cung ứng.",
    excerptEn: "Blockchain technology is deployed to increase transparency and efficiency of the supply chain.",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    publishDate: "2025-05-07T00:00:00Z",
    category: mockCategories[2],
    isFeatured: false,
    readingTime: "5 phút",
    readingTimeEn: "5 min",
    status: 'pending',
    author: "Trịnh Văn Đức",
    createdDate: "2025-05-07T11:30:00Z",
  },
  {
    id: "act3",
    slug: "tham-quan-khu-trung-tam-vi-mach",
    title: "Tham quan Khu Trung tâm Vi mạch bán dẫn và Trí tuệ nhân tạo",
    titleEn: "Visit to the Semiconductor and Artificial Intelligence Center",
    excerpt: "Đoàn khách quốc tế đến tham quan và tìm hiểu về tiềm năng phát triển công nghệ cao tại Đà Nẵng.",
    excerptEn: "International delegation visits to explore high-tech development potential in Da Nang.",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
    publishDate: "2025-05-06T00:00:00Z",
    category: mockCategories[3],
    isFeatured: false,
    readingTime: "3 phút",
    readingTimeEn: "3 min",
    status: 'published',
    author: "Võ Thị Mai",
    createdDate: "2025-05-06T16:10:00Z",
  },
  {
    id: "other3",
    slug: "giai-thuong-doanh-nghiep-xuat-sac-2025",
    title: "Giải thưởng Doanh nghiệp xuất sắc 2025: Vinh danh 15 DN tiêu biểu",
    titleEn: "2025 Outstanding Enterprise Award: Honoring 15 exemplary businesses",
    excerpt: "Lễ trao giải ghi nhận những đóng góp tích cực của các doanh nghiệp cho sự phát triển chung của khu vực.",
    excerptEn: "The award ceremony recognizes the positive contributions of businesses to the overall development of the region.",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    publishDate: "2025-05-05T00:00:00Z",
    category: mockCategories[4],
    isFeatured: false,
    readingTime: "4 phút",
    readingTimeEn: "4 min",
    status: 'published',
    author: "Phan Minh Hạnh",
    createdDate: "2025-05-05T13:45:00Z",
  },
];

const AdminNewsListPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // State for table management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<'title' | 'createdDate'>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  // Filter and search logic
  const filteredArticles = useMemo(() => {
    let filtered = mockAdminArticles.filter(article => {
      // Search by title
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (article.titleEn && article.titleEn.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by category
      const matchesCategory = selectedCategory === 'all' || article.category.id === selectedCategory;
      
      // Filter by status
      const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort articles
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;
      
      if (sortField === 'title') {
        aValue = a.title;
        bValue = b.title;
      } else {
        aValue = new Date(a.createdDate);
        bValue = new Date(b.createdDate);
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedStatus, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  // Handler functions
  const handleSort = (field: 'title' | 'createdDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(currentArticles.map(article => article.id));
    } else {
      setSelectedArticles([]);
    }
  };

  const handleSelectArticle = (articleId: string, checked: boolean) => {
    if (checked) {
      setSelectedArticles([...selectedArticles, articleId]);
    } else {
      setSelectedArticles(selectedArticles.filter(id => id !== articleId));
    }
  };

  const handlePreview = (article: AdminNewsArticle) => {
    console.log('Preview article:', article.id);
    toast.info(t('admin.newsList.toast.previewWIP'));
  };

  const handleEdit = (article: AdminNewsArticle) => {
    navigate(`/admin/news/edit/${article.id}`);
  };

  const handleDelete = (article: AdminNewsArticle) => {
    console.log('Delete article:', article.id);
    toast.success(t('admin.newsList.toast.deleteSuccess'));
  };

  const handleCreateNew = () => {
    navigate('/admin/news/create');
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'published' ? 'default' : 
                   status === 'draft' ? 'secondary' : 'outline';
    
    return (
      <Badge variant={variant}>
        {t(`admin.newsList.status.${status}`)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={cn(
                "cursor-pointer",
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
          
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(1)} className="cursor-pointer">
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && <PaginationEllipsis />}
            </>
          )}
          
          {pages}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(totalPages)} className="cursor-pointer">
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className={cn(
                "cursor-pointer",
                currentPage === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const breadcrumbs = [
    { label: 'Quản trị nội dung', href: '/admin/dashboard' },
    { label: 'Tin tức & Bài viết' }
  ];

  const filters = [
    {
      label: 'Danh mục',
      value: selectedCategory,
      onValueChange: setSelectedCategory,
      options: [
        { label: 'Tất cả danh mục', value: 'all' },
        ...mockCategories.map(category => ({ label: category.name, value: category.id }))
      ]
    },
    {
      label: 'Trạng thái',
      value: selectedStatus,
      onValueChange: setSelectedStatus,
      options: [
        { label: 'Tất cả trạng thái', value: 'all' },
        { label: 'Đã xuất bản', value: 'published' },
        { label: 'Bản nháp', value: 'draft' },
        { label: 'Chờ duyệt', value: 'pending' }
      ]
    },
    {
      label: 'Số lượng',
      value: itemsPerPage.toString(),
      onValueChange: (value: string) => setItemsPerPage(Number(value)),
      options: [
        { label: '10', value: '10' },
        { label: '20', value: '20' },
        { label: '50', value: '50' }
      ]
    }
  ];

  return (
    <AdminPageLayout
      title={t('admin.newsList.titlePage')}
      description="Quản lý danh sách tin tức và bài viết"
      breadcrumbs={breadcrumbs}
      actions={
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t('admin.newsList.button.createNew')}
        </Button>
      }
    >
      <AdminTableLayout
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t('admin.newsList.searchPlaceholder')}
        filters={filters}
        totalItems={filteredArticles.length}
        selectedItems={selectedArticles.length}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={currentArticles.length > 0 && selectedArticles.length === currentArticles.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    {t('admin.newsList.table.header.title')}
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>{t('admin.newsList.table.header.category')}</TableHead>
                <TableHead>{t('admin.newsList.table.header.author')}</TableHead>
                <TableHead>{t('admin.newsList.table.header.status')}</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleSort('createdDate')}
                >
                  <div className="flex items-center gap-2">
                    {t('admin.newsList.table.header.date')}
                    {sortField === 'createdDate' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>{t('admin.newsList.table.header.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {t('admin.newsList.noNewsFound')}
                  </TableCell>
                </TableRow>
              ) : (
                currentArticles.map((article) => (
                  <TableRow key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedArticles.includes(article.id)}
                        onCheckedChange={(checked) => handleSelectArticle(article.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={article.title}>
                        {article.title}
                      </div>
                    </TableCell>
                    <TableCell>{article.category.name}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{getStatusBadge(article.status)}</TableCell>
                    <TableCell>{formatDate(article.createdDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePreview(article)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {t('admin.newsList.actions.preview')}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(article)}
                              >
                                <FilePenLine className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {t('admin.newsList.actions.edit')}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <AlertDialog>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                {t('admin.newsList.actions.delete')}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('admin.newsList.deleteConfirm.title')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('admin.newsList.deleteConfirm.message')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('admin.newsList.deleteConfirm.cancelButton')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(article)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t('admin.newsList.deleteConfirm.confirmButton')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination and Info */}
        {filteredArticles.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
            <div className="text-sm text-muted-foreground">
              {t('admin.newsList.pagination.showing', {
                from: startIndex + 1,
                to: Math.min(endIndex, filteredArticles.length),
                total: filteredArticles.length
              })}
            </div>
            {totalPages > 1 && renderPagination()}
          </div>
        )}
      </AdminTableLayout>
    </AdminPageLayout>
  );
};

export default AdminNewsListPage; 