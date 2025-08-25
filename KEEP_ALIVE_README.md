# Supabase Keep-Alive System

This system prevents your Supabase project from being paused due to inactivity by implementing multiple strategies to keep the database active.

## 🚀 Features

- **Heartbeat Service**: Periodic database pings every 5 minutes
- **Background Worker**: Automated maintenance tasks
- **Health Check Endpoints**: External monitoring support
- **Netlify Functions**: Serverless keep-alive endpoints
- **Automatic Cleanup**: Removes old logs to prevent bloat
- **Retry Logic**: Handles failures gracefully with exponential backoff

## 📁 File Structure

```
src/
├── services/
│   ├── heartbeat.ts          # Heartbeat service
│   ├── healthCheck.ts        # Health check service
│   ├── backgroundWorker.ts   # Background task worker
│   └── serviceManager.ts     # Service coordination
├── config/
│   └── keepAlive.ts         # Configuration settings
netlify/
├── functions/
│   ├── keep-alive.js        # Keep-alive endpoint
│   └── health.js            # Health check endpoint
supabase/
└── migrations/
    └── 001_create_heartbeat_logs.sql  # Database schema
```

## 🛠️ Setup Instructions

### 1. Database Setup

Run the SQL migration to create the heartbeat_logs table:

```sql
-- Execute this in your Supabase SQL editor
-- File: supabase/migrations/001_create_heartbeat_logs.sql
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# Keep-alive configuration (optional)
VITE_HEARTBEAT_INTERVAL=300000          # 5 minutes in milliseconds
VITE_HEALTH_CHECK_INTERVAL=600000       # 10 minutes in milliseconds
VITE_ENABLE_CONSOLE_LOGS=true           # Enable console logging
```

### 3. Deploy Netlify Functions

The Netlify functions will automatically deploy when you push to your repository. They provide external endpoints for monitoring services.

## 🔧 Usage

### Automatic Operation

The system starts automatically when your application loads (server-side only). No manual intervention required.

### Manual Control

```typescript
import { serviceManager } from './src/services/serviceManager';

// Get service status
const status = serviceManager.getStatus();
console.log('Service status:', status);

// Perform manual health check
const health = await serviceManager.performHealthCheck();
console.log('Health check:', health);

// Perform manual ping
const ping = await serviceManager.performPing();
console.log('Ping result:', ping);

// Restart all services
await serviceManager.restart();
```

### External Monitoring

Use these endpoints for external monitoring services:

1. **Keep-Alive Endpoint**: `https://your-domain.netlify.app/.netlify/functions/keep-alive`
2. **Health Check Endpoint**: `https://your-domain.netlify.app/.netlify/functions/health`

## 📊 Monitoring

### Service Status

The system provides detailed status information:

```typescript
const detailedStatus = serviceManager.getDetailedStatus();
console.log(detailedStatus);
```

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "responseTime": 150,
  "database": {
    "status": "connected",
    "responseTime": 120,
    "error": null
  },
  "tables": {
    "projects": true,
    "services": true,
    "messages": true
  },
  "statistics": {
    "projects": 5,
    "services": 3,
    "messages": 12,
    "inquiries": 2
  }
}
```

## 🔄 Background Tasks

The system runs these tasks automatically:

1. **Database Heartbeat** (every 5 minutes)
   - Pings the database to keep it active
   - Logs heartbeat operations

2. **Health Check** (every 10 minutes)
   - Checks database connectivity
   - Validates all tables
   - Collects statistics

3. **Cleanup** (every 24 hours)
   - Removes old heartbeat logs (older than 7 days)
   - Prevents database bloat

4. **Statistics Collection** (every 30 minutes)
   - Counts records in all tables
   - Provides usage metrics

## 🛡️ Error Handling

The system includes robust error handling:

- **Retry Logic**: Failed operations are retried with exponential backoff
- **Graceful Degradation**: If one service fails, others continue
- **Logging**: All operations are logged for debugging
- **Fallback Operations**: Uses alternative methods if primary fails

## 📈 Performance Impact

- **Minimal Resource Usage**: Lightweight operations
- **Efficient Queries**: Uses indexed queries with limits
- **Automatic Cleanup**: Prevents log accumulation
- **Configurable Intervals**: Adjust timing based on needs

## 🔧 Configuration

Modify `src/config/keepAlive.ts` to adjust:

- Heartbeat intervals
- Task frequencies
- Cleanup retention periods
- Monitoring settings

## 🚨 Troubleshooting

### Common Issues

1. **Service Not Starting**
   - Check environment variables
   - Verify Supabase connection
   - Check console for errors

2. **Database Connection Failures**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Review RLS policies

3. **High Log Volume**
   - Adjust cleanup intervals
   - Reduce heartbeat frequency
   - Check for error loops

### Debug Mode

Enable detailed logging:

```typescript
// In your main application
import { serviceManager } from './src/services/serviceManager';

// Get detailed status
const status = serviceManager.getDetailedStatus();
console.log('Detailed status:', status);
```

## 📞 External Monitoring Services

You can use these services to call your keep-alive endpoints:

1. **UptimeRobot**: Monitor your health endpoint
2. **Pingdom**: Set up uptime monitoring
3. **Cron-job.org**: Schedule regular pings
4. **GitHub Actions**: Automated health checks

### Example: Cron-job.org Setup

1. Go to [cron-job.org](https://cron-job.org)
2. Create a new cronjob
3. Set URL: `https://your-domain.netlify.app/.netlify/functions/keep-alive`
4. Set schedule: Every 5 minutes
5. Save and activate

## 🔒 Security

- **RLS Policies**: Database access is properly secured
- **Environment Variables**: Sensitive data is protected
- **CORS Headers**: Netlify functions include proper CORS
- **Error Sanitization**: No sensitive data in error responses

## 📝 Logs

Heartbeat logs are stored in the `heartbeat_logs` table:

```sql
SELECT * FROM heartbeat_logs 
ORDER BY timestamp DESC 
LIMIT 10;
```

## 🎯 Best Practices

1. **Monitor Regularly**: Check service status periodically
2. **Adjust Intervals**: Fine-tune based on your needs
3. **Use External Monitoring**: Set up uptime monitoring
4. **Review Logs**: Check for patterns or issues
5. **Test Failures**: Verify error handling works

## 🆘 Support

If you encounter issues:

1. Check the console logs
2. Verify environment variables
3. Test database connectivity
4. Review the troubleshooting section
5. Check Supabase dashboard for errors

---

**Note**: This system is designed to prevent Supabase from pausing your project due to inactivity. It's not a replacement for proper monitoring and should be used as part of a comprehensive monitoring strategy.
