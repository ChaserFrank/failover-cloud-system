import React, { useEffect, useState } from 'react';

const ResourceGauge = ({ label, value = 0, icon, maxValue = 100 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animate the value change
  useEffect(() => {
    setDisplayValue(0);
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Determine color based on value
  const getColor = (val) => {
    if (val < 60) return 'text-green-500 dark:text-green-400';
    if (val < 85) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  // Determine background color based on value
  const getBgColor = (val) => {
    if (val < 60) return 'bg-green-500 dark:bg-green-400';
    if (val < 85) return 'bg-yellow-500 dark:bg-yellow-400';
    return 'bg-red-500 dark:bg-red-400';
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${getColor(displayValue)}`}>
          {displayValue}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getBgColor(displayValue)}`}
          style={{ width: `${displayValue}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ResourceGauge;