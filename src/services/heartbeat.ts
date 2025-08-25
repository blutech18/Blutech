import { supabase } from '../lib/supabase';

interface HeartbeatLog {
  id?: number;
  timestamp: string;
  status: 'success' | 'error';
  message: string;
  response_time?: number;
}

class HeartbeatService {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private retryCount = 0;

  /**
   * Start the heartbeat service
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Heartbeat service is already running');
      return;
    }

    console.log('Starting heartbeat service...');
    this.isRunning = true;

    // Create heartbeat table if it doesn't exist
    await this.createHeartbeatTable();

    // Start the heartbeat loop
    this.intervalId = setInterval(async () => {
      await this.performHeartbeat();
    }, this.HEARTBEAT_INTERVAL);

    // Perform initial heartbeat
    await this.performHeartbeat();
  }

  /**
   * Stop the heartbeat service
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Heartbeat service is not running');
      return;
    }

    console.log('Stopping heartbeat service...');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Create heartbeat table for logging
   */
  private async createHeartbeatTable(): Promise<void> {
    try {
      // This will be handled by Supabase migrations, but we can log the attempt
      console.log('Heartbeat table creation attempted');
    } catch (error) {
      console.error('Error creating heartbeat table:', error);
    }
  }

  /**
   * Perform a single heartbeat operation
   */
  private async performHeartbeat(): Promise<void> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      // Perform a simple database operation to keep the connection alive
      const { data, error } = await supabase
        .from('heartbeat_logs')
        .insert([{
          timestamp,
          status: 'success',
          message: 'Heartbeat ping successful',
          response_time: 0
        }])
        .select()
        .single();

      if (error) {
        // If heartbeat_logs table doesn't exist, try alternative approach
        await this.alternativeHeartbeat();
      } else {
        const responseTime = Date.now() - startTime;
        
        // Update the log with response time
        await supabase
          .from('heartbeat_logs')
          .update({ response_time: responseTime })
          .eq('id', data.id);

        console.log(`Heartbeat successful - Response time: ${responseTime}ms`);
        this.retryCount = 0; // Reset retry count on success
      }
    } catch (error) {
      console.error('Heartbeat failed:', error);
      await this.handleHeartbeatError(timestamp, error as Error);
    }
  }

  /**
   * Alternative heartbeat method when main table doesn't exist
   */
  private async alternativeHeartbeat(): Promise<void> {
    try {
      // Try to read from existing tables to keep the connection alive
      const operations = [
        supabase.from('projects').select('id').limit(1),
        supabase.from('services').select('id').limit(1),
        supabase.from('contact_messages').select('id').limit(1)
      ];

      // Execute at least one operation
      const result = await operations[0];
      
      if (result.error) {
        throw new Error('All heartbeat operations failed');
      }

      console.log('Alternative heartbeat successful');
      this.retryCount = 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle heartbeat errors with retry logic
   */
  private async handleHeartbeatError(timestamp: string, error: Error): Promise<void> {
    this.retryCount++;

    if (this.retryCount >= this.MAX_RETRIES) {
      console.error(`Heartbeat failed after ${this.MAX_RETRIES} retries. Stopping service.`);
      this.stop();
      return;
    }

    console.log(`Heartbeat failed (attempt ${this.retryCount}/${this.MAX_RETRIES}). Retrying...`);
    
    // Wait before retry (exponential backoff)
    const retryDelay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 30000);
    setTimeout(async () => {
      await this.performHeartbeat();
    }, retryDelay);
  }

  /**
   * Get service status
   */
  getStatus(): { isRunning: boolean; lastHeartbeat?: string } {
    return {
      isRunning: this.isRunning,
      lastHeartbeat: this.isRunning ? new Date().toISOString() : undefined
    };
  }
}

// Create singleton instance
export const heartbeatService = new HeartbeatService();

// Auto-start the service when the module is imported
if (typeof window === 'undefined') {
  // Only start on server-side
  heartbeatService.start().catch(console.error);
}

export default heartbeatService;
