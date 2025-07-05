import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

// Types
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'desktop';
  demoUrl?: string;
  codeUrl?: string;
  proofOfPaymentImage?: string;
  clientId?: string;
  serviceType?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: number;
  serviceType: string;
  date: string;
  proofOfPaymentImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type?: string;
  service_type?: string;
  budget_range?: string;
  timeline?: string;
  description: string;
  requested_features?: string[];
  social_media_links?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
    createdAt: string;
  };
}

// API Helper
class ApiService {
  private token: string | null = null;
  private user: any = null;

  constructor() {
    this.loadToken();
  }

  private loadToken(): void {
    this.token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  private saveAuth(token: string, user: any): void {
    this.token = token;
    this.user = user;
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
  }

  // Auth methods
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      // Get user from database
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .limit(1);

      if (error) throw new Error('Login failed');
      if (!users || users.length === 0) throw new Error('Invalid credentials');

      const user = users[0];
      
      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid credentials');

      // Generate a simple token (in production, use JWT)
      const token = btoa(`${user.id}:${user.username}:${Date.now()}`);
      
      const authResponse: AuthResponse = {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          createdAt: user.created_at
        }
      };

      this.saveAuth(token, authResponse.user);
      return authResponse;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async verifyToken(): Promise<{ user: any }> {
    if (!this.token || !this.user) {
      throw new Error('No authentication token');
    }
    return { user: this.user };
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch projects');
    
    return data.map(this.mapProjectFromDB);
  }

  async getProject(id: number): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Project not found');
    return this.mapProjectFromDB(data);
  }

  async uploadProjectImage(file: File): Promise<{ imageUrl: string }> {
    // Validate file
    if (!file) throw new Error('No file provided');
    if (file.size > 5 * 1024 * 1024) throw new Error('File size must be less than 5MB');
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
    }

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `project-${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExt}`;

      // First, ensure the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.id === 'project-images');
      
      if (!bucketExists) {
        console.warn('project-images bucket does not exist. Please run the supabase-setup.sql script.');
        return this.fallbackToBase64(file);
      }

      // Try to upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Handle specific error cases
        if (uploadError.message.includes('Bucket not found')) {
          console.warn('Bucket not found, falling back to base64 encoding');
          return this.fallbackToBase64(file);
        }
        
                 if (uploadError.message.includes('row-level security') || 
             uploadError.message.includes('policy') ||
             uploadError.message.includes('Unauthorized') ||
             uploadError.message.includes('403')) {
          console.warn('RLS policy issue detected. Please run the updated supabase-setup.sql script.');
          return this.fallbackToBase64(file);
        }
        
        // For other errors, try fallback
        console.warn('Upload failed, falling back to base64 encoding');
        return this.fallbackToBase64(file);
      }

      if (!uploadData) {
        console.warn('No upload data returned, falling back to base64 encoding');
        return this.fallbackToBase64(file);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      if (!publicUrl) {
        console.warn('Failed to get public URL, falling back to base64 encoding');
        return this.fallbackToBase64(file);
      }

      console.log('Successfully uploaded to Supabase Storage:', publicUrl);
      return { imageUrl: publicUrl };
    } catch (error) {
      console.error('Image upload error:', error);
      console.warn('Falling back to base64 encoding due to upload error');
      return this.fallbackToBase64(file);
    }
  }

  private fallbackToBase64(file: File): Promise<{ imageUrl: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log('Successfully converted to base64, length:', result.length);
        resolve({ imageUrl: result });
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(new Error('Failed to read file for base64 conversion'));
      };
      reader.readAsDataURL(file);
    });
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    if (!this.token) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('projects')
      .insert([this.mapProjectToDB(project)])
      .select()
      .single();

    if (error) throw new Error('Failed to create project');
    return this.mapProjectFromDB(data);
  }

  async updateProject(id: number, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project> {
    if (!this.token) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('projects')
      .update(this.mapProjectToDB(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error('Failed to update project');
    return this.mapProjectFromDB(data);
  }

  async deleteProject(id: number): Promise<void> {
    if (!this.token) throw new Error('Authentication required');

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Failed to delete project');
  }

  // Client methods
  async getClients(): Promise<Client[]> {
    if (!this.token) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error('Failed to fetch clients');
    return data.map(this.mapClientFromDB);
  }

  async getClient(id: number): Promise<Client> {
    if (!this.token) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Client not found');
    return this.mapClientFromDB(data);
  }

  async getNextClientId(): Promise<{ nextId: number }> {
    try {
      // Get the count of existing projects (since client numbers are based on projects)
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (error) throw new Error('Failed to get next client ID');
      return { nextId: (count || 0) + 1 };
    } catch (error) {
      console.error('Get next client ID error:', error);
      return { nextId: 1 };
    }
  }

  async getNextProjectId(): Promise<{ nextId: number }> {
    const { count, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (error) throw new Error('Failed to get next project ID');
    return { nextId: (count || 0) + 1 };
  }

  async renumberClients(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.token) throw new Error('Authentication required');

      // Get all clients ordered by creation date
      const { data: clients, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw new Error('Failed to fetch clients');

      // Update each client with sequential numbering
      const updates = clients.map((client, index) => ({
        id: client.id,
        client_number: index + 1
      }));

      // Update all clients with their new sequential numbers
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('clients')
          .update({ client_number: update.client_number })
          .eq('id', update.id);

        if (updateError) {
          console.error('Failed to update client:', update.id, updateError);
        }
      }

      return { success: true, message: 'Clients renumbered successfully' };
    } catch (error) {
      console.error('Renumber clients error:', error);
      return { success: false, message: 'Failed to renumber clients' };
    }
  }

  async renumberProjects(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.token) throw new Error('Authentication required');

      // Get all projects ordered by creation date
      const { data: projects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw new Error('Failed to fetch projects');

      // Update each project with sequential client numbering
      const updates = projects.map((project, index) => ({
        id: project.id,
        client_id: `Client #${index + 1}`
      }));

      // Update all projects with their new sequential client IDs
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ client_id: update.client_id })
          .eq('id', update.id);

        if (updateError) {
          console.error('Failed to update project:', update.id, updateError);
        }
      }

      return { success: true, message: 'Projects renumbered successfully' };
    } catch (error) {
      console.error('Renumber projects error:', error);
      return { success: false, message: 'Failed to renumber projects' };
    }
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    if (!this.token) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('clients')
      .insert([this.mapClientToDB(client)])
      .select()
      .single();

    if (error) throw new Error('Failed to create client');
    return this.mapClientFromDB(data);
  }

  async updateClient(id: number, updates: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Client> {
    if (!this.token) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('clients')
      .update(this.mapClientToDB(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error('Failed to update client');
    return this.mapClientFromDB(data);
  }

  async deleteClient(id: number): Promise<void> {
    if (!this.token) throw new Error('Authentication required');

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Failed to delete client');
  }

  // Inquiry methods
  async getInquiries(): Promise<ProjectInquiry[]> {
    if (!this.token) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('project_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch inquiries');
    return data.map(this.mapInquiryFromDB);
  }

  async getInquiry(id: number): Promise<ProjectInquiry> {
    if (!this.token) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('project_inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('Inquiry not found');
    return this.mapInquiryFromDB(data);
  }

  async updateInquiry(id: number, updates: { status?: string; admin_notes?: string }): Promise<ProjectInquiry> {
    if (!this.token) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('project_inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error('Failed to update inquiry');
    return this.mapInquiryFromDB(data);
  }

  async deleteInquiry(id: number): Promise<void> {
    if (!this.token) throw new Error('Authentication required');

    const { error } = await supabase
      .from('project_inquiries')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Failed to delete inquiry');
  }

  async getInquiryStats(): Promise<{
    total: number;
    pending: number;
    completed: number;
    in_progress: number;
    service_types: Array<{ service_type: string; count: number }>;
  }> {
    if (!this.token) throw new Error('Authentication required');

    const { data: allInquiries, error } = await supabase
      .from('project_inquiries')
      .select('status, service_type');

    if (error) throw new Error('Failed to fetch inquiry stats');

    const stats = {
      total: allInquiries.length,
      pending: allInquiries.filter(i => i.status === 'pending').length,
      completed: allInquiries.filter(i => i.status === 'completed').length,
      in_progress: allInquiries.filter(i => i.status === 'in_progress').length,
      service_types: [] as Array<{ service_type: string; count: number }>
    };

    // Count service types
    const serviceTypeCounts: Record<string, number> = {};
    allInquiries.forEach(inquiry => {
      if (inquiry.service_type) {
        serviceTypeCounts[inquiry.service_type] = (serviceTypeCounts[inquiry.service_type] || 0) + 1;
      }
    });

    stats.service_types = Object.entries(serviceTypeCounts)
      .map(([service_type, count]) => ({ service_type, count }))
      .sort((a, b) => b.count - a.count);

    return stats;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  // Helper methods for mapping between API and DB formats
  private mapProjectFromDB(dbProject: any): Project {
    return {
      id: dbProject.id,
      title: dbProject.title,
      description: dbProject.description,
      image: dbProject.image,
      technologies: dbProject.technologies,
      category: dbProject.category,
      demoUrl: dbProject.demo_url,
      codeUrl: dbProject.code_url,
      proofOfPaymentImage: dbProject.proof_of_payment_image,
      clientId: dbProject.client_id,
      serviceType: dbProject.service_type,
      paymentDate: dbProject.payment_date,
      createdAt: dbProject.created_at,
      updatedAt: dbProject.updated_at
    };
  }

  private mapProjectToDB(project: any): any {
    return {
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies,
      category: project.category,
      demo_url: project.demoUrl,
      code_url: project.codeUrl,
      proof_of_payment_image: project.proofOfPaymentImage,
      client_id: project.clientId,
      service_type: project.serviceType,
      payment_date: project.paymentDate
    };
  }

  private mapClientFromDB(dbClient: any): Client {
    return {
      id: dbClient.id,
      serviceType: dbClient.service_type,
      date: dbClient.date,
      proofOfPaymentImage: dbClient.proof_of_payment_image,
      createdAt: dbClient.created_at,
      updatedAt: dbClient.updated_at
    };
  }

  private mapClientToDB(client: any): any {
    return {
      service_type: client.serviceType,
      date: client.date,
      proof_of_payment_image: client.proofOfPaymentImage
    };
  }

  private mapInquiryFromDB(dbInquiry: any): ProjectInquiry {
    let socialMediaLinks = {};
    if (dbInquiry.social_media_links) {
      try {
        socialMediaLinks = typeof dbInquiry.social_media_links === 'string' 
          ? JSON.parse(dbInquiry.social_media_links) 
          : dbInquiry.social_media_links;
      } catch (error) {
        console.error('Error parsing social media links:', error);
        socialMediaLinks = {};
      }
    }

    return {
      id: dbInquiry.id,
      name: dbInquiry.name,
      email: dbInquiry.email,
      phone: dbInquiry.phone,
      company: dbInquiry.company,
      project_type: dbInquiry.project_type,
      service_type: dbInquiry.service_type,
      budget_range: dbInquiry.budget_range,
      timeline: dbInquiry.timeline,
      description: dbInquiry.description,
      requested_features: dbInquiry.requested_features || [],
      social_media_links: socialMediaLinks,
      status: dbInquiry.status,
      admin_notes: dbInquiry.admin_notes,
      created_at: dbInquiry.created_at,
      updated_at: dbInquiry.updated_at
    };
  }
}

export const api = new ApiService(); 