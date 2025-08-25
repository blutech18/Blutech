const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    // Check database connectivity
    const dbStartTime = Date.now();
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    const dbResponseTime = Date.now() - dbStartTime;
    const dbStatus = projectsError ? 'disconnected' : 'connected';

    // Check other tables that are likely to exist
    const tableChecks = await Promise.allSettled([
      supabase.from('services').select('id').limit(1),
      supabase.from('users').select('id').limit(1),
      supabase.from('project_inquiries').select('id').limit(1),
      supabase.from('clients').select('id').limit(1)
    ]);

    const [servicesResult, usersResult, inquiriesResult, clientsResult] = tableChecks;

    // Get database statistics for existing tables
    const stats = await Promise.allSettled([
      supabase.from('projects').select('id', { count: 'exact' }),
      supabase.from('services').select('id', { count: 'exact' }),
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('project_inquiries').select('id', { count: 'exact' }),
      supabase.from('clients').select('id', { count: 'exact' })
    ]);

    const [projectsCount, servicesCount, usersCount, inquiriesCount, clientsCount] = stats;

    const totalResponseTime = Date.now() - startTime;

    // Determine overall health status
    const overallStatus = dbStatus === 'connected' ? 'healthy' : 'unhealthy';

    const healthData = {
      status: overallStatus,
      timestamp,
      responseTime: totalResponseTime,
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
        error: projectsError?.message || null
      },
      tables: {
        projects: !projectsError,
        services: servicesResult.status === 'fulfilled' && !servicesResult.value.error,
        users: usersResult.status === 'fulfilled' && !usersResult.value.error,
        inquiries: inquiriesResult.status === 'fulfilled' && !inquiriesResult.value.error,
        clients: clientsResult.status === 'fulfilled' && !clientsResult.value.error
      },
      statistics: {
        projects: projectsCount.status === 'fulfilled' ? (projectsCount.value.count || 0) : 0,
        services: servicesCount.status === 'fulfilled' ? (servicesCount.value.count || 0) : 0,
        users: usersCount.status === 'fulfilled' ? (usersCount.value.count || 0) : 0,
        inquiries: inquiriesCount.status === 'fulfilled' ? (inquiriesCount.value.count || 0) : 0,
        clients: clientsCount.status === 'fulfilled' ? (clientsCount.value.count || 0) : 0
      },
      environment: {
        supabaseUrl: supabaseUrl ? 'configured' : 'missing',
        supabaseKey: supabaseAnonKey ? 'configured' : 'missing'
      },
      version: '1.0.0'
    };

    return {
      statusCode: overallStatus === 'healthy' ? 200 : 503,
      headers,
      body: JSON.stringify(healthData)
    };

  } catch (error) {
    console.error('Health check error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'unhealthy',
        timestamp,
        responseTime: Date.now() - startTime,
        error: error.message,
        database: {
          status: 'disconnected',
          responseTime: 0,
          error: error.message
        },
        version: '1.0.0'
      })
    };
  }
};
