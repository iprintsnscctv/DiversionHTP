import { Room, Booking, Review, Inquiry, AdminStats } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

export const generateBookingRef = (): string => {
  return 'DVG-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
};

export const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'viganbooking.com' || window.location.hostname === 'www.viganbooking.com' || window.location.hostname.includes('viganbooking.com')))
  ? 'https://www.viganbooking.com/api'
  : '/api';

// Dedicated interceptor helper for logging full request URL and response status
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const fullUrl = typeof input === 'string' && input.startsWith('http') 
    ? input 
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${input}`;
  
  console.log(`[API Interceptor] Sending request: ${init?.method || 'GET'} -> ${fullUrl}`);
  
  try {
    const response = await fetch(input, init);
    console.log(`[API Interceptor] Received response: ${response.status} ${response.statusText} for ${fullUrl}`);
    return response;
  } catch (error) {
    console.error(`[API Interceptor] Network or request error for ${fullUrl}:`, error);
    throw error;
  }
}

// API Client calls
export const api = {
  async getRooms(params?: { category?: string; guests?: number; search?: string; availableDate?: string }): Promise<Room[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.guests) query.set('guests', String(params.guests));
      if (params?.search) query.set('search', params.search);
      if (params?.availableDate) query.set('availableDate', params.availableDate);

      const res = await apiFetch(`${API_BASE}/rooms?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('API fetch rooms error, using fallback:', err);
      const local = localStorage.getItem('diversion_vigan_properties');
      return local ? JSON.parse(local) : [];
    }
  },

  async getRoomById(id: string): Promise<Room | null> {
    try {
      const res = await apiFetch(`${API_BASE}/rooms/${id}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('API get room error:', err);
      return null;
    }
  },

  async createRoom(room: Partial<Room>): Promise<Room> {
    const res = await apiFetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
    if (!res.ok) throw new Error('Failed to create room');
    const json = await res.json();
    return json.data;
  },

  async updateRoom(id: string, room: Partial<Room>): Promise<Room> {
    const res = await apiFetch(`${API_BASE}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
    if (!res.ok) throw new Error('Failed to update room');
    const json = await res.json();
    return json.data;
  },

  async deleteRoom(id: string): Promise<void> {
    const res = await apiFetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete room');
  },

  async toggleRoomDate(id: string, date: string): Promise<string[]> {
    const res = await apiFetch(`${API_BASE}/rooms/${id}/toggle-date`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date })
    });
    if (!res.ok) throw new Error('Failed to toggle date');
    const json = await res.json();
    return json.bookedDates;
  },

  async getBookings(query?: string): Promise<Booking[]> {
    try {
      const q = query ? `?query=${encodeURIComponent(query)}` : '';
      const res = await apiFetch(`${API_BASE}/bookings${q}`);
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('API fetch bookings error:', err);
      const local = localStorage.getItem('diversion_vigan_bookings');
      return local ? JSON.parse(local) : [];
    }
  },

  async getBookingById(refId: string): Promise<Booking | null> {
    try {
      const res = await apiFetch(`${API_BASE}/bookings/${encodeURIComponent(refId)}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('API get booking error:', err);
      return null;
    }
  },

  async createBooking(bookingData: any): Promise<Booking> {
    const res = await apiFetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) throw new Error('Failed to create reservation');
    const json = await res.json();
    return json.data;
  },

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    const res = await apiFetch(`${API_BASE}/bookings/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update booking');
    const json = await res.json();
    return json.data;
  },

  async updateBookingStatus(id: string, status: string, paymentStatus?: string): Promise<Booking> {
    const res = await apiFetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus })
    });
    if (!res.ok) throw new Error('Failed to update booking status');
    const json = await res.json();
    return json.data;
  },

  async cancelBooking(id: string): Promise<void> {
    const res = await apiFetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to cancel booking');
  },

  async getReviews(status?: string): Promise<Review[]> {
    try {
      const q = status ? `?status=${encodeURIComponent(status)}` : '';
      const res = await apiFetch(`${API_BASE}/reviews${q}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  },

  async submitReview(reviewData: { roomId: string; guestName: string; rating: number; comment: string }): Promise<Review> {
    const res = await apiFetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    const json = await res.json();
    return json.data;
  },

  async updateReviewStatus(id: string, status: 'Approved' | 'Pending' | 'Rejected'): Promise<Review> {
    const res = await apiFetch(`${API_BASE}/reviews/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update review status');
    const json = await res.json();
    return json.data;
  },

  async deleteReview(id: string): Promise<void> {
    const res = await apiFetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete review');
  },

  async submitInquiry(inquiry: { name: string; email: string; phone: string; message: string; roomPreference?: string }): Promise<Inquiry> {
    const res = await apiFetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    if (!res.ok) throw new Error('Failed to submit inquiry');
    const json = await res.json();
    return json.data;
  },

  async getInquiries(): Promise<Inquiry[]> {
    try {
      const res = await apiFetch(`${API_BASE}/inquiries`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data;
    } catch (err) {
      return [];
    }
  },

  async getStats(): Promise<AdminStats> {
    const res = await apiFetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    const json = await res.json();
    return json.data;
  },

  async resetDemoData(): Promise<void> {
    await apiFetch(`${API_BASE}/reset`, { method: 'POST' });
  }
};
