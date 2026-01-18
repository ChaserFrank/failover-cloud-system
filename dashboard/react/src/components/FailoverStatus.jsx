import React, { useState, useEffect } from 'react';
import { RefreshCw, Shield, AlertTriangle } from 'lucide-react';

const FailoverStatus = ({ failoverStatus, lastFailoverEvent, onResetFailover, loading }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Animation effect when failover status changes
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [failoverStatus]);

  const isPrimary = failoverStatus === 'PRIMARY';
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full transition-all duration-300 ${
      isTransitioning && !isPrimary ? 'animate-pulse bg-red-50 dark:bg-red-900/20' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Failover Server Status</h2>
        <button
          onClick={onResetFailover}
          disabled={loading || isPrimary}
          className={`p-2 rounded-full text-sm ${
            isPrimary 
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/40'
          } transition-colors duration-200 flex items-center`}
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          <span>Reset to Primary</span>
        </button>
      </div>
      
      <div className="flex items-center mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isPrimary 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-amber-100 dark:bg-amber-900/30'
        }`}>
          <Shield className={`w-6 h-6 ${
            isPrimary 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-amber-600 dark:text-amber-400'
          }`} />
        </div>
        <div className="ml-4">
          <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
            {isPrimary ? 'Primary Server Active' : 'Backup Server Active'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isPrimary 
              ? 'Main server is handling all requests' 
              : 'Failover has been triggered - backup server is active'
            }
          </p>
        </div>
      </div>
      
      {!isPrimary && lastFailoverEvent && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Failover Detected</p>
            <p className="text-xs text-red-600 dark:text-red-300">
              {new Date(lastFailoverEvent).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FailoverStatus;