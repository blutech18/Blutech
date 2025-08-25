#!/usr/bin/env node

/**
 * Setup script for external monitoring services
 * This script helps you configure external monitoring for your keep-alive system
 */

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🚀 Supabase Keep-Alive Monitoring Setup\n');
  
  const domain = await question('Enter your Netlify domain (e.g., your-app.netlify.app): ');
  
  if (!domain) {
    console.log('❌ Domain is required. Exiting...');
    rl.close();
    return;
  }

  console.log('\n📋 Your monitoring endpoints:');
  console.log(`Keep-Alive: https://${domain}/.netlify/functions/keep-alive`);
  console.log(`Health Check: https://${domain}/.netlify/functions/health`);
  
  console.log('\n🔧 External Monitoring Services Setup:');
  console.log('\n1. Cron-job.org:');
  console.log('   - URL: https://cron-job.org');
  console.log('   - Endpoint: https://' + domain + '/.netlify/functions/keep-alive');
  console.log('   - Schedule: Every 5 minutes');
  
  console.log('\n2. UptimeRobot:');
  console.log('   - URL: https://uptimerobot.com');
  console.log('   - Endpoint: https://' + domain + '/.netlify/functions/health');
  console.log('   - Check Interval: 5 minutes');
  
  console.log('\n3. Pingdom:');
  console.log('   - URL: https://pingdom.com');
  console.log('   - Endpoint: https://' + domain + '/.netlify/functions/keep-alive');
  console.log('   - Check Interval: 5 minutes');
  
  console.log('\n4. GitHub Actions (create .github/workflows/keep-alive.yml):');
  console.log(`
name: Keep Alive
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Keep-Alive Endpoint
        run: |
          curl -X GET "https://${domain}/.netlify/functions/keep-alive"
          echo "Keep-alive ping sent at $(date)"
  `);

  console.log('\n✅ Setup complete!');
  console.log('\n💡 Tips:');
  console.log('- Test your endpoints manually first');
  console.log('- Monitor the logs in your Netlify dashboard');
  console.log('- Check the heartbeat_logs table in Supabase');
  console.log('- Set up alerts for monitoring failures');
  
  rl.close();
}

main().catch(console.error);
