import { createClient } from '@supabase/supabase-js';

// Supabase configuration using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          password: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: number;
          title: string;
          description: string;
          image: string;
          technologies: string[];
          category: 'web' | 'mobile' | 'desktop';
          demo_url: string | null;
          code_url: string | null;
          proof_of_payment_image: string | null;
          client_id: string | null;
          service_type: string | null;
          payment_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          image: string;
          technologies: string[];
          category: 'web' | 'mobile' | 'desktop';
          demo_url?: string | null;
          code_url?: string | null;
          proof_of_payment_image?: string | null;
          client_id?: string | null;
          service_type?: string | null;
          payment_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          image?: string;
          technologies?: string[];
          category?: 'web' | 'mobile' | 'desktop';
          demo_url?: string | null;
          code_url?: string | null;
          proof_of_payment_image?: string | null;
          client_id?: string | null;
          service_type?: string | null;
          payment_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: number;
          service_type: string;
          date: string;
          proof_of_payment_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          service_type: string;
          date: string;
          proof_of_payment_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          service_type?: string;
          date?: string;
          proof_of_payment_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: number;
          title: string;
          description: string;
          features: string[];
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          features: string[];
          icon: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          features?: string[];
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_inquiries: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          project_type: string | null;
          service_type: string | null;
          budget_range: string | null;
          timeline: string | null;
          description: string;
          requested_features: string[] | null;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          project_type?: string | null;
          service_type?: string | null;
          budget_range?: string | null;
          timeline?: string | null;
          description: string;
          requested_features?: string[] | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          project_type?: string | null;
          service_type?: string | null;
          budget_range?: string | null;
          timeline?: string | null;
          description?: string;
          requested_features?: string[] | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: number;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Type the supabase client
export type SupabaseClient = typeof supabase;

// Type definition for contact form submission
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

// Helper function to submit contact form data
export async function submitContactForm(formData: {
  name: string;
  email: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([formData])
    .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}