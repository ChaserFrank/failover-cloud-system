import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 5000
});

// Error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Server health endpoint
export const fetchServerHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    // Return offline status if server is unreachable
    return {
      status: 'DOWN',
      cpu: 0,
      memory: 0,
      failover: 'OFFLINE',
      timestamp: new Date().toISOString()
    };
  }
};

// System logs endpoint
export const fetchSystemLogs = async () => {
  try {
    const response = await api.get('/api/logs');
    return response.data;
  } catch (error) {
    return [
      {
        id: 'error-1',
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: 'Unable to fetch system logs. API endpoint unreachable.'
      }
    ];
  }
};

// Reset failover endpoint
export const resetFailover = async () => {
  try {
    const response = await api.post('/api/reset');
    return response.data;
  } catch (error) {
    throw new Error('Failed to reset failover. Server unreachable.');
  }
};

// Mock API responses for development (used when the actual API is not available)
export const getMockServerHealth = () => {
  const statuses = ['UP', 'UP', 'UP', 'DOWN'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const cpu = status === 'DOWN' ? 0 : Math.floor(Math.random() * 100);
  const memory = status === 'DOWN' ? 0 : Math.floor(Math.random() * 100);
  const failover = status === 'DOWN' ? 'BACKUP' : (Math.random() > 0.2 ? 'PRIMARY' : 'BACKUP');
  
  return {
    status,
    cpu,
    memory,
    failover,
    timestamp: new Date().toISOString()
  };
};

export const getMockSystemLogs = () => {
  const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
  const messages = [
    'Server health check passed',
    'CPU usage above 80%',
    'Memory usage critical',
    'Failover initiated',
    'Backup server activated',
    'Connection timeout',
    'System restart initiated',
    'Database connection lost',
    'API rate limit exceeded',
    'Authentication failure'
  ];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: `log-${i}`,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)]
  })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};