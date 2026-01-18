import React from 'react';
import { Server, AlertCircle, CheckCircle } from 'lucide-react';

const ServerStatus = ({ serverData, lastUpdated }) => {
  const isOnline = serverData?.status === 'UP';
  const statusColor = isOnline ? 'bg-green-500' : 'bg-red-500';
  const statusText = isOnline ? 'ONLINE' : 'OFFLINE';
  const formattedTime = new Date(lastUpdated).toLocaleTimeString();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Server className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Server Status</h2>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Updated at: {formattedTime}
        </span>
      </div>
      
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full ${statusColor} mr-2 ${!isOnline && 'animate-pulse'}`}></div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-white">{statusText}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isOnline ? 'All systems operational' : 'Server not responding'}
          </span>
        </div>
      </div>
      
      <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center">
        {isOnline ? (
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
        )}
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {isOnline 
            ? 'Health check successful'
            : 'Health check failed - some connectivity issue detected'
          }
        </span>
      </div>
    </div>
  );
};

export default ServerStatus;