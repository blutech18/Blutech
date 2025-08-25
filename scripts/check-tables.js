#!/usr/bin/env node

/**
 * Script to check which tables exist in your Supabase database
 * This helps identify which tables the keep-alive system should query
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

// List of tables to check
const tablesToCheck = [
  'projects',
  'services', 
  'users',
  'contact_messages',
  'project_inquiries',
  'clients',
  'heartbeat_logs'
];

async function checkTables() {
  console.log('🔍 Checking which tables exist in your Supabase database...\n');

  const results = {};

  for (const tableName of tablesToCheck) {
    try {
      console.log(`Checking table: ${tableName}...`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`❌ Table '${tableName}' does not exist`);
          results[tableName] = { exists: false, error: error.message };
        } else {
          console.log(`⚠️  Table '${tableName}' exists but has an error: ${error.message}`);
          results[tableName] = { exists: true, error: error.message };
        }
      } else {
        console.log(`✅ Table '${tableName}' exists and is accessible`);
        results[tableName] = { exists: true, error: null };
      }
    } catch (error) {
      console.log(`❌ Error checking table '${tableName}': ${error.message}`);
      results[tableName] = { exists: false, error: error.message };
    }
  }

  console.log('\n📊 Summary:');
  console.log('===========');
  
  const existingTables = Object.entries(results)
    .filter(([_, result]) => result.exists)
    .map(([tableName, _]) => tableName);

  const missingTables = Object.entries(results)
    .filter(([_, result]) => !result.exists)
    .map(([tableName, _]) => tableName);

  console.log(`✅ Existing tables (${existingTables.length}):`);
  existingTables.forEach(table => console.log(`   - ${table}`));

  console.log(`\n❌ Missing tables (${missingTables.length}):`);
  missingTables.forEach(table => console.log(`   - ${table}`));

  console.log('\n💡 Recommendations:');
  console.log('===================');
  
  if (missingTables.includes('heartbeat_logs')) {
    console.log('1. Run the SQL migration to create the heartbeat_logs table:');
    console.log('   - Copy the contents of supabase/migrations/001_create_heartbeat_logs.sql');
    console.log('   - Execute it in your Supabase SQL editor');
  }

  if (missingTables.includes('contact_messages')) {
    console.log('2. The contact_messages table is missing. The keep-alive system has been updated');
    console.log('   to handle this gracefully, but you may want to create this table if needed.');
  }

  console.log('\n3. The keep-alive system will now only query tables that exist.');
  console.log('4. Check the console for any remaining errors after this fix.');

  return results;
}

// Run the check
checkTables()
  .then(() => {
    console.log('\n✅ Table check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error during table check:', error);
    process.exit(1);
  });
