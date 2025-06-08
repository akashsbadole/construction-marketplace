module.exports = {
  apps: [
    {
      name: 'buildconnect-app',
      script: 'npm',
      args: 'start',
      cwd: '/app',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'file:./data/buildconnect.db'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        DATABASE_URL: 'file:./data/buildconnect.db'
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    }
  ]
}
