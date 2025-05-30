import { useEffect } from 'react';
import { useAnomalyStore } from '../store/anomalyStore';

export const useTheme = () => {
  const { theme, setTheme } = useAnomalyStore();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    // Store theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};