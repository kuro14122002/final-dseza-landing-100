import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LegalDocument, DOCUMENT_TYPES } from '@/types/documents';
import { fetchDocuments, deleteDocument } from '@/services/documentsService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
import { Skeleton } from '@/components/ui/skeleton';

// Icons
import { 
  Plus, 
  Search, 
  Eye, 
  FilePenLine, 
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  Download,
} from 'lucide-react';

const AdminDocumentListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<number>>(new Set());
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'created_at' | 'issued_date'>('created_at');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Load documents
  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetchDocuments({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: searchTerm || undefined,
        documentType: (selectedDocumentType && selectedDocumentType !== 'all') ? selectedDocumentType : undefined,
        sortBy,
        sortDirection
      });
      
      setDocuments(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Không thể tải danh sách văn bản');
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    loadDocuments();
  }, [currentPage, sortBy, sortDirection]);

  useEffect(() => {
    // Reset to first page when search/filter changes
    setCurrentPage(1);
  }, [searchTerm, selectedDocumentType]);

  useEffect(() => {
    // Load documents when page resets to 1
    if (currentPage === 1) {
      loadDocuments();
    }
  }, [searchTerm, selectedDocumentType]);

  // Filtered and sorted documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = !searchTerm || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedDocumentType === 'all' || !selectedDocumentType || doc.document_type === selectedDocumentType;
      
      return matchesSearch && matchesType;
    });
  }, [documents, searchTerm, selectedDocumentType]);

  // Event handlers
  const handleSort = (field: 'title' | 'created_at' | 'issued_date') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortDirection('DESC');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(new Set(documents.map(doc => doc.id)));
    } else {
      setSelectedDocuments(new Set());
    }
  };

  const handleSelectDocument = (documentId: number, checked: boolean) => {
    const newSelected = new Set(selectedDocuments);
    if (checked) {
      newSelected.add(documentId);
    } else {
      newSelected.delete(documentId);
    }
    setSelectedDocuments(newSelected);
  };

  const handleEdit = (document: LegalDocument) => {
    navigate(`/admin/documents/edit/${document.id}`);
  };

  const handleDelete = async (document: LegalDocument) => {
    try {
      await deleteDocument(document.id);
      toast.success('Đã xóa văn bản thành công');
      loadDocuments(); // Reload the list
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Không thể xóa văn bản');
    }
  };

  const handleCreateNew = () => {
    navigate('/admin/documents/new');
  };

  const handleDownload = (document: LegalDocument) => {
    const downloadUrl = `http://localhost/final-dseza-landing-85/api/${document.file_path}`;
    window.open(downloadUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDocumentTypeBadge = (type: string) => {
    const colorMap: Record<string, string> = {
      'Nghị định': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Thông tư': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Quyết định': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Chỉ thị': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Thông báo': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Hướng dẫn': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };

    return (
      <Badge className={cn(colorMap[type] || 'bg-gray-100 text-gray-800')}>
        {type}
      </Badge>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showPages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
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
      <Pagination className="mt-6">
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Văn bản Pháp lý
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quản lý các văn bản pháp lý, nghị định, thông tư
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm văn bản mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Loại văn bản" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại văn bản</SelectItem>
            {DOCUMENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedDocuments.size === documents.length && documents.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-1">
                      Tiêu đề
                      {sortBy === 'title' && (
                        sortDirection === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Loại văn bản</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('issued_date')}
                  >
                    <div className="flex items-center gap-1">
                      Ngày ban hành
                      {sortBy === 'issued_date' && (
                        sortDirection === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      Ngày tạo
                      {sortBy === 'created_at' && (
                        sortDirection === 'ASC' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      {searchTerm || selectedDocumentType ? 'Không tìm thấy văn bản nào phù hợp' : 'Chưa có văn bản nào'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDocuments.has(document.id)}
                          onCheckedChange={(checked) => handleSelectDocument(document.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {document.id}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium line-clamp-2">
                            {document.title}
                          </div>
                          {document.description && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                              {document.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getDocumentTypeBadge(document.document_type)}
                      </TableCell>
                      <TableCell>
                        {document.issued_date ? formatDate(document.issued_date) : '-'}
                      </TableCell>
                      <TableCell>
                        {formatDate(document.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(document)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Tải xuống</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(document)}
                                >
                                  <FilePenLine className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Chỉnh sửa</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa văn bản "{document.title}"?
                                  Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(document)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Xóa
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

          {/* Pagination */}
          {renderPagination()}

          {/* Summary */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} văn bản
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDocumentListPage; 