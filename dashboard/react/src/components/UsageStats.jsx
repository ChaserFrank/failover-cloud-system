import React from 'react';
import ResourceGauge from './ResourceGauge';
import { Cpu, HardDrive } from 'lucide-react';

const UsageStats = ({ cpuUsage, memoryUsage }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Resource Usage
      </h2>
      
      <div className="space-y-6">
        <ResourceGauge 
          label="CPU Usage" 
          value={cpuUsage}
          icon={<Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        />
        
        <ResourceGauge 
          label="Memory Usage" 
          value={memoryUsage}
          icon={<HardDrive className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
        />
      </div>
    </div>
  );
};

export default UsageStats;