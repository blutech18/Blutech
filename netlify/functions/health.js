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

    // Check other tables
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id')
      .limit(1);

    const { data: messages, error: messagesError } = await supabase
      .from('contact_messages')
      .select('id')
      .limit(1);

    // Get database statistics
    const stats = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact' }),
      supabase.from('services').select('id', { count: 'exact' }),
      supabase.from('contact_messages').select('id', { count: 'exact' }),
      supabase.from('project_inquiries').select('id', { count: 'exact' })
    ]);

    const [projectsCount, servicesCount, messagesCount, inquiriesCount] = stats;

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
        services: !servicesError,
        messages: !messagesError
      },
      statistics: {
        projects: projectsCount.count || 0,
        services: servicesCount.count || 0,
        messages: messagesCount.count || 0,
        inquiries: inquiriesCount.count || 0
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
