export interface KeepAliveConfig {
  heartbeat: {
    interval: number; // milliseconds
    maxRetries: number;
    retryDelay: number; // milliseconds
  };
  backgroundWorker: {
    checkInterval: number; // milliseconds
    tasks: {
      [key: string]: {
        interval: number; // milliseconds
        enabled: boolean;
      };
    };
  };
  healthCheck: {
    interval: number; // milliseconds
    timeout: number; // milliseconds
  };
  cleanup: {
    heartbeatLogsRetentionDays: number;
    maxLogEntries: number;
  };
  monitoring: {
    enableConsoleLogs: boolean;
    enableMetrics: boolean;
    alertOnFailure: boolean;
  };
}

export const keepAliveConfig: KeepAliveConfig = {
  heartbeat: {
    interval: 5 * 60 * 1000, // 5 minutes
    maxRetries: 3,
    retryDelay: 30 * 1000, // 30 seconds
  },
  backgroundWorker: {
    checkInterval: 60 * 1000, // 1 minute
    tasks: {
      heartbeat: {
        interval: 5 * 60 * 1000, // 5 minutes
        enabled: true,
      },
      cleanup: {
        interval: 24 * 60 * 60 * 1000, // 24 hours
        enabled: true,
      },
      healthCheck: {
        interval: 10 * 60 * 1000, // 10 minutes
        enabled: true,
      },
      stats: {
        interval: 30 * 60 * 1000, // 30 minutes
        enabled: true,
      },
    },
  },
  healthCheck: {
    interval: 10 * 60 * 1000, // 10 minutes
    timeout: 30 * 1000, // 30 seconds
  },
  cleanup: {
    heartbeatLogsRetentionDays: 7,
    maxLogEntries: 1000,
  },
  monitoring: {
    enableConsoleLogs: true,
    enableMetrics: true,
    alertOnFailure: true,
  },
};

// Environment-specific overrides
export const getKeepAliveConfig = (): KeepAliveConfig => {
  const config = { ...keepAliveConfig };

  // Override with environment variables if available
  if (import.meta.env.VITE_HEARTBEAT_INTERVAL) {
    config.heartbeat.interval = parseInt(import.meta.env.VITE_HEARTBEAT_INTERVAL);
  }

  if (import.meta.env.VITE_HEALTH_CHECK_INTERVAL) {
    config.healthCheck.interval = parseInt(import.meta.env.VITE_HEALTH_CHECK_INTERVAL);
  }

  if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS) {
    config.monitoring.enableConsoleLogs = import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true';
  }

  return config;
};

export default keepAliveConfig;
