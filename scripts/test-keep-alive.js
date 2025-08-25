#!/usr/bin/env node

/**
 * Test script for the keep-alive system
 * This helps verify that the system works before deploying
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testKeepAlive() {
  console.log('🧪 Testing Keep-Alive System...\n');

  try {
    // Test 1: Basic database connectivity
    console.log('1. Testing database connectivity...');
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('projects')
      .select('id, title')
      .limit(1);

    const responseTime = Date.now() - startTime;

    if (error) {
      console.log(`❌ Database connection failed: ${error.message}`);
      return false;
    }

    console.log(`✅ Database connection successful - Response time: ${responseTime}ms`);
    console.log(`   Data: ${JSON.stringify(data)}`);

    // Test 2: Test heartbeat_logs table
    console.log('\n2. Testing heartbeat_logs table...');
    try {
      const { data: heartbeatData, error: heartbeatError } = await supabase
        .from('heartbeat_logs')
        .insert([{
          timestamp: new Date().toISOString(),
          status: 'success',
          message: 'Test heartbeat from local script',
          response_time: responseTime
        }])
        .select()
        .single();

      if (heartbeatError) {
        console.log(`⚠️  Heartbeat_logs table test: ${heartbeatError.message}`);
      } else {
        console.log(`✅ Heartbeat_logs table working - ID: ${heartbeatData.id}`);
      }
    } catch (error) {
      console.log(`⚠️  Heartbeat_logs table not accessible: ${error.message}`);
    }

    // Test 3: Test other tables
    console.log('\n3. Testing other tables...');
    const tables = ['services', 'users', 'project_inquiries', 'clients'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (tableError) {
          console.log(`   ❌ ${table}: ${tableError.message}`);
        } else {
          console.log(`   ✅ ${table}: Accessible`);
        }
      } catch (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      }
    }

    console.log('\n🎉 Keep-Alive System Test Completed!');
    console.log('\n💡 Next Steps:');
    console.log('1. Deploy to Netlify to test the functions');
    console.log('2. Set up environment variables in Netlify dashboard');
    console.log('3. Test the endpoints:');
    console.log(`   - Keep-Alive: https://blutech18.netlify.app/.netlify/functions/keep-alive`);
    console.log(`   - Health: https://blutech18.netlify.app/.netlify/functions/health`);

    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testKeepAlive()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Test error:', error);
    process.exit(1);
  });
