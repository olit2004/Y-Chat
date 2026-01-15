import React from 'react';
import { FaSun, FaMoon } from "react-icons/fa";


import { useDarkMode } from '../hooks/darkMode'; 

const ThemeToggle = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  console.log(isDarkMode)

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg transition-colors duration-300 
                 bg-sidebar dark:bg-surface 
                 text-text-primary 
                 hover:opacity-80"
      aria-label="Toggle dark mode"
    >
      
      {isDarkMode ?  <FaSun className="text-yellow-400 w-6 h-6" /> :<FaMoon className="text-blue-600 w-6 h-6" />}
    </button>
  );
};

export default ThemeToggle;