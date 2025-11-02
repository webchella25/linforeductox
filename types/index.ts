// User
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: Date;
}

// Service
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  duration_minutes: number;
  price?: number;
  active: boolean;
  category: 'corporal' | 'facial' | 'acupuntura';
  image_url?: string;
  benefits?: string[];
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

// Working Hours
export interface WorkingHours {
  id: string;
  day_of_week: number; // 0-6 (Domingo-Sábado)
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
  is_active: boolean;
}

// Blocked Date
export interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
  all_day: boolean;
  start_time?: string;
  end_time?: string;
  created_at: Date;
}

// Booking
export interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_id: string;
  service?: Service; // Populated
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  admin_notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Testimonial
export interface Testimonial {
  id: string;
  client_name: string;
  client_email: string;
  service_id?: string;
  service?: Service;
  rating: number;
  text: string;
  photo_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  display_order: number;
  created_at: Date;
  approved_at?: Date;
}

// Site Content
export interface SiteContent {
  id: string;
  page: string;
  section: string;
  content: string;
  content_type: 'text' | 'html' | 'json';
  updated_at: Date;
}

// Contact Info
export interface ContactInfo {
  id: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  whatsapp_number?: string;
  instagram_url?: string;
  facebook_url?: string;
  maps_embed_url?: string;
  buffer_minutes: number;
  updated_at: Date;
}