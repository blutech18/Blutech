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

  try {
    const startTime = Date.now();
    
    // Perform a simple database operation to keep the connection alive
    const { data, error } = await supabase
      .from('projects')
      .select('id, title')
      .limit(1);

    const responseTime = Date.now() - startTime;

    if (error) {
      console.error('Keep-alive failed:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Database connection failed',
          error: error.message,
          timestamp: new Date().toISOString()
        })
      };
    }

    // Log the keep-alive ping
    console.log(`Keep-alive ping successful - Response time: ${responseTime}ms`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'ok',
        message: 'Keep-alive ping successful',
        responseTime,
        timestamp: new Date().toISOString(),
        data: data || []
      })
    };

  } catch (error) {
    console.error('Keep-alive error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
