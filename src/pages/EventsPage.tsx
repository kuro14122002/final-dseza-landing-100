// src/pages/EventsPage.tsx
// Public page for displaying events

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ChevronRight, Filter, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Event, EventFilters } from '../types/events';
import { eventsService } from '../services/eventsService';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/dateFormatter';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 12
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();

  useEffect(() => {
    // Read params from URL
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');
    const q = searchParams.get('q');

    setFilters(prev => ({
      ...prev,
      page,
      status: status as Event['status'] || undefined
    }));

    if (q) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchEvents();
    if (filters.page === 1) {
      fetchFeaturedEvents();
    }
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      let response;
      if (searchTerm.trim()) {
        response = await eventsService.searchEvents({
          q: searchTerm,
          page: filters.page,
          limit: filters.limit
        });
      } else {
        response = await eventsService.getEvents(filters);
      }
      
      setEvents(response.events);
      setTotalPages(response.totalPages);
      setTotalEvents(response.totalEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedEvents = async () => {
    try {
      const featured = await eventsService.getFeaturedEvents(3);
      setFeaturedEvents(featured);
    } catch (error) {
      console.error('Error fetching featured events:', error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchParams(prev => {
        prev.set('q', searchTerm);
        prev.set('page', '1');
        return prev;
      });
    } else {
      setSearchParams(prev => {
        prev.delete('q');
        prev.set('page', '1');
        return prev;
      });
    }
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setSearchParams(prev => {
        prev.delete('status');
        prev.set('page', '1');
        return prev;
      });
      setFilters(prev => ({ ...prev, status: undefined, page: 1 }));
    } else {
      setSearchParams(prev => {
        prev.set('status', status);
        prev.set('page', '1');
        return prev;
      });
      setFilters(prev => ({ ...prev, status: status as Event['status'], page: 1 }));
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      prev.set('page', page.toString());
      return prev;
    });
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <Badge variant={variants[status]} className="text-xs">
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

  const getEventLocation = (event: Event) => {
    return language === 'en' && event.location_en ? event.location_en : event.location;
  };

  const EventCard: React.FC<{ event: Event; featured?: boolean }> = ({ event, featured = false }) => (
    <Card className={`hover:shadow-lg transition-shadow ${featured ? 'border-primary' : ''}`}>
      <CardContent className="p-0">
        <Link to={`/events/${event.slug}`}>
          <div className="relative">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={getEventTitle(event)}
                className={`w-full object-cover rounded-t-lg ${featured ? 'h-48' : 'h-40'}`}
              />
            ) : (
              <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center ${featured ? 'h-48' : 'h-40'}`}>
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            <div className="absolute top-3 left-3 flex gap-2">
              {event.isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  Nổi bật
                </Badge>
              )}
              {getStatusBadge(event.status)}
            </div>

            {event.registrationRequired && (
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="text-xs bg-white/90">
                  Yêu cầu đăng ký
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className={`font-semibold text-gray-900 dark:text-white line-clamp-2 ${featured ? 'text-lg' : 'text-base'}`}>
                {getEventTitle(event)}
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {getEventDescription(event)}
            </p>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <div>
                  <div>{formatDateTime(event.startTime)}</div>
                  {event.startTime !== event.endTime && (
                    <div className="text-xs">đến {formatDateTime(event.endTime)}</div>
                  )}
                </div>
              </div>

              {event.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{getEventLocation(event)}</span>
                </div>
              )}

              {event.maxParticipants && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Tối đa {event.maxParticipants} người</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {new Date(event.createdAt).toLocaleDateString('vi-VN')}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Đang tải danh sách sự kiện...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sự kiện
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Khám phá các sự kiện, hội thảo và hoạt động đặc biệt của Khu Công nghệ cao Đà Nẵng
          </p>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && filters.page === 1 && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Sự kiện nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} featured />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
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
            
            <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sự kiện</SelectItem>
                <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                <SelectItem value="completed">Đã kết thúc</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600 dark:text-gray-400">
            {searchTerm ? (
              <span>Tìm thấy {totalEvents} sự kiện cho "{searchTerm}"</span>
            ) : (
              <span>Tổng cộng {totalEvents} sự kiện</span>
            )}
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'Không tìm thấy sự kiện nào' : 'Chưa có sự kiện nào'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Hãy thử từ khóa khác hoặc bỏ bộ lọc' : 'Các sự kiện sẽ được cập nhật sớm nhất có thể'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(filters.page! - 1)}
                    disabled={filters.page === 1 || loading}
                  >
                    Trước
                  </Button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (filters.page! <= 3) {
                      page = i + 1;
                    } else if (filters.page! >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = filters.page! - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={page}
                        variant={page === filters.page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                        disabled={loading}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(filters.page! + 1)}
                    disabled={filters.page === totalPages || loading}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage; 