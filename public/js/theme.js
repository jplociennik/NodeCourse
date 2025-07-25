// =============================================================================
// THEME MANAGEMENT MODULE
// =============================================================================

import { d, setClass, setStyle, removeStyle, onReady } from './utils/helpers.js';

// =============================================================================
// THEME CONSTANTS
// =============================================================================

const THEME = {
    NAMES: {
        DARK: 'dark',
        LIGHT: 'light'
    },
    COLORS: {
        DARK: '#0d1117',
        LIGHT: 'var(--bg-primary)'
    },
    ATTRIBUTE: 'data-theme',
    TRANSITION_DELAY: 150
};

// =============================================================================
// EXPORTABLE THEME UTILITY FUNCTIONS
// =============================================================================

const getCurrentTheme = () => {
    return d.documentElement.getAttribute(THEME.ATTRIBUTE) || THEME.NAMES.LIGHT;
};

const setThemeBackgroundColor = (element, theme) => {
    const color = theme === THEME.NAMES.DARK ? THEME.COLORS.DARK : THEME.COLORS.LIGHT;
    setStyle(element, 'background-color', color);
};

const removeThemeBackgroundColor = (element) => {
    removeStyle(element, 'background-color');
};

const applyThemeBackground = (theme) => {
    setThemeBackgroundColor(d.body, theme);
    setThemeBackgroundColor(d.documentElement, theme);
};

const removeThemeBackground = () => {
    removeThemeBackgroundColor(d.body);
    removeThemeBackgroundColor(d.documentElement);
};

// =============================================================================
// THEME MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Updates theme icon based on current theme
 * @param {HTMLElement} iconElement - Icon element to update
 * @param {string} theme - Current theme name
 */
const updateIcon = (iconElement, theme) => {
    if (!iconElement) return;
    if (theme === THEME.NAMES.DARK) setClass(iconElement, 'bi bi-moon-fill');
    else setClass(iconElement, 'bi bi-sun-fill');
};

/**
 * Sets theme and updates all related UI elements
 * @param {string} theme - Theme name to set
 * @param {HTMLElement} iconElement - Optional icon element to update
 */
const setTheme = (theme, iconElement = null) => {
    d.documentElement.setAttribute(THEME.ATTRIBUTE, theme);
    localStorage.setItem('theme', theme);
    
    if (iconElement) updateIcon(iconElement, theme);
};

// =============================================================================
// EVENT HANDLERS
// =============================================================================

/**
 * Handles theme toggle button click
 * @param {HTMLElement} iconElement - Icon element to update
 */
const handleThemeToggle = (iconElement) => {
    const newTheme = getCurrentTheme() === THEME.NAMES.DARK ? THEME.NAMES.LIGHT : THEME.NAMES.DARK;
    setTheme(newTheme, iconElement);
};

/**
 * Handles system theme changes
 * @param {MediaQueryListEvent} e - Media query event
 * @param {HTMLElement} iconElement - Icon element to update
 */
const handleSystemThemeChange = (e, iconElement) => {
    // Only apply system preference if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
        const systemTheme = e.matches ? THEME.NAMES.DARK : THEME.NAMES.LIGHT;
        setTheme(systemTheme, iconElement);
    }
};

// =============================================================================
// INITIALIZATION
// =============================================================================

onReady(() => {
    const themeIcon = d.querySelector('#themeIcon');
    
    setTheme(localStorage.getItem('theme') || THEME.NAMES.LIGHT, themeIcon);

    // Listen for system theme changes (can't be moved to universal delegation)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => handleSystemThemeChange(e, themeIcon));
});

export { 
    THEME,
    getCurrentTheme,
    applyThemeBackground,
    removeThemeBackground,
    handleThemeToggle
}; 