import React, { useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { AlertTriangle, Check, Info, X } from 'lucide-react';

const Alerts = ({ serverData, previousServerData }) => {
  const isServerDown = serverData?.status === 'DOWN';
  const wasServerDown = previousServerData?.status === 'DOWN';
  const failoverChanged = serverData?.failover !== previousServerData?.failover;
  const highCpuUsage = serverData?.cpu > 90;
  const highMemoryUsage = serverData?.memory > 90;
  
  // Server status change detection
  useEffect(() => {
    if (previousServerData && serverData) {
      // Server went down
      if (!wasServerDown && isServerDown) {
        showAlert('error', 'Server is DOWN!', 'Server has become unreachable.');
      }
      
      // Server came back up
      if (wasServerDown && !isServerDown) {
        showAlert('success', 'Server is UP!', 'Server has recovered and is now reachable.');
      }
      
      // Failover status changed
      if (failoverChanged) {
        const message = serverData.failover === 'PRIMARY' 
          ? 'System has switched to PRIMARY server.'
          : 'FAILOVER detected! System has switched to BACKUP server.';
        
        showAlert(
          serverData.failover === 'PRIMARY' ? 'success' : 'warning',
          'Failover Status Change',
          message
        );
      }
      
      // Resource usage alerts
      if (highCpuUsage && serverData?.cpu !== previousServerData?.cpu) {
        showAlert('warning', 'High CPU Usage', `CPU usage is at ${serverData.cpu}%!`);
      }
      
      if (highMemoryUsage && serverData?.memory !== previousServerData?.memory) {
        showAlert('warning', 'High Memory Usage', `Memory usage is at ${serverData.memory}%!`);
      }
    }
  }, [serverData, previousServerData]);

  // Custom toast notification
  const showAlert = (type, title, message) => {
    toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex`}>
          <div className={`p-4 flex-1 rounded-lg flex items-start ${
            type === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200' :
            type === 'warning' ? 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' :
            'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            <div className="flex-shrink-0 mr-3">
              {type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />}
              {type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />}
              {type === 'success' && <Check className="w-5 h-5 text-green-500 dark:text-green-400" />}
              {type === 'info' && <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
            </div>
            <div className="flex-1">
              <div className="font-medium">{title}</div>
              <div className="text-sm mt-1">{message}</div>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return <Toaster position="top-right" />;
};

export default Alerts;