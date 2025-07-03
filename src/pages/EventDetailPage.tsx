// src/pages/EventDetailPage.tsx
// Public page for displaying event details

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Mail, Phone, ArrowLeft, Share2, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Event } from '../types/events';
import { eventsService } from '../services/eventsService';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/dateFormatter';
import SEOHead from '../components/SEO/SEOHead';

const EventDetailPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationDeadlinePassed, setRegistrationDeadlinePassed] = useState(false);

  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();

  useEffect(() => {
    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  useEffect(() => {
    if (event?.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline);
      const now = new Date();
      setRegistrationDeadlinePassed(now > deadline);
    }
  }, [event]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventsService.getEvent(slug!);
      setEvent(eventData);
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Không thể tải thông tin sự kiện');
    } finally {
      setLoading(false);
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

  const getEventContent = (event: Event) => {
    return language === 'en' && event.content_en ? event.content_en : event.content;
  };

  const getEventLocation = (event: Event) => {
    return language === 'en' && event.location_en ? event.location_en : event.location;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event ? getEventTitle(event) : '',
        text: event ? getEventDescription(event) : '',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  const isEventActive = () => {
    if (!event) return false;
    return eventsService.isEventActive(event);
  };

  const isEventUpcoming = () => {
    if (!event) return false;
    return eventsService.isEventUpcoming(event);
  };

  const isEventPast = () => {
    if (!event) return false;
    return eventsService.isEventPast(event);
  };

  const getTimeUntilStart = () => {
    if (!event || !isEventUpcoming()) return null;
    const timeLeft = eventsService.getTimeUntilStart(event);
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `Còn ${days} ngày ${hours} giờ`;
    } else if (hours > 0) {
      return `Còn ${hours} giờ`;
    } else {
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return `Còn ${minutes} phút`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Đang tải thông tin sự kiện...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Không tìm thấy sự kiện
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || 'Sự kiện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa'}
            </p>
            <Link to="/events">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách sự kiện
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SEO Head */}
      <SEOHead
        title={getEventTitle(event)}
        description={getEventDescription(event)}
        keywords={`sự kiện, event, DSEZA, Đà Nẵng, ${getEventTitle(event)}`}
        image={event.imageUrl}
        type="event"
        eventStartDate={event.startDateTime}
        eventEndDate={event.endDateTime}
        eventLocation={getEventLocation(event)}
        eventPrice={event.price}
        eventStatus={event.status === 'upcoming' ? 'scheduled' : 
                   event.status === 'ongoing' ? 'scheduled' :
                   event.status === 'completed' ? 'scheduled' : 'cancelled'}
        organizationName="DSEZA - Ban Quản lý Khu công nghệ cao và các Khu công nghiệp Đà Nẵng"
        organizationUrl="https://dseza.danang.gov.vn"
        organizationLogo="https://dseza.danang.gov.vn/media/lightlogo3.png"
        organizationAddress="Đà Nẵng, Việt Nam"
        organizationPhone="0236.3847.707"
        organizationEmail="info@dseza.danang.gov.vn"
       />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/events">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách sự kiện
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            {event.imageUrl && (
              <div className="mb-8">
                <img
                  src={event.imageUrl}
                  alt={getEventTitle(event)}
                  className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Event Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {event.isFeatured && (
                  <Badge variant="secondary">Nổi bật</Badge>
                )}
                {getStatusBadge(event.status)}
                {event.registrationRequired && (
                  <Badge variant="outline">Yêu cầu đăng ký</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {getEventTitle(event)}
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {getEventDescription(event)}
              </p>

              {/* Event Actions */}
              <div className="flex flex-wrap gap-3">
                {event.registrationRequired && isEventUpcoming() && !registrationDeadlinePassed && (
                  <Button size="lg">
                    Đăng ký tham gia
                  </Button>
                )}
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Quan tâm
                </Button>
              </div>
            </div>

            {/* Event Content */}
            {getEventContent(event) && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-gray dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: getEventContent(event)! }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Thông tin sự kiện
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                    Trạng thái
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(event.status)}
                    {isEventUpcoming() && getTimeUntilStart() && (
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        {getTimeUntilStart()}
                      </span>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Date & Time */}
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                    Thời gian
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                    <div className="text-sm">
                      <div className="font-medium">Bắt đầu: {formatDateTime(event.startTime)}</div>
                      <div>Kết thúc: {formatDateTime(event.endTime)}</div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {event.location && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Địa điểm
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                        <span className="text-sm">{getEventLocation(event)}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Participants */}
                {event.maxParticipants && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Số lượng tham gia
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm">Tối đa {event.maxParticipants} người</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Registration Deadline */}
                {event.registrationRequired && event.registrationDeadline && (
                  <>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Hạn đăng ký
                      </div>
                      <div className={`text-sm ${registrationDeadlinePassed ? 'text-red-600 dark:text-red-400' : ''}`}>
                        {formatDateTime(event.registrationDeadline)}
                        {registrationDeadlinePassed && (
                          <span className="block text-xs text-red-600 dark:text-red-400">
                            Đã hết hạn đăng ký
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact Card */}
            {(event.contactEmail || event.contactPhone) && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.contactEmail && (
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Email
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={`mailto:${event.contactEmail}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {event.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  {event.contactPhone && (
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Điện thoại
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={`tel:${event.contactPhone}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {event.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Share Card */}
            <Card>
              <CardHeader>
                <CardTitle>Chia sẻ sự kiện</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Chia sẻ sự kiện này với bạn bè và đồng nghiệp
                </p>
                <Button onClick={handleShare} className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Chia sẻ sự kiện
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage; 