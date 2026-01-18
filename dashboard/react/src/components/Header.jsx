import React from 'react';
import { Moon, Sun, CloudCog } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center transition-colors duration-200">
      <div className="flex items-center space-x-2">
        <CloudCog className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
          Cloud Failover System
        </h1>
      </div>
      
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </header>
  );
};

export default Header;