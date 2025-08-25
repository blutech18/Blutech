import { serviceManager } from './serviceManager';
import { getKeepAliveConfig } from '../config/keepAlive';

/**
 * Initialize the keep-alive system
 * This should be called early in your application startup
 */
export async function initializeKeepAlive(): Promise<void> {
  try {
    console.log('🚀 Initializing Supabase Keep-Alive System...');
    
    // Get configuration
    const config = getKeepAliveConfig();
    
    if (config.monitoring.enableConsoleLogs) {
      console.log('📊 Keep-Alive Configuration:', {
        heartbeatInterval: `${config.heartbeat.interval / 1000}s`,
        healthCheckInterval: `${config.healthCheck.interval / 1000}s`,
        cleanupRetention: `${config.cleanup.heartbeatLogsRetentionDays} days`,
        consoleLogs: config.monitoring.enableConsoleLogs
      });
    }

    // Initialize the service manager
    await serviceManager.initialize();

    if (config.monitoring.enableConsoleLogs) {
      console.log('✅ Keep-Alive System initialized successfully');
      
      // Log initial status
      const status = serviceManager.getStatus();
      console.log('📈 Initial Status:', status);
    }

  } catch (error) {
    console.error('❌ Failed to initialize Keep-Alive System:', error);
    
    // Don't throw the error to prevent app startup failure
    // The system will continue to work with reduced functionality
  }
}

/**
 * Shutdown the keep-alive system
 * Call this when your application is shutting down
 */
export async function shutdownKeepAlive(): Promise<void> {
  try {
    console.log('🛑 Shutting down Keep-Alive System...');
    await serviceManager.shutdown();
    console.log('✅ Keep-Alive System shut down successfully');
  } catch (error) {
    console.error('❌ Error during Keep-Alive shutdown:', error);
  }
}

/**
 * Get the service manager instance
 * Use this to access keep-alive functionality from other parts of your app
 */
export { serviceManager };

/**
 * Quick health check function
 * Use this to check if the keep-alive system is working
 */
export async function quickHealthCheck(): Promise<{
  isHealthy: boolean;
  status: string;
  details?: any;
}> {
  try {
    const status = serviceManager.getStatus();
    const isHealthy = status.overall === 'healthy';
    
    return {
      isHealthy,
      status: status.overall,
      details: status
    };
  } catch (error) {
    return {
      isHealthy: false,
      status: 'error',
      details: error
    };
  }
}

/**
 * Manual ping function
 * Use this to manually trigger a keep-alive ping
 */
export async function manualPing(): Promise<{
  success: boolean;
  responseTime: number;
  timestamp: string;
}> {
  try {
    const startTime = Date.now();
    const result = await serviceManager.performPing();
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      responseTime,
      timestamp: result.timestamp
    };
  } catch (error) {
    return {
      success: false,
      responseTime: 0,
      timestamp: new Date().toISOString()
    };
  }
}

// Auto-initialize when this module is imported (server-side only)
if (typeof window === 'undefined') {
  initializeKeepAlive().catch(console.error);
}
