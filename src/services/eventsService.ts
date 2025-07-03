// src/services/eventsService.ts
// Service for managing events

import { Event, EventsResponse, EventFormData, EventFilters, EventSearchParams } from '../types/events';

const API_BASE_URL = 'http://localhost/final-dseza-landing-85/api';

class EventsService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || data;
  }

  // Get all events with filters
  async getEvents(filters: EventFilters = {}): Promise<EventsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.featured !== undefined) queryParams.append('featured', filters.featured.toString());

    const response = await fetch(`${API_BASE_URL}/events?${queryParams}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<EventsResponse>(response);
  }

  // Get single event by ID or slug
  async getEvent(identifier: string | number): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${identifier}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<Event>(response);
  }

  // Get featured events
  async getFeaturedEvents(limit: number = 3): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events/featured?limit=${limit}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<Event[]>(response);
  }

  // Get upcoming events
  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events/upcoming?limit=${limit}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<Event[]>(response);
  }

  // Search events
  async searchEvents(params: EventSearchParams): Promise<EventsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', params.q);
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/events/search?${queryParams}`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<EventsResponse>(response);
  }

  // Create new event (Admin only)
  async createEvent(data: EventFormData): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse<Event>(response);
  }

  // Update event (Admin only)
  async updateEvent(id: number, data: Partial<EventFormData>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse<Event>(response);
  }

  // Delete event (Admin only)
  async deleteEvent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  // Helper method to format date for API
  formatDateForApi(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  // Helper method to parse API date
  parseApiDate(dateString: string): Date {
    return new Date(dateString);
  }

  // Helper method to check if event is active
  isEventActive(event: Event): boolean {
    const now = new Date();
    const startTime = this.parseApiDate(event.startTime);
    const endTime = this.parseApiDate(event.endTime);
    
    return now >= startTime && now <= endTime;
  }

  // Helper method to check if event is upcoming
  isEventUpcoming(event: Event): boolean {
    const now = new Date();
    const startTime = this.parseApiDate(event.startTime);
    
    return now < startTime;
  }

  // Helper method to check if event is past
  isEventPast(event: Event): boolean {
    const now = new Date();
    const endTime = this.parseApiDate(event.endTime);
    
    return now > endTime;
  }

  // Helper method to get event duration in hours
  getEventDuration(event: Event): number {
    const startTime = this.parseApiDate(event.startTime);
    const endTime = this.parseApiDate(event.endTime);
    
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  }

  // Helper method to get time until event starts
  getTimeUntilStart(event: Event): number {
    const now = new Date();
    const startTime = this.parseApiDate(event.startTime);
    
    return startTime.getTime() - now.getTime();
  }

  // Helper method to get status badge color
  getStatusColor(status: Event['status']): string {
    switch (status) {
      case 'upcoming':
        return 'blue';
      case 'ongoing':
        return 'green';
      case 'completed':
        return 'gray';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  }
}

export const eventsService = new EventsService();
export default eventsService; 