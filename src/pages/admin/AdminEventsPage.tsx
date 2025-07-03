// src/pages/admin/AdminEventsPage.tsx
// Admin page for managing events

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, MapPin, Clock, Users, Settings, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { toast } from '../../components/ui/use-toast';
import { Event, EventFilters } from '../../types/events';
import { eventsService } from '../../services/eventsService';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/dateFormatter';

const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsService.getEvents(filters);
      setEvents(response.events);
      setTotalPages(response.totalPages);
      setTotalEvents(response.totalEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sự kiện",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const response = await eventsService.searchEvents({
          q: searchTerm,
          page: filters.page,
          limit: filters.limit
        });
        setEvents(response.events);
        setTotalPages(response.totalPages);
        setTotalEvents(response.totalEvents);
      } catch (error) {
        console.error('Error searching events:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tìm kiếm sự kiện",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    } else {
      fetchEvents();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await eventsService.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
      setTotalEvents(totalEvents - 1);
      toast({
        title: "Thành công",
        description: "Đã xóa sự kiện thành công"
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa sự kiện",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: Event['status']) => {
    const variants = {
      upcoming: 'default',
      ongoing: 'secondary',
      completed: 'outline',
      cancelled: 'destructive'
    } as const;

    const labels = {
      upcoming: 'Sắp diễn ra',
      ongoing: 'Đang diễn ra',
      completed: 'Đã kết thúc',
      cancelled: 'Đã hủy'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const formatDateTime = (dateTime: string) => {
    return formatDate(dateTime, language, true);
  };

  const getEventTitle = (event: Event) => {
    return language === 'en' && event.title_en ? event.title_en : event.title;
  };

  const getEventDescription = (event: Event) => {
    return language === 'en' && event.description_en ? event.description_en : event.description;
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setFilters(prev => ({ ...prev, status: undefined, page: 1 }));
    } else {
      setFilters(prev => ({ ...prev, status: status as Event['status'], page: 1 }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải danh sách sự kiện...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quản lý Sự kiện
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tổng cộng {totalEvents} sự kiện
          </p>
        </div>
        <Link to="/admin/events/new">
          <Button className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Thêm sự kiện mới
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm sự kiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Select onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                <SelectItem value="completed">Đã kết thúc</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid gap-6">
        {events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Không có sự kiện nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Hãy tạo sự kiện đầu tiên của bạn
              </p>
              <Link to="/admin/events/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sự kiện mới
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Event Image */}
                  <div className="lg:w-48 h-32 lg:h-auto">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={getEventTitle(event)}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {getEventTitle(event)}
                        </h3>
                        {event.isFeatured && (
                          <Badge variant="secondary">Nổi bật</Badge>
                        )}
                        {getStatusBadge(event.status)}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {getEventDescription(event)}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <div>
                          <div>Bắt đầu: {formatDateTime(event.startTime)}</div>
                          <div>Kết thúc: {formatDateTime(event.endTime)}</div>
                        </div>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      
                      {event.maxParticipants && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Tối đa {event.maxParticipants} người</span>
                        </div>
                      )}
                      
                      {event.registrationRequired && (
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <Settings className="w-4 h-4 mr-2" />
                          <span>Yêu cầu đăng ký</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/events/${event.slug}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa sự kiện "{getEventTitle(event)}"? 
                              Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(event.id)}
                              disabled={deletingId === event.id}
                            >
                              {deletingId === event.id ? 'Đang xóa...' : 'Xóa'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={filters.page === 1}
            >
              Trước
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === filters.page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(filters.page! + 1)}
              disabled={filters.page === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage; 