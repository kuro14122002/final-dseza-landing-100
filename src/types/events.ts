// src/types/events.ts
// Type definitions for events

export interface Event {
  id: number;
  slug: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  content?: string;
  content_en?: string;
  startTime: string;
  endTime: string;
  location?: string;
  location_en?: string;
  imageUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isFeatured: boolean;
  maxParticipants?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  contactEmail?: string;
  contactPhone?: string;
  author?: {
    username: string;
    email?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface EventsResponse {
  events: Event[];
  totalEvents: number;
  totalPages: number;
  currentPage: number;
}

export interface EventFormData {
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  content?: string;
  content_en?: string;
  start_time: string;
  end_time: string;
  location?: string;
  location_en?: string;
  image_url?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  is_featured?: boolean;
  max_participants?: number;
  registration_required?: boolean;
  registration_deadline?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured?: boolean;
}

export interface EventSearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  featuredEvents: number;
} 