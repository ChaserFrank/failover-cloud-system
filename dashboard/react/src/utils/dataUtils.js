import { getMockServerHealth, getMockSystemLogs } from '../api/api';

// Store historical data for charts
let healthHistory = [];
const MAX_HISTORY_POINTS = 20;

// Update health history with new data point
export const updateHealthHistory = (newData) => {
  // Add new data point with timestamp
  healthHistory = [
    ...healthHistory,
    {
      ...newData,
      timestamp: newData.timestamp || new Date().toISOString()
    }
  ];
  
  // Limit the history size
  if (healthHistory.length > MAX_HISTORY_POINTS) {
    healthHistory = healthHistory.slice(-MAX_HISTORY_POINTS);
  }
  
  return healthHistory;
};

// Get current health history
export const getHealthHistory = () => {
  return healthHistory;
};

// Initialize with some mock data for immediate display
export const initializeHealthHistory = () => {
  // Generate some fake historical data
  const now = new Date();
  const mockData = Array.from({ length: 10 }, (_, i) => {
    const timeOffset = i * 5000; // 5 seconds apart
    const mockTime = new Date(now.getTime() - timeOffset);
    const mockHealthData = getMockServerHealth();
    
    return {
      ...mockHealthData,
      timestamp: mockTime.toISOString()
    };
  }).reverse(); // Oldest first
  
  healthHistory = mockData;
  return healthHistory;
};

// Detect if a failover event occurred between two data points
export const detectFailoverEvent = (current, previous) => {
  if (!previous) return null;
  
  // Check if failover status changed from PRIMARY to BACKUP
  if (previous.failover === 'PRIMARY' && current.failover === 'BACKUP') {
    return current.timestamp;
  }
  
  return null;
};

// Generate a simulated server response when API is unavailable
export const getSimulatedHealthData = (useRandom = true) => {
  if (useRandom) {
    return getMockServerHealth();
  }
  
  // Return a fixed offline status
  return {
    status: 'DOWN',
    cpu: 0,
    memory: 0,
    failover: 'OFFLINE',
    timestamp: new Date().toISOString()
  };
};

// Generate simulated logs when API is unavailable
export const getSimulatedLogs = () => {
  return getMockSystemLogs();
};