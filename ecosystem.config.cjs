/**
 * STAYEA PM2 Production Ecosystem Configuration
 * Manages processes for High Availability, Cluster Mode, and Zero-Downtime Reloads
 */

module.exports = {
  apps: [
    {
      name: 'stayea-api',
      cwd: './apps/api',
      script: 'dist/main.js',
      instances: 'max', // Scale to available CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      listen_timeout: 10000,
      kill_timeout: 5000,
      wait_ready: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '../../logs/pm2/api-error.log',
      out_file: '../../logs/pm2/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'stayea-web',
      cwd: './apps/admin-shadcn',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 8080',
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1.5G',
      listen_timeout: 10000,
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      error_file: '../../logs/pm2/web-error.log',
      out_file: '../../logs/pm2/web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};

