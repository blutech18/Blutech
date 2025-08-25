import { supabase } from '../lib/supabase';

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
    error?: string;
  };
  services: {
    heartbeat: boolean;
    email: boolean;
  };
  uptime: number;
  version: string;
}

class HealthCheckService {
  private startTime = Date.now();
  private readonly VERSION = '1.0.0';

  /**
   * Perform a comprehensive health check
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString();
    const uptime = Date.now() - this.startTime;

    // Check database connectivity
    const dbCheck = await this.checkDatabase();

    // Check other services
    const servicesCheck = await this.checkServices();

    return {
      status: dbCheck.status === 'connected' ? 'healthy' : 'unhealthy',
      timestamp,
      database: dbCheck,
      services: servicesCheck,
      uptime,
      version: this.VERSION
    };
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<{
    status: 'connected' | 'disconnected';
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      // Perform a simple query to test database connectivity
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'disconnected',
          responseTime,
          error: error.message
        };
      }

      return {
        status: 'connected',
        responseTime
      };
    } catch (error) {
      return {
        status: 'disconnected',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check other services
   */
  private async checkServices(): Promise<{
    heartbeat: boolean;
    email: boolean;
  }> {
    // Check if heartbeat service is running
    const heartbeatRunning = await this.checkHeartbeatService();

    // Check email service (basic check)
    const emailWorking = await this.checkEmailService();

    return {
      heartbeat: heartbeatRunning,
      email: emailWorking
    };
  }

  /**
   * Check if heartbeat service is running
   */
  private async checkHeartbeatService(): Promise<boolean> {
    try {
      // Try to access heartbeat logs or perform a simple operation
      const { error } = await supabase
        .from('projects')
        .select('id')
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Check email service
   */
  private async checkEmailService(): Promise<boolean> {
    try {
      // Check if email configuration is available
      const emailUser = import.meta.env.VITE_EMAIL_USER;
      const emailPassword = import.meta.env.VITE_EMAIL_PASSWORD;

      return !!(emailUser && emailPassword);
    } catch {
      return false;
    }
  }

  /**
   * Simple ping endpoint for external monitoring
   */
  async ping(): Promise<{ status: 'ok'; timestamp: string }> {
    // Perform a minimal database operation to keep the connection alive
    try {
      await supabase
        .from('projects')
        .select('id')
        .limit(1);

      return {
        status: 'ok',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Ping failed:', error);
      throw new Error('Service unavailable');
    }
  }

  /**
   * Get basic status without database operations
   */
  getBasicStatus(): { status: 'ok'; uptime: number; version: string } {
    return {
      status: 'ok',
      uptime: Date.now() - this.startTime,
      version: this.VERSION
    };
  }
}

// Create singleton instance
export const healthCheckService = new HealthCheckService();

export default healthCheckService;
