import { heartbeatService } from './heartbeat';
import { healthCheckService } from './healthCheck';
import { backgroundWorker } from './backgroundWorker';

interface ServiceStatus {
  heartbeat: {
    isRunning: boolean;
    lastHeartbeat?: string;
  };
  backgroundWorker: {
    isRunning: boolean;
    tasks: Array<{
      id: string;
      name: string;
      enabled: boolean;
      lastRun: number;
      nextRun: number;
    }>;
  };
  healthCheck: {
    lastCheck?: string;
  };
  overall: 'healthy' | 'unhealthy' | 'starting' | 'stopped';
}

class ServiceManager {
  private isInitialized = false;

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Service manager already initialized');
      return;
    }

    console.log('Initializing service manager...');

    try {
      // Start heartbeat service
      await heartbeatService.start();

      // Start background worker
      backgroundWorker.start();

      // Perform initial health check
      await healthCheckService.performHealthCheck();

      this.isInitialized = true;
      console.log('Service manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize service manager:', error);
      throw error;
    }
  }

  /**
   * Stop all services
   */
  async shutdown(): Promise<void> {
    console.log('Shutting down service manager...');

    try {
      // Stop heartbeat service
      heartbeatService.stop();

      // Stop background worker
      backgroundWorker.stop();

      this.isInitialized = false;
      console.log('Service manager shut down successfully');
    } catch (error) {
      console.error('Error during shutdown:', error);
      throw error;
    }
  }

  /**
   * Get status of all services
   */
  getStatus(): ServiceStatus {
    const heartbeatStatus = heartbeatService.getStatus();
    const workerStatus = backgroundWorker.getStatus();

    // Determine overall status
    let overall: ServiceStatus['overall'] = 'stopped';
    
    if (this.isInitialized) {
      if (heartbeatStatus.isRunning && workerStatus.isRunning) {
        overall = 'healthy';
      } else if (heartbeatStatus.isRunning || workerStatus.isRunning) {
        overall = 'starting';
      } else {
        overall = 'unhealthy';
      }
    }

    return {
      heartbeat: heartbeatStatus,
      backgroundWorker: workerStatus,
      healthCheck: {
        lastCheck: new Date().toISOString()
      },
      overall
    };
  }

  /**
   * Perform a manual health check
   */
  async performHealthCheck(): Promise<any> {
    try {
      return await healthCheckService.performHealthCheck();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  /**
   * Perform a manual ping
   */
  async performPing(): Promise<any> {
    try {
      return await healthCheckService.ping();
    } catch (error) {
      console.error('Ping failed:', error);
      throw error;
    }
  }

  /**
   * Enable/disable specific background tasks
   */
  setTaskEnabled(taskId: string, enabled: boolean): void {
    backgroundWorker.setTaskEnabled(taskId, enabled);
  }

  /**
   * Get detailed information about all services
   */
  getDetailedStatus(): {
    serviceManager: {
      isInitialized: boolean;
      overall: ServiceStatus['overall'];
    };
    heartbeat: ReturnType<typeof heartbeatService.getStatus>;
    backgroundWorker: ReturnType<typeof backgroundWorker.getStatus>;
    healthCheck: {
      version: string;
      uptime: number;
    };
  } {
    return {
      serviceManager: {
        isInitialized: this.isInitialized,
        overall: this.getStatus().overall
      },
      heartbeat: heartbeatService.getStatus(),
      backgroundWorker: backgroundWorker.getStatus(),
      healthCheck: healthCheckService.getBasicStatus()
    };
  }

  /**
   * Restart all services
   */
  async restart(): Promise<void> {
    console.log('Restarting all services...');
    
    await this.shutdown();
    
    // Wait a moment before restarting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.initialize();
    
    console.log('All services restarted successfully');
  }
}

// Create singleton instance
export const serviceManager = new ServiceManager();

// Auto-initialize when the module is imported (server-side only)
if (typeof window === 'undefined') {
  serviceManager.initialize().catch(console.error);
}

export default serviceManager;
