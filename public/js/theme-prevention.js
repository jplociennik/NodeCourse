/* Theme Flash Prevention - Additional Logic */

import { onReady } from './utils/helpers.js';

// This runs after the critical inline script in <head>
// Additional background color setting for extra protection
// Prevent theme flash
onReady(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Set body background color based on current theme (not default)
    if (currentTheme === 'dark') {
        document.body.style.backgroundColor = '#0d1117';
        document.documentElement.style.backgroundColor = '#0d1117';
    } else if (currentTheme === 'light') {
        document.body.style.backgroundColor = '#ffffff';
        document.documentElement.style.backgroundColor = '#ffffff';
    }
    
    // Remove inline styles after CSS loads to let CSS variables take over
    setTimeout(() => {
        document.body.style.removeProperty('background-color');
        document.documentElement.style.removeProperty('background-color');
    }, 150);
}); 