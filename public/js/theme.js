// =============================================================================
// THEME MANAGEMENT MODULE
// =============================================================================

import { d, setClass, onReady } from './utils/helpers.js';

// Initialize theme system
onReady(() => {
    const themeToggle = d.querySelector('#themeToggle');
    const themeIcon = d.querySelector('#themeIcon');
    
    // =============================================================================
    // THEME HELPER FUNCTIONS
    // =============================================================================
    
    // Get current theme
    const getCurrentTheme = () => {
        return document.documentElement.getAttribute('data-theme') || 'light';
    };
    
    // Update icon based on theme
    const updateIcon = (theme) => {
        if (theme === 'dark') {
            setClass(themeIcon, 'bi bi-moon-fill');
        } else {
            setClass(themeIcon, 'bi bi-sun-fill');
        }
    };
    
    // Set theme
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcon(theme);
    };
    
    // =============================================================================
    // THEME INITIALIZATION
    // =============================================================================
    
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // =============================================================================
    // EVENT HANDLERS
    // =============================================================================
    
    // Theme toggle handler
    const handleThemeToggle = () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };
    
    // System theme change handler
    const handleSystemThemeChange = (e) => {
        // Only apply system preference if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            const systemTheme = e.matches ? 'dark' : 'light';
            setTheme(systemTheme);
        }
    };
    
    // =============================================================================
    // EVENT LISTENERS SETUP
    // =============================================================================
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', handleThemeToggle);
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);
}); 