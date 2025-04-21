import React, { useState, useEffect, useCallback } from 'react';
import { fetchServerHealth, fetchSystemLogs, resetFailover } from './api/api';
import { updateHealthHistory, initializeHealthHistory, detectFailoverEvent, getSimulatedHealthData, getSimulatedLogs } from './utils/dataUtils';
import Header from './components/Header';
import ServerStatus from './components/ServerStatus';
import UsageStats from './components/UsageStats';
import FailoverStatus from './components/FailoverStatus';
import LogViewer from './components/LogViewer';
import ChartContainer from './charts/ChartContainer';
import Alerts from './components/Alerts';
import socket from "./utils/socket";

function App() {
  function App() {
    const [dashboardData, setDashboardData] = useState<any>({});
  
    useEffect(() => {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setDashboardData(data);
      };
    }, []);
  
    return (
      <div className="p-4">
        {/* Pass props like dashboardData.server_status to ServerStatus */}
      </div>
    );
  }
  const [darkMode, setDarkMode] = useState(() => {
    // Check user preference or system setting
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [serverData, setServerData] = useState(null);
  const [previousServerData, setPreviousServerData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [healthHistory, setHealthHistory] = useState([]);
  const [lastFailoverEvent, setLastFailoverEvent] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isResetting, setIsResetting] = useState(false);
  const [isAPIAvailable, setIsAPIAvailable] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  // Apply dark mode class to HTML element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Initialize health history with some data
  useEffect(() => {
    const initialHistory = initializeHealthHistory();
    setHealthHistory(initialHistory);
  }, []);

  // Fetch server health data
  const fetchHealthData = useCallback(async () => {
    try {
      // Try to fetch from API
      const data = await fetchServerHealth();
      setIsAPIAvailable(true);
      setServerData(prevData => {
        setPreviousServerData(prevData);
        return data;
      });
      
      // Update history
      const updatedHistory = updateHealthHistory(data);
      setHealthHistory(updatedHistory);
      
      // Check for failover event
      const failoverEvent = detectFailoverEvent(data, previousServerData);
      if (failoverEvent) {
        setLastFailoverEvent(failoverEvent);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      setIsAPIAvailable(false);
      
      // Use simulated data when API is unavailable
      const simulatedData = getSimulatedHealthData();
      setServerData(prevData => {
        setPreviousServerData(prevData);
        return simulatedData;
      });
      
      // Update history with simulated data
      const updatedHistory = updateHealthHistory(simulatedData);
      setHealthHistory(updatedHistory);
      
      setLastUpdated(new Date());
    }
  }, [previousServerData]);

  // Fetch system logs
  const fetchLogs = useCallback(async () => {
    try {
      const logData = await fetchSystemLogs();
      setLogs(logData);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      
      // Use simulated logs when API is unavailable
      const simulatedLogs = getSimulatedLogs();
      setLogs(simulatedLogs);
    }
  }, []);

  // Reset failover to primary server
  const handleResetFailover = async () => {
    if (isResetting || serverData?.failover === 'PRIMARY') return;
    
    setIsResetting(true);
    try {
      await resetFailover();
      await fetchHealthData(); // Refresh data after reset
    } catch (error) {
      console.error('Failed to reset failover:', error);
      
      // Simulate successful reset
      setTimeout(() => {
        setServerData(prev => ({
          ...prev,
          failover: 'PRIMARY'
        }));
        
        setLastFailoverEvent(null);
      }, 1500);
    } finally {
      setIsResetting(false);
    }
  };

  // Poll for server health every 5 seconds
  useEffect(() => {
    fetchHealthData();
    const healthInterval = setInterval(fetchHealthData, 5000);
    
    return () => clearInterval(healthInterval);
  }, [fetchHealthData]);

  // Poll for system logs every 10 seconds
  useEffect(() => {
    fetchLogs();
    const logsInterval = setInterval(fetchLogs, 10000);
    
    return () => clearInterval(logsInterval);
  }, [fetchLogs]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Server Status Banner */}
      {!isAPIAvailable && (
        <div className="bg-yellow-500 dark:bg-yellow-700 p-2 text-center text-white text-sm">
          API server is unreachable. Displaying simulated data for demonstration.
        </div>
      )}
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Server Status Card */}
          <ServerStatus serverData={serverData} lastUpdated={lastUpdated} />
          
          {/* Resource Usage Card */}
          <UsageStats cpuUsage={serverData?.cpu || 0} memoryUsage={serverData?.memory || 0} />
          
          {/* Failover Status Card */}
          <FailoverStatus 
            failoverStatus={serverData?.failover} 
            lastFailoverEvent={lastFailoverEvent}
            onResetFailover={handleResetFailover}
            loading={isResetting}
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ChartContainer 
            title="CPU Usage History" 
            data={healthHistory} 
            dataKey="cpu" 
            color="#3B82F6"
            unit="%"
          />
          <ChartContainer 
            title="Memory Usage History" 
            data={healthHistory} 
            dataKey="memory" 
            color="#8B5CF6"
            unit="%"
          />
        </div>
        
        {/* Logs Panel */}
        <div className="mb-6">
          <LogViewer logs={logs} />
        </div>
      </main>
      
      {/* Alerts Component */}
      <Alerts serverData={serverData} previousServerData={previousServerData} />
    </div>
  );
}

export default App;