import { supabase } from '../lib/supabase';
import { heartbeatService } from './heartbeat';
import { healthCheckService } from './healthCheck';

interface WorkerTask {
  id: string;
  name: string;
  interval: number; // milliseconds
  lastRun: number;
  enabled: boolean;
  execute: () => Promise<void>;
}

class BackgroundWorker {
  private tasks: Map<string, WorkerTask> = new Map();
  private isRunning = false;
  private mainInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 60 * 1000; // 1 minute

  constructor() {
    this.initializeTasks();
  }

  /**
   * Initialize all background tasks
   */
  private initializeTasks(): void {
    // Task 1: Database heartbeat
    this.addTask({
      id: 'heartbeat',
      name: 'Database Heartbeat',
      interval: 5 * 60 * 1000, // 5 minutes
      lastRun: 0,
      enabled: true,
      execute: async () => {
        await this.performDatabaseHeartbeat();
      }
    });

    // Task 2: Cleanup old logs
    this.addTask({
      id: 'cleanup',
      name: 'Cleanup Old Logs',
      interval: 24 * 60 * 60 * 1000, // 24 hours
      lastRun: 0,
      enabled: true,
      execute: async () => {
        await this.cleanupOldLogs();
      }
    });

    // Task 3: Health check
    this.addTask({
      id: 'health-check',
      name: 'Health Check',
      interval: 10 * 60 * 1000, // 10 minutes
      lastRun: 0,
      enabled: true,
      execute: async () => {
        await this.performHealthCheck();
      }
    });

    // Task 4: Database statistics
    this.addTask({
      id: 'stats',
      name: 'Database Statistics',
      interval: 30 * 60 * 1000, // 30 minutes
      lastRun: 0,
      enabled: true,
      execute: async () => {
        await this.collectDatabaseStats();
      }
    });
  }

  /**
   * Add a new task to the worker
   */
  addTask(task: WorkerTask): void {
    this.tasks.set(task.id, task);
  }

  /**
   * Remove a task from the worker
   */
  removeTask(taskId: string): void {
    this.tasks.delete(taskId);
  }

  /**
   * Start the background worker
   */
  start(): void {
    if (this.isRunning) {
      console.log('Background worker is already running');
      return;
    }

    console.log('Starting background worker...');
    this.isRunning = true;

    // Start the main loop
    this.mainInterval = setInterval(() => {
      this.processTasks();
    }, this.CHECK_INTERVAL);

    // Process tasks immediately
    this.processTasks();
  }

  /**
   * Stop the background worker
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Background worker is not running');
      return;
    }

    console.log('Stopping background worker...');
    this.isRunning = false;

    if (this.mainInterval) {
      clearInterval(this.mainInterval);
      this.mainInterval = null;
    }
  }

  /**
   * Process all tasks
   */
  private async processTasks(): Promise<void> {
    const now = Date.now();

    for (const task of this.tasks.values()) {
      if (!task.enabled) continue;

      if (now - task.lastRun >= task.interval) {
        try {
          console.log(`Executing task: ${task.name}`);
          await task.execute();
          task.lastRun = now;
          console.log(`Task completed: ${task.name}`);
        } catch (error) {
          console.error(`Task failed: ${task.name}`, error);
        }
      }
    }
  }

  /**
   * Perform database heartbeat
   */
  private async performDatabaseHeartbeat(): Promise<void> {
    try {
      // Perform a simple database operation
      const { data, error } = await supabase
        .from('projects')
        .select('id, title')
        .limit(1);

      if (error) {
        console.error('Database heartbeat failed:', error);
        return;
      }

      // Log the heartbeat
      console.log('Database heartbeat successful');
    } catch (error) {
      console.error('Database heartbeat error:', error);
    }
  }

  /**
   * Cleanup old logs
   */
  private async cleanupOldLogs(): Promise<void> {
    try {
      // Clean up heartbeat logs older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { error } = await supabase
        .from('heartbeat_logs')
        .delete()
        .lt('timestamp', sevenDaysAgo.toISOString());

      if (error) {
        console.error('Cleanup failed:', error);
        return;
      }

      console.log('Old logs cleaned up successfully');
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const health = await healthCheckService.performHealthCheck();
      
      if (health.status === 'unhealthy') {
        console.warn('Health check failed:', health);
      } else {
        console.log('Health check passed');
      }
    } catch (error) {
      console.error('Health check error:', error);
    }
  }

  /**
   * Collect database statistics
   */
  private async collectDatabaseStats(): Promise<void> {
    try {
      // Get counts from various tables - only query tables that exist
      const stats = await Promise.allSettled([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('services').select('id', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('project_inquiries').select('id', { count: 'exact' }),
        supabase.from('clients').select('id', { count: 'exact' })
      ]);

      const [projects, services, users, inquiries, clients] = stats;

      const statsData: any = {
        timestamp: new Date().toISOString()
      };

      // Only include successful queries
      if (projects.status === 'fulfilled' && !projects.value.error) {
        statsData.projects = projects.value.count || 0;
      }
      if (services.status === 'fulfilled' && !services.value.error) {
        statsData.services = services.value.count || 0;
      }
      if (users.status === 'fulfilled' && !users.value.error) {
        statsData.users = users.value.count || 0;
      }
      if (inquiries.status === 'fulfilled' && !inquiries.value.error) {
        statsData.inquiries = inquiries.value.count || 0;
      }
      if (clients.status === 'fulfilled' && !clients.value.error) {
        statsData.clients = clients.value.count || 0;
      }

      console.log('Database statistics:', statsData);
    } catch (error) {
      console.error('Statistics collection error:', error);
    }
  }

  /**
   * Get worker status
   */
  getStatus(): {
    isRunning: boolean;
    tasks: Array<{
      id: string;
      name: string;
      enabled: boolean;
      lastRun: number;
      nextRun: number;
    }>;
  } {
    const now = Date.now();
    const taskStatus = Array.from(this.tasks.values()).map(task => ({
      id: task.id,
      name: task.name,
      enabled: task.enabled,
      lastRun: task.lastRun,
      nextRun: task.lastRun + task.interval
    }));

    return {
      isRunning: this.isRunning,
      tasks: taskStatus
    };
  }

  /**
   * Enable/disable a specific task
   */
  setTaskEnabled(taskId: string, enabled: boolean): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.enabled = enabled;
      console.log(`Task ${taskId} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}

// Create singleton instance
export const backgroundWorker = new BackgroundWorker();

// Auto-start the worker when the module is imported (server-side only)
if (typeof window === 'undefined') {
  backgroundWorker.start();
}

export default backgroundWorker;
