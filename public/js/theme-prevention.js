import { onReady } from './utils/helpers.js';
import { THEME, getCurrentTheme, applyThemeBackground, removeThemeBackground } from './theme.js';

// This runs after the critical inline script in <head>
// Additional background color setting for extra protection
// Prevent theme flash
onReady(() => {

    const currentTheme = getCurrentTheme();   
    if (currentTheme === THEME.NAMES.DARK || currentTheme === THEME.NAMES.LIGHT) {
        applyThemeBackground(currentTheme);
    }
    
    // Remove inline styles after CSS loads to let CSS variables take over
    setTimeout(() => { removeThemeBackground(); }, THEME.TRANSITION_DELAY);
}); 