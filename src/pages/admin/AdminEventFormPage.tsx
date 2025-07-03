// src/pages/admin/AdminEventFormPage.tsx
// Admin page for creating and editing events

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Save, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from '../../components/ui/use-toast';
import { EventFormData } from '../../types/events';
import { eventsService } from '../../services/eventsService';

const AdminEventFormPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    content: '',
    content_en: '',
    start_time: '',
    end_time: '',
    location: '',
    location_en: '',
    image_url: '',
    status: 'upcoming',
    is_featured: false,
    max_participants: undefined,
    registration_required: false,
    registration_deadline: '',
    contact_email: '',
    contact_phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchEvent();
    }
  }, [id, isEditing]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const event = await eventsService.getEvent(id!);
      
      setFormData({
        title: event.title,
        title_en: event.title_en || '',
        description: event.description,
        description_en: event.description_en || '',
        content: event.content || '',
        content_en: event.content_en || '',
        start_time: formatDateTimeForInput(event.startTime),
        end_time: formatDateTimeForInput(event.endTime),
        location: event.location || '',
        location_en: event.location_en || '',
        image_url: event.imageUrl || '',
        status: event.status,
        is_featured: event.isFeatured,
        max_participants: event.maxParticipants || undefined,
        registration_required: event.registrationRequired,
        registration_deadline: event.registrationDeadline ? formatDateTimeForInput(event.registrationDeadline) : '',
        contact_email: event.contactEmail || '',
        contact_phone: event.contactPhone || ''
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin sự kiện",
        variant: "destructive"
      });
      navigate('/admin/events');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTimeForInput = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16);
  };

  const formatDateTimeForApi = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Thời gian bắt đầu là bắt buộc';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'Thời gian kết thúc là bắt buộc';
    }

    if (formData.start_time && formData.end_time) {
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);
      
      if (startTime >= endTime) {
        newErrors.end_time = 'Thời gian kết thúc phải sau thời gian bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const apiData = {
        ...formData,
        start_time: formatDateTimeForApi(formData.start_time),
        end_time: formatDateTimeForApi(formData.end_time),
        registration_deadline: formData.registration_deadline ? 
          formatDateTimeForApi(formData.registration_deadline) : undefined
      };

      if (isEditing) {
        await eventsService.updateEvent(parseInt(id!), apiData);
        toast({
          title: "Thành công",
          description: "Đã cập nhật sự kiện thành công"
        });
      } else {
        await eventsService.createEvent(apiData);
        toast({
          title: "Thành công",
          description: "Đã tạo sự kiện mới thành công"
        });
      }

      navigate('/admin/events');
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Lỗi",
        description: isEditing ? "Không thể cập nhật sự kiện" : "Không thể tạo sự kiện",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải thông tin sự kiện...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/events')}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề (Tiếng Việt) *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề sự kiện..."
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title_en">Tiêu đề (Tiếng Anh)</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => handleInputChange('title_en', e.target.value)}
                  placeholder="Enter event title..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Nhập mô tả sự kiện..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL hình ảnh</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Thời gian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start_time">Thời gian bắt đầu *</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  className={errors.start_time ? 'border-red-500' : ''}
                />
                {errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">Thời gian kết thúc *</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  className={errors.end_time ? 'border-red-500' : ''}
                />
                {errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Địa điểm và Liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Nhập địa điểm..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Email liên hệ</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Cài đặt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                    <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                    <SelectItem value="completed">Đã kết thúc</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_participants">Số lượng tham gia tối đa</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants || ''}
                  onChange={(e) => handleInputChange('max_participants', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Không giới hạn"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Sự kiện nổi bật</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="registration_required"
                  checked={formData.registration_required}
                  onCheckedChange={(checked) => handleInputChange('registration_required', checked)}
                />
                <Label htmlFor="registration_required">Yêu cầu đăng ký</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/events')}
            disabled={submitting}
          >
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
          <Button type="submit" disabled={submitting}>
            <Save className="w-4 h-4 mr-2" />
            {submitting ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEventFormPage;